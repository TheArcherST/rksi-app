import {ScheduleUpdateDTO} from "../../interfaces/api/editSchedule";
import UpdateSchedule, {WrappedLessonDTO, WrappedScheduleDTO} from "./base";
import {removeEntityFromCollection} from "../../infrastructure/utils";
import PersonDTO from "../../interfaces/person";


export default class AttachTeacherToLesson implements UpdateSchedule {
    lesson: WrappedLessonDTO;
    teacher: PersonDTO;

    constructor(lesson: WrappedLessonDTO, teacher: PersonDTO) {
        this.lesson = lesson;
        this.teacher = teacher;
    }

    apply(schedule: WrappedScheduleDTO) {
        this.lesson.currentTemplate.teachers.push(this.teacher);
    }

    rollback(schedule: WrappedScheduleDTO) {
        removeEntityFromCollection(this.lesson.currentTemplate.teachers, this.teacher);
    }

    schema(quiet?: boolean | null): ScheduleUpdateDTO[] {
        if (!this.lesson.isCanPushEdit) return [];

        return [
            {
                edit_lesson: {
                    lesson: {id: this.lesson.databaseRepresentation!.id},
                    attach_teacher: {id: this.teacher.id},
                    quiet: quiet === undefined ? null : quiet,
                }
            }
        ]
    }

    getRelatedLesson(): WrappedLessonDTO | null {
        return this.lesson;
    }
}
