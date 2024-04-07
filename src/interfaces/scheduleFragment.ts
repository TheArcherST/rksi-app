import Entity from "./entity";
import TimetableDTO from "./timetable";


export default interface ScheduleFragmentDTO extends Entity {
    building_number: number;
    timetable: TimetableDTO;
}
