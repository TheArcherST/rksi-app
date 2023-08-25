import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {Tag} from "primereact/tag";
import {AutoComplete} from "primereact/autocomplete";
import './workspace.css';
import Select from "react-select";
import APIAdapter, {MentionSyntaxError} from "../adapters/api";

import 'primereact/resources/themes/lara-light-blue/theme.css';   // theme
import 'primereact/resources/primereact.css';
import {useEffect, useState} from "react";                       // core css

import CellMultiselect from "./base/cellMultiselect";
import CellSelect from "./base/cellSelect";

import Lesson from "../interfaces/lesson";
import Group from "../interfaces/group";
import Person from "../interfaces/person";
import Auditorium from "../interfaces/auditorium";
import Discipline from "../interfaces/discipline";


type Current = {id: number, value: any};


function LessonsTable({lessons, setLessons} : {lessons: Lesson[], setLessons: (lessons: Lesson[]) => any}) {
    const gateway = new APIAdapter();

    function groupsFormatter(lesson: Lesson) {
        return (
            <CellMultiselect<Group>
                entitiesArray={lesson.groups}
                resolveEntitiesMention={(mention) => {
                    return gateway.resolveMention(
                        {group_mention: mention}
                    ).then((data) => {
                        return data.groups;
                    }).catch((err) => {
                        console.log(err);
                        return [];
                    })
                }}
                setEntitiesArray={(value) => {
                    lesson.groups.length = 0;
                    lesson.groups.push(...value);
                }
                }
            />
        );
    }

    function teachersFormatter(lesson: Lesson) {
        return (
            <CellMultiselect<Person>
                entitiesArray={lesson.teachers}
                resolveEntitiesMention={(mention) => {
                    return gateway.resolveMention(
                        {person_mention: mention}
                    ).then((data) => {
                        return data.persons;
                    }).catch((err) => {
                        console.log(err);
                        return [];
                    })
                }}
                setEntitiesArray={(value) => {
                    lesson.teachers.length = 0;
                    lesson.teachers.push(...value);
                }
                }
            />
        );
    }

    function timeCircumstanceFormatter(lesson: Lesson) {
        return (
            <AutoComplete forceSelection />
        );
    }

    function auditoriumFormatter(lesson: Lesson) {
        return (
            <CellSelect<Auditorium>
                entity={lesson.auditorium}
                setEntity={(entity) => {lesson.auditorium = entity}}
                resolveEntitiesMention={(mention) => {
                    return gateway.resolveMention(
                        {auditorium_mention: mention}
                    ).then((data) => {
                        return data.auditoriums;
                    }).catch((err) => {
                        console.log(err);
                        return [];
                    })
                }}
            />
        );
    }

    function disciplineFormatter(lesson: Lesson) {
        return (
            <CellSelect<Discipline>
                entity={lesson.discipline}
                setEntity={(entity) => {
                    lesson.discipline = entity
                }}
                resolveEntitiesMention={(mention) => {
                    return gateway.resolveMention(
                        {discipline_mention: mention}
                    ).then((data) => {
                        return data.disciplines;
                    }).catch((err) => {
                        console.log(err);
                        return [];
                    })
                }}
            />
        );
    }


    return (
        <DataTable
            value={lessons}
            tableStyle={{ minWidth: '50rem', }}
            showGridlines
        >
            <Column
                field="time_circumstance"
                header="Время"
                body={timeCircumstanceFormatter}
                className={"column-time-circumstance"} />
            <Column
                field="auditorium"
                header="Ауд."
                body={auditoriumFormatter}
                className={"column-auditorium"} />
            <Column
                field="groups"
                header="Группы"
                body={groupsFormatter}
                className={"column-groups"} />
            <Column
                field="teachers"
                header="Преподаватели"
                body={teachersFormatter}
                className={"column-teachers"} />
            <Column
                field="discipline"
                header="Дисциплина"
                body={disciplineFormatter}
                className={"column-discipline"} />
        </DataTable>
    );
}


function Workspace() {
    const [lessons, setLessons] = useState<Lesson[]>([]);
    useEffect(() => {
        const gateway = new APIAdapter();
        gateway.readSchedule().then( data =>
            setLessons(data)
        )
    }, [])
    return (
        <main>
            <LessonsTable
                setLessons={setLessons}
                lessons={lessons}/>
        </main>
    );
}

export function hookSaveData() {

}

export function hookDateChange() {

}


export default Workspace;
