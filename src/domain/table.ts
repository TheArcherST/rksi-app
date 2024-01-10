import LessonDTO from "../interfaces/lesson";
import {EditScheduleResponseDTO, ScheduleUpdateDTO} from "../interfaces/api/editSchedule";
import AuditoriumDTO from "../interfaces/auditorium";
import APIAdapter from "../adapters/api";
import UpdateSchedule, {createLessonTemplateDTO, WrappedLessonDTO, WrappedScheduleDTO} from "./updateSchedule/base";
import DeleteLesson from "./updateSchedule/deleteLesson";
import CreateLesson from "./updateSchedule/createLesson";
import ScheduleSectionDTO from "../interfaces/scheduleSection";
import SaneDate from "../infrastructure/saneDate";



export default class ScheduleTable {
    schedule: WrappedScheduleDTO;
    updates: UpdateSchedule[] = [];
    headIndex: number = -1;
    initialUpdatesCount: number = 0;

    constructor(schedule: WrappedScheduleDTO, initialUpdates: UpdateSchedule[] = []) {
        this.schedule = schedule;
        this.updates = initialUpdates;
        for (let i = 0; i < this.updates.length; i++) {
            this.redo();
        }
        this.headIndex = this.updates.length - 1;
        this.initialUpdatesCount = this.updates.length;
    }

    addUpdate(update: UpdateSchedule) {
        this.updates.length = this.headIndex + 1;
        this.updates.push(update);
    }

    undo() {
        if (this.headIndex - this.initialUpdatesCount >= 0) {
            const update = this.updates[this.headIndex--];
            update.rollback(this.schedule);
        }
    }

    redo() {
        if (this.headIndex <= this.updates.length - 1) {
            const update = this.updates[++this.headIndex];
            update.apply(this.schedule);
        }
    }

    getUpdateSchemas(): ScheduleUpdateDTO[] {
        let updatesSchemas = [];
        for (let i = 0; i <= this.headIndex; i++) {
            const update = this.updates[i];

            // code block below checks for some not-delete updates had been applied
            // to objects, that actually not exists at the moment.
            if (!(update instanceof DeleteLesson)) {
                const relatedLesson = update.getRelatedLesson();
                if (relatedLesson) {
                    if (this.schedule.wrappedLessons.indexOf(relatedLesson) === -1) {
                        continue
                    }
                }
            }

            updatesSchemas.push(...update.schema());
        }
        return updatesSchemas;
    }

    push(client: APIAdapter): Promise<EditScheduleResponseDTO> {
        const updatesSchemas = this.getUpdateSchemas();
        const [updates, headIndex] = [[...this.updates], this.headIndex];
        this.updates = [];
        this.headIndex = -1;
        return client.editSchedule(
            {updates: updatesSchemas}
        ).catch((err) => {
            this.updates = updates;
            this.headIndex = headIndex;
            throw err;
        })
    }

    static generateInitialUpdates(
        lessons: LessonDTO[],
        auditoriums: AuditoriumDTO[],
    ): UpdateSchedule[] {
        const updates = [];
        for (const auditorium of auditoriums) {
            if (!lessons.filter(i => i.auditorium.id === auditorium.id).length) {
                const initial = Object.assign(createLessonTemplateDTO(), {
                    auditorium: auditorium,
                });
                const current = Object.assign(createLessonTemplateDTO(), {
                    auditorium: auditorium,
                });
                updates.push(new CreateLesson(
                    new WrappedLessonDTO(
                        null,
                        [],
                        initial,
                        current,
                    )
                ))
            }
        }
        return updates;
    }
    static async pull(
        client: APIAdapter,
        date: Date,
        buildingNumbers: number[],
        scheduleSection: ScheduleSectionDTO | null
    ): Promise<ScheduleTable> {
        const serializedDate = new SaneDate(date).toString();

        let [auditoriums, scheduleSections, schedule] = await Promise.all([
            client.getAuditoriums({
                building_numbers: buildingNumbers
            }),
            client.resolveMention({
                schedule_section_mention: {context: {date: serializedDate}}
            }),
            client.readSchedule({
                date: date,
                building_numbers: buildingNumbers,
                schedule_section: scheduleSection,
            })])

        const wrappedLessons = schedule.lessons.map(
            i => new WrappedLessonDTO(
                i,
                [],
                Object.assign(
                    createLessonTemplateDTO(),
                    {
                        auditorium: i.auditorium
                    }
                ),
                i
            )
        )

        return new ScheduleTable(
            {
                wrappedLessons: wrappedLessons,
                auditoriums: auditoriums.auditoriums,
                scheduleSections: scheduleSections.schedule_sections,
                date: date,
            },
            this.generateInitialUpdates(schedule.lessons, auditoriums.auditoriums),
        );
    }
}
