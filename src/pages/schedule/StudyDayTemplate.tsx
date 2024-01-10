import ScheduleDTO from "../../interfaces/schedule";
import {DateTime} from "luxon";

import "./StudyDayTemplate.css";
import LessonTemplate from "./LessonTemplate";


function StudyDayHeader({date}: {date: DateTime}) {
    return (
        <div className="study-day-header">
            {date
                .setLocale('ru')
                .toLocaleString()}
        </div>
    );
}

export default function StudyDayTemplate(schedule: ScheduleDTO) {
    const lessons = schedule.lessons;

    if (lessons.length === 0) {
        return null;
    }

    const first = lessons[0];
    const firstDate = DateTime.fromISO(first.schedule_section.starts_at);

    return (
        <div className="study-day-template">
            <StudyDayHeader date={firstDate} />
            {schedule.lessons.map(LessonTemplate)}
        </div>
    );
}
