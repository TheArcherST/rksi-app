import ScheduleSectionDTO from "../scheduleSection";
import LessonDTO from "../lesson";
import GroupMention from "../mentions/group";
import GroupReference from "../references/group";


export interface ReadScheduleDTO {
    date?: string | Date | null,
    period_start?: string | Date | null,
    period_end?: string | Date | null,
    building_numbers?: number[],
    schedule_section?: ScheduleSectionDTO | null,
    group?: GroupReference | null,
}


export interface ReadScheduleResponseDTO {
    lessons: LessonDTO[],
}
