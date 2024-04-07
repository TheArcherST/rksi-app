import BaseMention, {BaseMentionContext} from "./base";


export interface ScheduleSectionMentionContext extends BaseMentionContext {
    date?: string | null;
    building_numbers?: number[] | null;
    schedule_fragment_id?: number | null;
}


export default interface ScheduleSectionMention extends BaseMention<ScheduleSectionMentionContext>{

}
