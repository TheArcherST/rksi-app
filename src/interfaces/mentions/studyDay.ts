import BaseMention, {BaseMentionContext} from "./base";


export interface StudyDayMentionContext extends BaseMentionContext {
    date: string,
}


export default interface StudyDayMention extends BaseMention<StudyDayMentionContext>{

}
