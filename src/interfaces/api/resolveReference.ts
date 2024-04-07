import GroupDTO from "../group";
import PersonDTO from "../person";
import AuditoriumDTO from "../auditorium";
import DisciplineDTO from "../discipline";
import ScheduleSectionDTO from "../scheduleSection";
import GroupReference from "../references/group";
import PersonReference from "../references/person";
import AuditoriumReference from "../references/auditorium";
import DisciplineReference from "../references/discipline";
import TimetableReference from "../references/timetable";
import ScheduleFragmentReference from "../references/scheduleFragment";
import ScheduleSectionReference from "../references/scheduleSection";
import TimetableDTO from "../timetable";
import ScheduleFragmentDTO from "../scheduleFragment";



export interface ResolveReference {
    group_reference?: GroupReference;
    person_reference?: PersonReference;
    auditorium_reference?: AuditoriumReference;
    discipline_reference?: DisciplineReference;
    timetable_reference?: TimetableReference;
    schedule_fragment_reference?: ScheduleFragmentReference;
    schedule_section_reference?: ScheduleSectionReference;
}


export interface ResolveReferenceResponse {
    group: GroupDTO | null;
    person: PersonDTO | null;
    auditorium: AuditoriumDTO | null;
    discipline: DisciplineDTO | null;
    timetable: TimetableDTO | null;
    schedule_fragment: ScheduleFragmentDTO | null;
    schedule_section: ScheduleSectionDTO | null;
}
