import './Schedule.css'
import {DataScroller} from "primereact/datascroller";
import LessonDTO from "../../interfaces/lesson";
import APIAdapter, {APIError} from "../../adapters/api";
import {useEffect, useRef, useState} from "react";
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
    const filterTabIndexRef = useRef<number>(0);

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
            filterTabIndexRef.current = ScheduleFilterTabIndex.GROUP;
        }
        if (paramTeacher !== null) {
            gateway.resolveReference({person_reference: {id: Number.parseInt(paramTeacher)}}).then(
              (response) => {
                  setTeacherEntity(response.person);
              }
            )
            setFilterTabIndex(ScheduleFilterTabIndex.TEACHER);
            filterTabIndexRef.current = ScheduleFilterTabIndex.TEACHER;
        }
    }, []);

    useEffect(() => {
        if (!groupEntity) return;
        storage.setScheduleGroup(groupEntity);
    })
    useEffect(() => {
        if (!teacherEntity) return;
        storage.setScheduleTeacher(teacherEntity);
    })

    useEffect(() => {
        switch (filterTabIndexRef.current) {
            case ScheduleFilterTabIndex.TEACHER:
                searchParams.delete("group");
                if (!teacherEntity) break;
                searchParams.set("teacher", teacherEntity.id.toString());
                break;
            case ScheduleFilterTabIndex.GROUP:
                searchParams.delete("teacher");
                if (!groupEntity) break;
                searchParams.set("group", groupEntity.id.toString());
                break;
        }
        setSearchParams(searchParams);
    }, [teacherEntity, groupEntity, filterTabIndex]);

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
        filterTabIndexRef.current = e.index;
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
                        setEntity={setGroupEntity}
                        resolveEntitiesMention={resolveGroupMention}
                        dropdown={true}
                        placeholder={"Группа..."}
                    />
                </TabPanel>
                <TabPanel header="По преподавателю">
                    <CellSelect<PersonDTO>
                        entity={teacherEntity}
                        setEntity={setTeacherEntity}
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
