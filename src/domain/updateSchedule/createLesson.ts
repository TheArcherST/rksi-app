import LessonDTO from "../../interfaces/lesson";
import {ScheduleUpdateDTO} from "../../interfaces/api/editSchedule";
import SaneDate from "../../infrastructure/saneDate";
import UpdateSchedule, {WrappedLessonDTO, WrappedScheduleDTO} from "./base";


export default class CreateLesson implements UpdateSchedule {
    lesson: WrappedLessonDTO;
    template: LessonDTO | undefined;

    constructor(lesson: WrappedLessonDTO) {
        this.lesson = lesson;
    }

    apply(schedule: WrappedScheduleDTO) {
        schedule.wrappedLessons.push(this.lesson);
    }

    rollback(schedule: WrappedScheduleDTO) {
        schedule.wrappedLessons.splice(schedule.wrappedLessons.indexOf(this.lesson), 1);
    }

    schema(quiet?: boolean | null): ScheduleUpdateDTO[] {
        if (!this.lesson.isCanCreate) return [];
        console.log(this.lesson.currentTemplate);
        return [
            {
                create_lesson: {
                    schedule_section: this.lesson.currentTemplate.schedule_section!.id,
                    auditorium: this.lesson.currentTemplate.auditorium!.id,
                    discipline: this.lesson.currentTemplate.discipline!.id,
                    teachers: this.lesson.currentTemplate.teachers.map(i => i.id),
                    groups: this.lesson.currentTemplate.groups.map(i => i.id),
                    quiet: quiet === undefined ? null : quiet,
                }
            }
        ]
    }

    getRelatedLesson(): WrappedLessonDTO | null {
        return this.lesson;
    }
}
