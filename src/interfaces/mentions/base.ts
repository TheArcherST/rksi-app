export interface BaseMentionContext {

}


export default interface BaseMention<MentionContextT extends BaseMentionContext> {
    natural_language?: string | null;
    context?: MentionContextT | null;
};
