import Entity from "./entity";

export default interface PersonDTO extends Entity {
    first_name: string;
    second_name: string;
    patronymic: string;
}
