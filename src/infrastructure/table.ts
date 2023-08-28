import LessonDTO from "../interfaces/lesson";
import {
    ScheduleUpdateDTO,
    EditScheduleResponseDTO
} from "../interfaces/api/editSchedule";
import PersonDTO from "../interfaces/person";
import GroupDTO from "../interfaces/group";
import ScheduleSectionDTO from "../interfaces/scheduleSection";
import AuditoriumDTO from "../interfaces/auditorium";
import DisciplineDTO from "../interfaces/discipline";
import APIAdapter from "../adapters/api";
import Entity from "../interfaces/entity";


function removeEntityFromCollection<T extends Entity>(arr: T[], value: T) {
    const presentedValue = arr.filter(i => i.id === value.id)[0]
    let index = arr.indexOf(presentedValue);
    if (index > -1) {
        arr.splice(index, 1);
    }
    return arr;
}


function refreshEntityInCollection<T extends Entity>(collection: T[], item: T) {
    removeEntityFromCollection<T>(collection, item);
    collection.push(item);
}


export interface ScheduleDTO {
    lessons: LessonDTO[];
}


export interface UpdateSchedule {
    /**
     * Update interface
     *
     * Interface for object, that represents some update of schedule.
     * Must be implemented method of generating API schema, and methods
     * to apply or rollback this update on existing schedule.
     *
     * Methods MAY not ensure same elements order in arrays ofter rollback.
     *
     * Get lesson method must return edited lesson, if update assumes same
     * lesson updating. Note, that create or delete is not update. This method
     * MAY return non-edited version of lesson, if it were not applied on
     * schedule, because this method **using only due schedule push**, so,
     * all requested update objects will be applied.
     *
     * */

    apply(schedule: ScheduleDTO): void;
    rollback(schedule: ScheduleDTO): void;
    schema(quiet?: boolean | null): ScheduleUpdateDTO[];
    getEditedLesson(): LessonDTO | null;
}



export class DeleteLesson implements UpdateSchedule {
    lesson: LessonDTO;

    constructor(lesson: LessonDTO) {
        this.lesson = lesson;
    }

    apply(schedule: ScheduleDTO) {
        removeEntityFromCollection(schedule.lessons, this.lesson);
    }

    rollback(schedule: ScheduleDTO) {
        schedule.lessons.push(this.lesson);
    }

    schema(quiet?: boolean | null): ScheduleUpdateDTO[] {
        return [
            {
                delete_lesson: {
                    lesson: this.lesson.id,
                    quiet: quiet === undefined ? null : quiet,
                }
            }
        ]
    }

    getEditedLesson(): LessonDTO | null {
        return null;
    }
}


export class AttachTeacherToLesson implements UpdateSchedule {
    lesson: LessonDTO;
    teacher: PersonDTO;

    constructor(lesson: LessonDTO, teacher: PersonDTO) {
        this.lesson = lesson;
        this.teacher = teacher;
    }

    apply(schedule: ScheduleDTO) {
        this.lesson.teachers.push(this.teacher);
    }

    rollback(schedule: ScheduleDTO) {
        removeEntityFromCollection(this.lesson.teachers, this.teacher);
    }

    schema(quiet?: boolean | null): ScheduleUpdateDTO[] {
        return [
            {
                edit_lesson: {
                    lesson: this.lesson.id,
                    attach_teacher: this.teacher.id,
                    quiet: quiet === undefined ? null : quiet,
                }
            }
        ]
    }

    getEditedLesson(): LessonDTO | null {
        return this.lesson;
    }
}


export class DetachTeacherFromLesson implements UpdateSchedule {
    lesson: LessonDTO;
    teacher: PersonDTO;

    constructor(lesson: LessonDTO, teacher: PersonDTO) {
        this.lesson = lesson;
        this.teacher = teacher;
    }

    apply(schedule: ScheduleDTO) {
        removeEntityFromCollection(this.lesson.teachers, this.teacher);
    }

    rollback(schedule: ScheduleDTO) {
        this.lesson.teachers.push(this.teacher);
    }

    schema(quiet?: boolean | null): ScheduleUpdateDTO[] {
        return [
            {
                edit_lesson: {
                    lesson: this.lesson.id,
                    detach_teacher: this.teacher.id,
                    quiet: quiet === undefined ? null : quiet,
                }
            }
        ]
    }

    getEditedLesson(): LessonDTO | null {
        return this.lesson;
    }
}


export class AttachGroupToLesson implements UpdateSchedule {
    lesson: LessonDTO;
    group: GroupDTO;

    constructor(lesson: LessonDTO, group: GroupDTO) {
        this.lesson = lesson;
        this.group = group;
    }

    apply(schedule: ScheduleDTO) {
        this.lesson.groups.push(this.group);
    }

    rollback(schedule: ScheduleDTO) {
        removeEntityFromCollection(this.lesson.groups, this.group);
    }

    schema(quiet?: boolean | null): ScheduleUpdateDTO[] {
        return [
            {
                edit_lesson: {
                    lesson: this.lesson.id,
                    attach_group: this.group.id,
                    quiet: quiet === undefined ? null : quiet,
                }
            }
        ]
    }

    getEditedLesson(): LessonDTO | null {
        return this.lesson;
    }
}


export class DetachGroupFromLesson implements UpdateSchedule {
    lesson: LessonDTO;
    group: GroupDTO;

    constructor(lesson: LessonDTO, group: GroupDTO) {
        this.lesson = lesson;
        this.group = group;
    }

    apply(schedule: ScheduleDTO) {
        removeEntityFromCollection(this.lesson.groups, this.group);
    }

    rollback(schedule: ScheduleDTO) {
        this.lesson.groups.push(this.group);
    }

    schema(quiet?: boolean | null): ScheduleUpdateDTO[] {
        return [
            {
                edit_lesson: {
                    lesson: this.lesson.id,
                    detach_group: this.group.id,
                    quiet: quiet === undefined ? null : quiet,
                }
            }
        ]
    }

    getEditedLesson(): LessonDTO | null {
        return this.lesson;
    }
}


export class ReplaceLessonScheduleSection implements UpdateSchedule {
    lesson: LessonDTO;
    scheduleSection: ScheduleSectionDTO;
    oldScheduleSection: ScheduleSectionDTO | null;

    constructor(lesson: LessonDTO, scheduleSection: ScheduleSectionDTO) {
        this.lesson = lesson;
        this.scheduleSection = scheduleSection;
        this.oldScheduleSection = null;
    }

    apply(schedule: ScheduleDTO) {
        this.oldScheduleSection = this.lesson.schedule_section;
        this.lesson.schedule_section = this.scheduleSection;
        refreshEntityInCollection(schedule.lessons, this.lesson);
    }

    rollback(schedule: ScheduleDTO) {
        this.lesson.schedule_section = this.oldScheduleSection!;
        refreshEntityInCollection(schedule.lessons, this.lesson);
    }

    schema(quiet?: boolean | null): ScheduleUpdateDTO[] {
        return [
            {
                edit_lesson: {
                    lesson: this.lesson.id,
                    replace_schedule_section: this.scheduleSection.id,
                    quiet: quiet === undefined ? null : quiet,
                }
            }
        ]
    }

    getEditedLesson(): LessonDTO | null {
        return this.lesson;
    }
}

export class ReplaceLessonAuditorium implements UpdateSchedule {
    lesson: LessonDTO;
    auditorium: AuditoriumDTO;
    oldAuditorium: AuditoriumDTO | null;

    constructor(lesson: LessonDTO, auditorium: AuditoriumDTO) {
        this.lesson = lesson;
        this.auditorium = auditorium;
        this.oldAuditorium = null;
    }

    apply(schedule: ScheduleDTO) {
        this.oldAuditorium = this.lesson.auditorium;
        this.lesson.auditorium = this.auditorium;
        refreshEntityInCollection(schedule.lessons, this.lesson);
    }

    rollback(schedule: ScheduleDTO) {
        this.lesson.auditorium = this.oldAuditorium!;
        refreshEntityInCollection(schedule.lessons, this.lesson);
    }

    schema(quiet?: boolean | null): ScheduleUpdateDTO[] {
        return [
            {
                edit_lesson: {
                    lesson: this.lesson.id,
                    replace_auditorium: this.auditorium.id,
                    quiet: quiet === undefined ? null : quiet,
                }
            }
        ]
    }

    getEditedLesson(): LessonDTO | null {
        return this.lesson;
    }
}


export class ReplaceLessonDiscipline implements UpdateSchedule {
    lesson: LessonDTO;
    discipline: DisciplineDTO;
    oldDiscipline: DisciplineDTO | null;

    constructor(lesson: LessonDTO, discipline: DisciplineDTO) {
        this.lesson = lesson;
        this.discipline = discipline;
        this.oldDiscipline = null;
    }

    apply(schedule: ScheduleDTO) {
        this.oldDiscipline = this.lesson.discipline;
        this.lesson.discipline = this.discipline;
        refreshEntityInCollection(schedule.lessons, this.lesson);
    }

    rollback(schedule: ScheduleDTO) {
        this.lesson.discipline = this.oldDiscipline!;
        refreshEntityInCollection(schedule.lessons, this.lesson);
    }

    schema(quiet?: boolean | null): ScheduleUpdateDTO[] {
        return [
            {
                edit_lesson: {
                    lesson: this.lesson.id,
                    replace_discipline: this.discipline.id,
                    quiet: quiet === undefined ? null : quiet,
                }
            }
        ]
    }

    getEditedLesson(): LessonDTO | null {
        return this.lesson;
    }
}


export class CreateLesson implements UpdateSchedule {
    lesson: LessonDTO;

    constructor(lesson: LessonDTO) {
        this.lesson = lesson;
    }

    apply(schedule: ScheduleDTO) {
        schedule.lessons.push(this.lesson);
    }

    rollback(schedule: ScheduleDTO) {
        removeEntityFromCollection(schedule.lessons, this.lesson);
    }

    schema(quiet?: boolean | null): ScheduleUpdateDTO[] {
        return [
            {
                create_lesson: {
                    schedule_section: this.lesson.schedule_section.id,
                    auditorium: this.lesson.auditorium.id,
                    discipline: this.lesson.discipline.id,
                    teachers: this.lesson.teachers.map(i => i.id),
                    groups: this.lesson.groups.map(i => i.id),
                    quiet: quiet === undefined ? null : quiet,
                }
            }
        ]
    }

    getEditedLesson(): LessonDTO | null {
        return null;
    }
}



export default class ScheduleTable {
    schedule: ScheduleDTO;
    updates: UpdateSchedule[] = [];
    headIndex: number = -1;

    constructor(schedule: ScheduleDTO) {
        this.schedule = schedule;
    }

    addUpdate(update: UpdateSchedule) {
        this.updates.push(update);
    }

    undo() {
        if (this.headIndex >= 0) {
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

    push(client: APIAdapter): Promise<EditScheduleResponseDTO> {
        this.updates.length = this.headIndex + 1;
        let updatesSchemas = [];
        for (let i = 0; i <= this.headIndex; i++) {
            const update = this.updates[i];
            updatesSchemas.push(...update.schema());
        }
        this.updates = [];
        this.headIndex = -1;
        return client.editSchedule(
            {updates: updatesSchemas}
        )
    }

    static pull(client: APIAdapter, date: Date): Promise<ScheduleTable> {
        return client.readSchedule(date).then(schedule => {
                return new ScheduleTable(schedule);
            }
        )
    }
}
