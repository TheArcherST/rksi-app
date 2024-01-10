import LessonDTO from "../../interfaces/lesson";
import './LessonTemplate.css';


export default function LessonTemplate(lesson: LessonDTO) {
    return (
        <div className="lesson-template" key={lesson.id}>
            <div></div>
            {lesson.schedule_section.display_text + " "}
            {lesson.auditorium.display_text + " "}
            {lesson.groups.map(i => i.display_text).join(", ") + " "}
            {lesson.teachers.map(i => i.display_text).join(", ") + " "}
            {lesson.discipline.display_text + " "}
        </div>
    );
}
