import Group from "./group";
import Person from "./person";
import Auditorium from "./auditorium";
import Discipline from "./discipline";


export interface ResolveMention {
    group_mention?: string | null;
    person_mention?: string | null;
    auditorium_mention?: string | null;
    discipline_mention?: string | null;
    time_circumstance_mention?: string | null;
}


export interface ResolveMentionResponse {
    groups: Group[];
    persons: Person[];
    auditoriums: Auditorium[];
    disciplines: Discipline[];
    time_circumstances: any[];
}
