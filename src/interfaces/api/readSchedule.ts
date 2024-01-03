import ScheduleSectionDTO from "../scheduleSection";
import LessonDTO from "../lesson";


export interface ReadScheduleDTO {
    date?: Date,
    building_numbers?: number[],
    schedule_section?: ScheduleSectionDTO | null,
}


export interface ReadScheduleResponseDTO {
    lessons: LessonDTO[],
}
