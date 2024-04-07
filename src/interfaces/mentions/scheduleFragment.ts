import BaseMention, {BaseMentionContext} from "./base";
import StudyDayMention from "./studyDay";


export interface ScheduleFragmentMentionContext extends BaseMentionContext {
  study_days?: StudyDayMention | null;
  building_numbers?: number[] | null;
}


export default interface ScheduleFragmentMention extends BaseMention<ScheduleFragmentMentionContext>{

}
