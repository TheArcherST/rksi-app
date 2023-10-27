import BaseMention from "../mentions/base";


export default interface BaseReference<IDT, MentionT extends BaseMention<any>> {
    id?: null | IDT;
    mention?: null | MentionT
}
