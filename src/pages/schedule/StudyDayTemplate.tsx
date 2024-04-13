import ScheduleDTO from "../../interfaces/schedule";
import {DateTime} from "luxon";

import "./StudyDayTemplate.css";
import LessonTemplate from "./LessonTemplate";


function StudyDayHeader({date}: {date: DateTime}) {
    const dateStr = date
        .setLocale('ru')
        .toLocaleString();
    let dateStrVerbose = date
        .setLocale('ru')
        .toLocaleString({
            weekday: 'long',
            month: 'long',
            day: 'numeric',
        });
    dateStrVerbose = dateStrVerbose[0].toUpperCase() + dateStrVerbose.slice(1);
    return (
        <div className="study-day-header" id={dateStr}>
            <a href={`#${dateStr}`}>
                {dateStrVerbose}
            </a>
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
        <div className="study-day-template" key={firstDate.toString()}>
            <StudyDayHeader date={firstDate} />
            {lessons.map((lesson) =>
                <LessonTemplate
                    entity={lesson}
                />
            )}
        </div>
    );
}
