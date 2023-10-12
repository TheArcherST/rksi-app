import Entity from "./entity";
import PersonDTO from "./person";


export default interface AccountDTO extends Entity {
    login: string;
    person?: PersonDTO | null;
}
