import Entity from "./entity";

export default interface GroupDTO extends Entity {
    specialization_abbreviation: string;
    course_number: number;
    group_number: number;
}
