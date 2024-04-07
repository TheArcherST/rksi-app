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
import StudyDayMention from "../mentions/studyDay";
import ScheduleFragmentMention from "../mentions/scheduleFragment";
import ScheduleFragmentDTO from "../scheduleFragment";
import TimetableDTO from "../timetable";
import TimetableMention from "../mentions/timetableMention";


export interface ResolveMention {
    group_mention?: GroupMention;
    person_mention?: PersonMention;
    auditorium_mention?: AuditoriumMention;
    discipline_mention?: DisciplineMention;
    study_day_mention?: StudyDayMention;
    timetable_mention?: TimetableMention;
    schedule_fragment_mention?: ScheduleFragmentMention;
    schedule_section_mention?: ScheduleSectionMention;
}


export interface ResolveMentionResponse {
    groups: GroupDTO[];
    persons: PersonDTO[];
    auditoriums: AuditoriumDTO[];
    disciplines: DisciplineDTO[];
    timetables: TimetableDTO[];
    schedule_fragments: ScheduleFragmentDTO[];
    schedule_sections: ScheduleSectionDTO[];
}
