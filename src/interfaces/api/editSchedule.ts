import LessonDTO from "../lesson";
import PersonReference from "../references/person";
import LessonReference from "../references/lesson";
import GroupReference from "../references/group";
import ScheduleSectionReference from "../references/scheduleSection";
import AuditoriumReference from "../references/auditorium";
import DisciplineReference from "../references/discipline";
import ScheduleFragmentReference from "../references/scheduleFragment";
import TimetableReference from "../references/timetable";


export interface EditLessonDTO {
    lesson: LessonReference;
    attach_teacher?: PersonReference | null;
    detach_teacher?: PersonReference | null;
    attach_group?: GroupReference | null;
    detach_group?: GroupReference | null;
    replace_schedule_section?: ScheduleSectionReference | null;
    replace_auditorium?: AuditoriumReference | null;
    replace_discipline? : DisciplineReference | null;
    quiet?: boolean | null;
}

export interface EditLessonResponseDTO {
    lesson: LessonDTO;
}

export interface CreateLessonDTO {
    schedule_section: ScheduleSectionReference;
    auditorium: AuditoriumReference;
    discipline: DisciplineReference;
    teachers: PersonReference[];
    groups: GroupReference[];
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
    lesson: LessonReference;
    quiet?: boolean | null;
}

export interface DeleteLessonResponseDTO {
}

export interface DeleteLessonDTO {

}


export interface EditScheduleFragmentDTO {
    schedule_fragment: ScheduleFragmentReference;
    set_timetable: TimetableReference;
}


export interface ScheduleUpdateDTO {
    create_lesson?: CreateLessonDTO | null;
    delete_lesson?: DeleteLessonDTO | null;
    edit_lesson?: EditLessonDTO | null;
    edit_schedule_fragment?: EditScheduleFragmentDTO | null;
}


export interface EditScheduleDTO {
    updates: ScheduleUpdateDTO[];
}


export interface EditScheduleResponseDTO {

}
