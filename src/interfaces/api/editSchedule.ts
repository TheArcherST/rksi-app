import LessonDTO from "../lesson";

type LessonReferenceAlias = string | number;
type PersonReferenceAlias = string | number;
type GroupReferenceAlias = string | number;
type ScheduleSectionMention = {mention: string, date: string};
type ScheduleSectionReferenceAlias = number | ScheduleSectionMention;
type AuditoriumReferenceAlias = string | number;
type DisciplineReferenceAlias = string | number;

export interface EditLessonDTO {
    lesson: LessonReferenceAlias;
    attach_teacher?: PersonReferenceAlias | null;
    detach_teacher?: PersonReferenceAlias | null;
    attach_group?: GroupReferenceAlias | null;
    detach_group?: GroupReferenceAlias | null;
    replace_schedule_section?: ScheduleSectionReferenceAlias | null;
    replace_auditorium?: AuditoriumReferenceAlias | null;
    replace_discipline? : DisciplineReferenceAlias | null;
    quiet?: boolean | null;
}

export interface EditLessonResponseDTO {
    lesson: LessonDTO;
}

export interface CreateLessonDTO {
    schedule_section: ScheduleSectionReferenceAlias
    auditorium: AuditoriumReferenceAlias
    discipline: DisciplineReferenceAlias
    teachers: PersonReferenceAlias[]
    groups: GroupReferenceAlias[]
    quiet?: boolean | null;
}

export interface CreateLessonResponseDTO {
    schedule_section: number;
    auditorium: number;
    discipline: number;
    teachers: number[];
    groups: number[];
}

export interface DeleteLessonDTO {
    lesson: LessonReferenceAlias;
    quiet?: boolean | null;
}

export interface DeleteLessonResponseDTO {
}

export interface DeleteLessonDTO {

}


export interface ScheduleUpdateDTO {
    create_lesson?: CreateLessonDTO | null;
    delete_lesson?: DeleteLessonDTO | null;
    edit_lesson?: EditLessonDTO | null;
}


export interface EditScheduleDTO {
    updates: ScheduleUpdateDTO[];
}


export interface EditScheduleResponseDTO {

}
