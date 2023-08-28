import GroupDTO from "../group";
import PersonDTO from "../person";
import AuditoriumDTO from "../auditorium";
import DisciplineDTO from "../discipline";
import ScheduleSectionDTO from "../scheduleSection";


export interface ResolveMention {
    group_mention?: string | null;
    person_mention?: string | null;
    auditorium_mention?: string | null;
    discipline_mention?: string | null;
    schedule_section_mention?: {mention: string, date: string} | null;
}


export interface ResolveMentionResponse {
    groups: GroupDTO[];
    persons: PersonDTO[];
    auditoriums: AuditoriumDTO[];
    disciplines: DisciplineDTO[];
    schedule_sections: ScheduleSectionDTO[];
}
