import Entity from "./entity";


export default interface ScheduleSectionDTO extends Entity {
    starts_at: string;
    ends_at: string;
}
