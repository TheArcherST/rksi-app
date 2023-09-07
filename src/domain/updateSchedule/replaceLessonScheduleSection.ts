import ScheduleSectionDTO from "../../interfaces/scheduleSection";
import {ScheduleUpdateDTO} from "../../interfaces/api/editSchedule";
import UpdateSchedule, {WrappedLessonDTO, WrappedScheduleDTO} from "./base";


export default class ReplaceLessonScheduleSection implements UpdateSchedule {
    lesson: WrappedLessonDTO;
    scheduleSection: ScheduleSectionDTO;
    oldScheduleSection: ScheduleSectionDTO | null;

    constructor(lesson: WrappedLessonDTO, scheduleSection: ScheduleSectionDTO) {
        this.lesson = lesson;
        this.scheduleSection = scheduleSection;
        this.oldScheduleSection = null;
    }

    apply(schedule: WrappedScheduleDTO) {
        this.oldScheduleSection = this.lesson.currentTemplate.schedule_section;
        this.lesson.currentTemplate.schedule_section = this.scheduleSection;
    }

    rollback(schedule: WrappedScheduleDTO) {
        this.lesson.currentTemplate.schedule_section = this.oldScheduleSection!;
    }

    schema(quiet?: boolean | null): ScheduleUpdateDTO[] {
        if (!this.lesson.isCanPushEdit) return [];

        return [
            {
                edit_lesson: {
                    lesson: this.lesson.databaseRepresentation!.id,
                    replace_schedule_section: this.scheduleSection.id,
                    quiet: quiet === undefined ? null : quiet,
                }
            }
        ]
    }

    getRelatedLesson(): WrappedLessonDTO | null {
        return this.lesson;
    }
}
