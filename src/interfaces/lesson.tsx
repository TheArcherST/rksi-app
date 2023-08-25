import Entity from "./entity";
import Auditorium from "./auditorium";
import Group from "./group";
import Person from "./person";
import Discipline from "./discipline";


export default interface Lesson extends Entity {
    starts_at: string;
    ends_at: string;
    groups: Group[];
    teachers: Person[];
    discipline: Discipline;
    auditorium: Auditorium;

};
