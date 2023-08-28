import {useEffect, useRef, useState} from "react";

import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";

import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primereact/resources/primereact.css';

import APIAdapter, {MentionSyntaxError} from "../adapters/api";

import CellMultiselect from "./base/cellMultiselect";
import CellSelect from "./base/cellSelect";

import LessonDTO from "../interfaces/lesson";
import GroupDTO from "../interfaces/group";
import PersonDTO from "../interfaces/person";
import AuditoriumDTO from "../interfaces/auditorium";
import DisciplineDTO from "../interfaces/discipline";

import './workspace.css';

import ScheduleTable, {
    AttachGroupToLesson,
    AttachTeacherToLesson,
    DetachGroupFromLesson,
    DetachTeacherFromLesson,
    ReplaceLessonAuditorium,
    ReplaceLessonDiscipline,
    ReplaceLessonScheduleSection,
    ScheduleDTO,
    UpdateSchedule
} from "../infrastructure/table";
import ScheduleSectionDTO from "../interfaces/scheduleSection";
import SaneDate from "../infrastructure/saneDate";
import {Toast, ToastState} from "primereact/toast";


function ScheduleTableView(
    {
        lessons, processUpdate, currentDate,
    }: {
        lessons: LessonDTO[],
        processUpdate: (update: UpdateSchedule) => any,
        currentDate: Date,
    }) {
    const gateway = new APIAdapter();

    function groupsFormatter(lesson: LessonDTO) {
        return (
            <CellMultiselect<GroupDTO>
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
                addEntity={(entity) => {
                    processUpdate(
                        new AttachGroupToLesson(lesson, entity)
                    )
                }}
                removeEntity={(entity) => {
                    processUpdate(
                        new DetachGroupFromLesson(lesson, entity)
                    )
                }}
            />
        );
    }

    function teachersFormatter(lesson: LessonDTO) {
        return (
            <CellMultiselect<PersonDTO>
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
                addEntity={(entity) => {
                    processUpdate(
                        new AttachTeacherToLesson(lesson, entity)
                    )
                }}
                removeEntity={(entity) => {
                    processUpdate(
                        new DetachTeacherFromLesson(lesson, entity)
                    )
                }}
            />
        );
    }

    function scheduleSectionFormatter(lesson: LessonDTO) {
        return (
            <CellSelect<ScheduleSectionDTO>
                entity={lesson.schedule_section}
                setEntity={(entity) => {
                    processUpdate(
                        new ReplaceLessonScheduleSection(lesson, entity)
                    );
                }}
                resolveEntitiesMention={(mention) => {
                    return gateway.resolveMention(
                        {
                            schedule_section_mention: {
                                "mention": mention,
                                "date": new SaneDate(currentDate).toString(),
                            }
                        }
                    ).then((data) => {
                        return data.schedule_sections;
                    }).catch((err) => {
                        console.log(err);
                        return [];
                    })
                }}
            />
        );
    }

    function auditoriumFormatter(lesson: LessonDTO) {
        return (
            <CellSelect<AuditoriumDTO>
                entity={lesson.auditorium}
                setEntity={(entity) => {
                    processUpdate(
                        new ReplaceLessonAuditorium(lesson, entity)
                    );
                }}
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

    function disciplineFormatter(lesson: LessonDTO) {
        return (
            <CellSelect<DisciplineDTO>
                entity={lesson.discipline}
                setEntity={(entity) => {
                    processUpdate(
                        new ReplaceLessonDiscipline(lesson, entity)
                    );
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
                field="schedule_section"
                header="Время"
                body={scheduleSectionFormatter}
                className={"column-schedule-section"} />
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


function Workspace(
    {
        currentDate, isSaveButtonPressed, setIsSaveInProgress, setIsSaveEnabled
    }: {
        currentDate: Date,
        isSaveButtonPressed: boolean,
        setIsSaveInProgress: (value: boolean) => any,
        setIsSaveEnabled: (value: boolean) => any,
    }) {
    const [table, setTable] = useState<ScheduleTable | null>(null);
    const [lessons, setLessons] = useState<LessonDTO[]>([]);
    const schedulePullToast = useRef<any>(null);

    useEffect(() => {
        const gateway = new APIAdapter();
        ScheduleTable.pull(gateway, currentDate).then(table => {
            setTable(table);
            setLessons(table.schedule.lessons);
        })
    }, [currentDate]);

    useEffect(() => {
        const gateway = new APIAdapter();
        if (table !== null && isSaveButtonPressed) {
            setIsSaveInProgress(true);
            setIsSaveEnabled(false);
            schedulePullToast.current!.show({
                severity: 'success',
                summary: 'Сохранено',
                detail: 'Изменения успешно сохранены',
                life: 3000,
            });
            table.push(gateway).then(() => {
                setIsSaveInProgress(false);
            });
        }
    }, [isSaveButtonPressed])

    return (
        <main>
            <Toast
                ref={schedulePullToast}
                style={{marginTop: '5em'}}
            />
            {
                (table !== null) ?
                    <ScheduleTableView
                    lessons={lessons}
                    processUpdate={(update) => {
                        if (table !== null) {
                            setIsSaveEnabled(true);
                            table.addUpdate(update);
                            table.redo();
                            setLessons(Object.assign([], table.schedule.lessons));
                        }
                    }
                    }
                    currentDate={currentDate} />
                : null
            }
        </main>
    );
}

export function hookSaveData() {

}

export function hookDateChange() {

}


export default Workspace;
