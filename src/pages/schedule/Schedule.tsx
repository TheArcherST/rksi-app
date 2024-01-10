import './Schedule.css'
import {DataScroller} from "primereact/datascroller";
import LessonDTO from "../../interfaces/lesson";
import APIAdapter, {APIError} from "../../adapters/api";
import {useEffect, useState} from "react";
import ScheduleDTO from "../../interfaces/schedule";
import { DateTime } from "luxon";
import {ReadScheduleResponseDTO} from "../../interfaces/api/readSchedule";
import StudyDayTemplate from "./StudyDayTemplate";
import GroupDTO from "../../interfaces/group";
import GroupReference from "../../interfaces/references/group";
import CellSelect from "../../components/table/cellSelect";


async function fetchSchedule(group: GroupReference) : Promise<ReadScheduleResponseDTO> {
    const api = new APIAdapter();
    const start = DateTime.now();
    const end = start.plus({day: 7});
    return await api.readSchedule({
        period_start: start.toJSDate(),
        period_end: end.toJSDate(),
        group: group,
    });
}

function packStudyDays(lessons: LessonDTO[]): ScheduleDTO[] {
    let buffDate = null;
    const result: ScheduleDTO[] = [];
    let currentLst: LessonDTO[] | null = null;
    for (const lesson of lessons) {
        let currentDate = DateTime
            .fromISO(lesson.schedule_section.starts_at)
            .toISODate();
        if (!buffDate || currentDate !== buffDate) {
            buffDate = currentDate;
            currentLst = [];
            result.push({lessons: currentLst});
        }
        currentLst?.push(lesson);
    }
    return result;
}


function ScheduleView({group}: {group: GroupReference}) {
    const [schedule, setSchedule] = useState<ScheduleDTO>();

    const emptyMessage: string = schedule === undefined ? "Подождите..." : "Занятий нет";

    useEffect(() => {
        const api = new APIAdapter();
        fetchSchedule(group).then(response =>
            setSchedule(response)
        )
    }, [group]);

    const lessons = schedule?.lessons || [];
    const packedLessons = packStudyDays(lessons);

    return (
        <div className="schedule-view">
            <DataScroller
                value={packedLessons}
                itemTemplate={StudyDayTemplate}
                emptyMessage={emptyMessage}
                rows={packedLessons.length}
            />
        </div>
    );
}


function Schedule() {
    const [groupEntity, setGroupEntity] = useState<GroupDTO | null>(null);

    const resolveGroupMention = async (mention: string) => {
        const gateway = new APIAdapter();
        try {
            let response = await gateway.resolveMention(
                {group_mention: {natural_language: mention}}
            )
            return response.groups;
        } catch (APIError) {
            return [];
        }
    };

    return (
        <>
            <CellSelect<GroupDTO>
                entity={groupEntity}
                setEntity={setGroupEntity}
                resolveEntitiesMention={resolveGroupMention}
            />
            {groupEntity && <ScheduleView group={groupEntity}/>}
        </>
    );
}


export default Schedule;
