import {ScheduleUpdateDTO} from "../../interfaces/api/editSchedule";
import UpdateSchedule, {LessonTemplateDTO, WrappedLessonDTO, WrappedScheduleDTO} from "./base";


export default class DeleteLesson implements UpdateSchedule {
    lesson: WrappedLessonDTO;
    oldTemplate: LessonTemplateDTO | null;

    constructor(lesson: WrappedLessonDTO) {
        this.lesson = lesson;
        this.oldTemplate = null;
    }

    apply(schedule: WrappedScheduleDTO) {
        this.oldTemplate  = this.lesson.currentTemplate;
        this.lesson.currentTemplate = this.lesson.initialTemplate;
    }

    rollback(schedule: WrappedScheduleDTO) {
        this.lesson.currentTemplate = this.oldTemplate!;
    }

    schema(quiet?: boolean | null): ScheduleUpdateDTO[] {
        if (!this.lesson.isCanPushDelete) return [];

        return [
            {
                delete_lesson: {
                    lesson: {id: this.lesson.databaseRepresentation!.id},
                    quiet: quiet === undefined ? null : quiet,
                }
            }
        ]
    }

    getRelatedLesson(): WrappedLessonDTO | null {
        return this.lesson;
    }
}
