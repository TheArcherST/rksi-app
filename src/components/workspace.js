import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {Tag} from "primereact/tag";
import {AutoComplete} from "primereact/autocomplete";
import './workspace.css';
import Select from "react-select";
import APIAdapter from "../adapters/api";

import 'primereact/resources/themes/lara-light-blue/theme.css';   // theme
import 'primereact/resources/primereact.css';
import {useEffect, useState} from "react";                       // core css


function LessonsTable({lessons, setLessons}) {
    const [suggestions, setSuggestions] = useState([]);
    const [currentDiscipline, setCurrentDiscipline] = useState(null);
    const [currentAuditorium, setCurrentAuditorium] = useState(null);

    function resolveCurrent(_lesson, _key, _current) {
        return (_current === null
            || _current.id !== _lesson.id) ? _lesson[_key] : _current.value
    }
    function groupsFormatter(lesson) {
        return (
            <AutoComplete
                field="display_text"
                multiple
                forceSelection
                value={lesson.groups}
                completeMethod={
                    (e) => {
                        const api = new APIAdapter()
                        api.resolveMention({
                            group_mention: e.query,
                        }).then(data => {
                                setSuggestions(data ? data.groups : [])
                            }
                        )
                    }
                }
                suggestions={suggestions}
                onSubmit={
                    () => {
                        setLessons(lessons);
                    }
                }
                onChange={(e) => {
                    lesson.groups.length = 0;
                    lesson.groups.push(...e.value);
                }
                }/>
        );
    }

    function teachersFormatter(lesson) {
        return (
            <AutoComplete
                field="display_text"
                multiple
                forceSelection
                value={lesson.teachers}
                completeMethod={
                    (e) => {
                        const api = new APIAdapter()
                        api.resolveMention({
                            person_mention: e.query,
                        }).then(data => {
                                setSuggestions( data ? data.persons : [])
                            }
                        )
                    }
                }
                suggestions={suggestions}
                onChange={(e) => {
                    lesson.teachers.length = 0;
                    lesson.teachers.push(...e.value);
                }
                }/>
        );
    }

    function timeCircumstanceFormatter(lesson) {
        return (
            <AutoComplete forceSelection />
        );
    }

    function auditoriumFormatter(lesson) {
        return (
            <AutoComplete
                field="display_text"
                forceSelection
                value={resolveCurrent(lesson, "auditorium", currentAuditorium)}
                completeMethod={
                    (e) => {
                        const api = new APIAdapter()
                        api.resolveMention({
                            auditorium_mention: e.query,
                        }).then(data => {
                                setSuggestions(data ? data.auditoriums : [])
                            }
                        )
                    }
                }
                suggestions={suggestions}
                onSubmit={
                    () => setCurrentAuditorium(null)
                }
                onAbort={
                    () => setCurrentAuditorium(null)
                }
                onChange={(e) => {
                    setCurrentAuditorium({id: lesson.id, value: e.value});
                }}
            />
        );
    }

    function disciplineFormatter(lesson) {
        return (
            <AutoComplete
                field="display_text"
                forceSelection
                value={resolveCurrent(lesson, "discipline", currentDiscipline)}
                completeMethod={
                    (e) => {
                        const api = new APIAdapter()
                        api.resolveMention({
                            discipline_mention: e.query,
                        }).then(data => {
                                setSuggestions(data ? data.disciplines : [])
                            }
                        )
                    }
                }
                suggestions={suggestions}
                onSubmit={
                    () => setCurrentDiscipline(null)
                }
                onAbort={
                    () => setCurrentDiscipline(null)
                }
                onChange={(e) => {
                    setCurrentDiscipline({id: lesson.id, value: e.value});
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
                body={timeCircumstanceFormatter} />
            <Column
                field="auditorium"
                header="Ауд."
                body={auditoriumFormatter} />
            <Column
                field="groups"
                header="Группы"
                body={groupsFormatter}
                className={"column-groups"}/>
            <Column
                field="teachers"
                header="Преподаватели"
                body={teachersFormatter}
                className={"column-teachers"}/>
            <Column
                field="discipline"
                header="Дисциплина"
                body={disciplineFormatter}
                className={"column-discipline"}/>
        </DataTable>
    );
}


function Workspace() {
    const [lessons, setLessons] = useState([]);
    useEffect(() => {
        const gateway = new APIAdapter();
        gateway.readSchedule().then( data =>
            setLessons(data)
        )
    }, [])
    return (
        <main>
            <LessonsTable lessons={lessons}/>
        </main>
    );
}

export function hookSaveData() {

}

export function hookDateChange() {

}


export default Workspace;
