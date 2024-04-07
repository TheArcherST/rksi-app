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
import storage from "../../infrastructure/storage";
import {validateYupSchema} from "formik";
import PersonReference from "../../interfaces/references/person";
import PersonDTO from "../../interfaces/person";
import {TabPanel, TabView, TabViewTabChangeEvent} from "primereact/tabview";
import {useSearchParams} from "react-router-dom";


async function fetchSchedule(group: GroupReference | null, teacher: PersonReference | null) : Promise<ReadScheduleResponseDTO> {
    const api = new APIAdapter();
    const start = DateTime.now();
    const end = start.plus({day: 7});
    return await api.readSchedule({
        period_start: start.toJSDate(),
        period_end: end.toJSDate(),
        group: group,
        teacher: teacher,
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


function ScheduleView({group, teacher}: {group: GroupReference | null, teacher: PersonReference | null}) {
    const [schedule, setSchedule] = useState<ScheduleDTO>();

    const emptyMessage: string = schedule === undefined ? "Подождите..." : "Занятий нет";

    useEffect(() => {
        if (!teacher && !group) {
            return setSchedule({lessons: []});
        }
        fetchSchedule(group, teacher).then(response =>
            setSchedule(response)
        )
    }, [group, teacher]);

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


interface ScheduleFiltersProps {

}


enum ScheduleFilterTabIndex {
    GROUP = 0,
    TEACHER
}


function Schedule() {
    const gateway = new APIAdapter();
    const [searchParams, setSearchParams] = useSearchParams();
    const [filterTabIndex, setFilterTabIndex] = useState<number>(0);
    const initialGroup = storage.getScheduleGroup();
    const initialTeacher = storage.getScheduleTeacher();
    const [groupEntity, setGroupEntity] = useState<GroupDTO | null>(initialGroup);
    const [teacherEntity, setTeacherEntity] = useState<PersonDTO | null>(initialTeacher);

    useEffect(() => {
        const paramGroup = searchParams.get("group");
        const paramTeacher = searchParams.get("teacher");
        if (paramGroup !== null) {
            gateway.resolveReference({group_reference: {id: Number.parseInt(paramGroup)}}).then(
              (response) => {
                  setGroupEntity(response.group);
              }
            )
            setFilterTabIndex(ScheduleFilterTabIndex.GROUP);
        }
        if (paramTeacher !== null) {
            gateway.resolveReference({person_reference: {id: Number.parseInt(paramTeacher)}}).then(
              (response) => {
                  setTeacherEntity(response.person);
              }
            )
            setFilterTabIndex(ScheduleFilterTabIndex.TEACHER);
        }

        // handle case, when user opened tab without params and its has benn loaded from local storage
        setSearchParams({
            ...searchParams,
            group: groupEntity?.id?.toString(),
            teacher: teacherEntity?.id?.toString(),
        })
    }, []);

    const onSetGroup = (value: GroupDTO) => {
        storage.setScheduleGroup(value);
        setSearchParams({...searchParams, group: value.id.toString()})
        setGroupEntity(value);
    }

    const onSetTeacher = (value: PersonDTO) => {
        storage.setScheduleTeacher(value);
        setSearchParams({...searchParams, teacher: value.id.toString()})
        setTeacherEntity(value);
    }
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

    const resolveTeacherMention = async (mention: string) => {
        const gateway = new APIAdapter();
        try {
            let response = await gateway.resolveMention(
                {person_mention: {natural_language: mention}}
            )
            return response.persons;
        } catch (APIError) {
            return [];
        }
    };

    const onTabChange = (e: TabViewTabChangeEvent) => {
        setFilterTabIndex(e.index);
        if (e.index === ScheduleFilterTabIndex.TEACHER) {
            setSearchParams({...searchParams, teacher: teacherEntity?.id?.toString()})
        } else if (e.index === ScheduleFilterTabIndex.GROUP) {
            setSearchParams({...searchParams, group: groupEntity?.id?.toString()})
        }
    }

    return (
        <div className={"schedule-container"}>
            <TabView
                onTabChange={onTabChange}
                activeIndex={filterTabIndex}
            >
                <TabPanel header="По группе">
                    <CellSelect<GroupDTO>
                        entity={groupEntity}
                        setEntity={onSetGroup}
                        resolveEntitiesMention={resolveGroupMention}
                        dropdown={true}
                        placeholder={"Группа..."}
                    />
                </TabPanel>
                <TabPanel header="По преподавателю">
                    <CellSelect<PersonDTO>
                        entity={teacherEntity}
                        setEntity={onSetTeacher}
                        resolveEntitiesMention={resolveTeacherMention}
                        dropdown={true}
                        placeholder={"ФИО..."}
                    />
                </TabPanel>
            </TabView>
            <ScheduleView
                group={filterTabIndex === ScheduleFilterTabIndex.GROUP ? groupEntity : null}
                teacher={filterTabIndex === ScheduleFilterTabIndex.TEACHER ? teacherEntity : null}
            />
        </div>
    );
}


export default Schedule;
