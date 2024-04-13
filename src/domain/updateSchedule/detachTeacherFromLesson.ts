// import LessonDTO from "../../interfaces/lesson";
import PersonDTO from "../../interfaces/person";
import {ScheduleUpdateDTO} from "../../interfaces/api/editSchedule";
import UpdateSchedule, {WrappedLessonDTO, WrappedScheduleDTO} from "./base";
import {removeEntityFromCollection} from "../../infrastructure/utils";


export default class DetachTeacherFromLesson implements UpdateSchedule {
    lesson: WrappedLessonDTO;
    teacher: PersonDTO;

    constructor(lesson: WrappedLessonDTO, teacher: PersonDTO) {
        this.lesson = lesson;
        this.teacher = teacher;
    }

    apply(schedule: WrappedScheduleDTO) {
        removeEntityFromCollection(this.lesson.currentTemplate.teachers, this.teacher);
    }

    rollback(schedule: WrappedScheduleDTO) {
        this.lesson.currentTemplate.teachers.push(this.teacher);
    }

    schema(quiet?: boolean | null): ScheduleUpdateDTO[] {
        if (!this.lesson.isCanPushEdit) return [];

        return [
            {
                edit_lesson: {
                    lesson: {id: this.lesson.databaseRepresentation!.id},
                    detach_teacher: {id: this.teacher.id},
                    quiet: quiet === undefined ? null : quiet,
                }
            }
        ]
    }

    getRelatedLesson(): WrappedLessonDTO | null {
        return this.lesson;
    }
}
