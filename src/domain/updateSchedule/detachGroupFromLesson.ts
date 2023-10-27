import GroupDTO from "../../interfaces/group";
import {ScheduleUpdateDTO} from "../../interfaces/api/editSchedule";
import UpdateSchedule, {WrappedLessonDTO, WrappedScheduleDTO} from "./base";
import {removeEntityFromCollection} from "../../infrastructure/utils";


export default class DetachGroupFromLesson implements UpdateSchedule {
    lesson: WrappedLessonDTO;
    group: GroupDTO;

    constructor(lesson: WrappedLessonDTO, group: GroupDTO) {
        this.lesson = lesson;
        this.group = group;
    }

    apply(schedule: WrappedScheduleDTO) {
        removeEntityFromCollection(this.lesson.currentTemplate.groups, this.group);
    }

    rollback(schedule: WrappedScheduleDTO) {
        this.lesson.currentTemplate.groups.push(this.group);
    }

    schema(quiet?: boolean | null): ScheduleUpdateDTO[] {
        if (!this.lesson.isCanPushEdit) return [];

        return [
            {
                edit_lesson: {
                    lesson: {id: this.lesson.databaseRepresentation!.id},
                    detach_group: {id: this.group.id},
                    quiet: quiet === undefined ? null : quiet,
                }
            }
        ]
    }

    getRelatedLesson(): WrappedLessonDTO | null {
        return this.lesson;
    }
}
