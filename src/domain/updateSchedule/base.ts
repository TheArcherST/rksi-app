import {ScheduleUpdateDTO} from "../../interfaces/api/editSchedule";
import LessonDTO from "../../interfaces/lesson";
import {deepEqualDTOs} from "../../infrastructure/utils";
import PersonDTO from "../../interfaces/person";
import DisciplineDTO from "../../interfaces/discipline";
import AuditoriumDTO from "../../interfaces/auditorium";
import GroupDTO from "../../interfaces/group";
import ScheduleSectionDTO from "../../interfaces/scheduleSection";



export interface LessonTemplateDTO {
    schedule_section: ScheduleSectionDTO | null;
    groups: GroupDTO[];
    teachers: PersonDTO[];
    discipline: DisciplineDTO | null;
    auditorium: AuditoriumDTO | null;
}


export function createLessonTemplateDTO(): LessonTemplateDTO {
    return {
        schedule_section: null,
        groups: [],
        teachers: [],
        discipline: null,
        auditorium: null,
    }
}


export class WrappedLessonDTO {
    databaseRepresentation: LessonDTO | null;
    relatedUpdates: UpdateSchedule[];
    initialTemplate: LessonTemplateDTO;
    currentTemplate: LessonTemplateDTO;

    constructor(
        databaseRepresentation: LessonDTO | null,
        relatedUpdates: UpdateSchedule[],
        initialTemplate: LessonTemplateDTO,
        currentTemplate: LessonTemplateDTO,
    ) {
        this.databaseRepresentation = databaseRepresentation
        this.relatedUpdates = relatedUpdates
        this.initialTemplate = initialTemplate
        this.currentTemplate = currentTemplate
    }

    get isCanDelete(): boolean {
        return !deepEqualDTOs(this.currentTemplate, this.initialTemplate);
    }

    get isCanPushDelete(): boolean {
        return this.isCanPushEdit;
    }

    get isCanPushEdit(): boolean {
        return this.databaseRepresentation !== null;
    }

    get isCanCreate(): boolean {
        return (
            this.currentTemplate.discipline !== null
            && this.currentTemplate.auditorium !== null
            && this.currentTemplate.schedule_section !== null
        )
    }
}


export interface WrappedScheduleDTO {
    wrappedLessons: WrappedLessonDTO[];
}


export default interface UpdateSchedule {
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

    apply(schedule: WrappedScheduleDTO): void;
    rollback(schedule: WrappedScheduleDTO): void;
    schema(quiet?: boolean | null): ScheduleUpdateDTO[];
    getRelatedLesson(): WrappedLessonDTO | null;
}
