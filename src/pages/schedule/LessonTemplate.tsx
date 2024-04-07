import LessonDTO from "../../interfaces/lesson";
import './LessonTemplate.css';
import ScheduleSectionDTO from "../../interfaces/scheduleSection";
import DisciplineDTO from "../../interfaces/discipline";
import AuditoriumDTO from "../../interfaces/auditorium";
import GroupDTO from "../../interfaces/group";
import PersonDTO from "../../interfaces/person";


function ScheduleSectionTemplate({obj}: {obj: ScheduleSectionDTO}) {
    return (
        <>
            {obj.display_text + " "}
        </>
    );
}


function DisciplineTemplate({obj}: {obj: DisciplineDTO}) {
    return (
        <>
            <b>{obj.display_text + " "}</b>
        </>
    );
}


function AuditoriumTemplate({obj}: {obj: AuditoriumDTO}) {
    return (
        <>
            {", ауд. " + obj.display_text + " "}
        </>
    );
}


function GroupsTemplate({objs}: {objs: GroupDTO[]}) {
    return (
        <>
            {objs.map(i => i.display_text).join(", ") + " "}
        </>
    );
}


function TeachersTemplate({objs}: {objs: PersonDTO[]}) {
    return (
        <>
            {objs.map(i => i.display_text).join(", ")}
        </>
    );
}



export interface LessonTemplateProps {
    entity: LessonDTO;
    teacherKnown?: boolean;
    groupKnown?: boolean;
}


export default function LessonTemplate(
    {
        entity,
        teacherKnown=false,
        groupKnown=false
    }: LessonTemplateProps
) {
    return (
        <div className="lesson-template" key={entity.id}>
            <ScheduleSectionTemplate obj={entity.schedule_section}/>
            <br/>
            <DisciplineTemplate obj={entity.discipline} />
            <br/>
            {!groupKnown &&
                <GroupsTemplate objs={entity.groups}/>}
            {!teacherKnown &&
                <TeachersTemplate objs={entity.teachers}/>}
            <AuditoriumTemplate obj={entity.auditorium}/>
        </div>
    );
}
