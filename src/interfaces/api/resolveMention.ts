import GroupDTO from "../group";
import PersonDTO from "../person";
import AuditoriumDTO from "../auditorium";
import DisciplineDTO from "../discipline";
import ScheduleSectionDTO from "../scheduleSection";
import GroupMention from "../mentions/group";
import PersonMention from "../mentions/person";
import AuditoriumMention from "../mentions/auditorium";
import DisciplineMention from "../mentions/discipline";
import ScheduleSectionMention from "../mentions/scheduleSection";


export interface ResolveMention {
    group_mention?: GroupMention;
    person_mention?: PersonMention;
    auditorium_mention?: AuditoriumMention;
    discipline_mention?: DisciplineMention;
    schedule_section_mention?: ScheduleSectionMention;
}


export interface ResolveMentionResponse {
    groups: GroupDTO[];
    persons: PersonDTO[];
    auditoriums: AuditoriumDTO[];
    disciplines: DisciplineDTO[];
    schedule_sections: ScheduleSectionDTO[];
}
