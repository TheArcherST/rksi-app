import DisciplineDTO from "../../interfaces/discipline";
import {ScheduleUpdateDTO} from "../../interfaces/api/editSchedule";
import UpdateSchedule, {WrappedLessonDTO, WrappedScheduleDTO} from "./base";


export default class ReplaceLessonDiscipline implements UpdateSchedule {
    lesson: WrappedLessonDTO;
    discipline: DisciplineDTO;
    oldDiscipline: DisciplineDTO | null;

    constructor(lesson: WrappedLessonDTO, discipline: DisciplineDTO) {
        this.lesson = lesson;
        this.discipline = discipline;
        this.oldDiscipline = null;
    }

    apply(schedule: WrappedScheduleDTO) {
        this.oldDiscipline = this.lesson.currentTemplate.discipline;
        this.lesson.currentTemplate.discipline = this.discipline;
    }

    rollback(schedule: WrappedScheduleDTO) {
        this.lesson.currentTemplate.discipline = this.oldDiscipline!;
    }

    schema(quiet?: boolean | null): ScheduleUpdateDTO[] {
        if (!this.lesson.isCanPushEdit) return [];

        return [
            {
                edit_lesson: {
                    lesson: this.lesson.databaseRepresentation!.id,
                    replace_discipline: this.discipline.id,
                    quiet: quiet === undefined ? null : quiet,
                }
            }
        ]
    }

    getRelatedLesson(): WrappedLessonDTO | null {
        return this.lesson;
    }
}
