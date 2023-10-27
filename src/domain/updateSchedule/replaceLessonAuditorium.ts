import AuditoriumDTO from "../../interfaces/auditorium";
import {ScheduleUpdateDTO} from "../../interfaces/api/editSchedule";
import UpdateSchedule, {WrappedLessonDTO, WrappedScheduleDTO} from "./base";


export default class ReplaceLessonAuditorium implements UpdateSchedule {
    lesson: WrappedLessonDTO;
    auditorium: AuditoriumDTO;
    oldAuditorium: AuditoriumDTO | null;

    constructor(lesson: WrappedLessonDTO, auditorium: AuditoriumDTO) {
        this.lesson = lesson;
        this.auditorium = auditorium;
        this.oldAuditorium = null;
    }

    apply(schedule: WrappedScheduleDTO) {
        this.oldAuditorium = this.lesson.currentTemplate.auditorium;
        this.lesson.currentTemplate.auditorium = this.auditorium;
    }

    rollback(schedule: WrappedScheduleDTO) {
        this.lesson.currentTemplate.auditorium = this.oldAuditorium!;
    }

    schema(quiet?: boolean | null): ScheduleUpdateDTO[] {
        if (!this.lesson.isCanPushEdit) return [];

        return [
            {
                edit_lesson: {
                    lesson: {id: this.lesson.databaseRepresentation!.id},
                    replace_auditorium: {id: this.auditorium.id},
                    quiet: quiet === undefined ? null : quiet,
                }
            }
        ]
    }

    getRelatedLesson(): WrappedLessonDTO | null {
        return this.lesson;
    }
}
