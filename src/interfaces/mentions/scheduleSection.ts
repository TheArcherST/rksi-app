import BaseMention, {BaseMentionContext} from "./base";


export interface ScheduleSectionMentionContext extends BaseMentionContext {
    date: string;
}


export default interface ScheduleSectionMention extends BaseMention<ScheduleSectionMentionContext>{

}
