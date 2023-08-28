import Entity from "./entity";

export default interface AuditoriumDTO extends Entity {
    building_number: number;
    auditorium: string;
}
