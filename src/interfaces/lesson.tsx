import Entity from "./entity";
import AuditoriumDTO from "./auditorium";
import GroupDTO from "./group";
import PersonDTO from "./person";
import DisciplineDTO from "./discipline";
import ScheduleSectionDTO from "./scheduleSection";


export default interface LessonDTO extends Entity {
    schedule_section: ScheduleSectionDTO;
    groups: GroupDTO[];
    teachers: PersonDTO[];
    discipline: DisciplineDTO;
    auditorium: AuditoriumDTO;
};
