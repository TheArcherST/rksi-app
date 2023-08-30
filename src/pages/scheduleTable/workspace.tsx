import {KeyboardEvent, useEffect, useRef, useState} from "react";

import {DataTable} from "primereact/datatable";
import {Column, ColumnBodyOptions} from "primereact/column";

import APIAdapter, {APIError} from "../../adapters/api";

import CellMultiselect from "../../components/table/cellMultiselect";
import CellSelect from "../../components/table/cellSelect";

import LessonDTO from "../../interfaces/lesson";
import GroupDTO from "../../interfaces/group";
import PersonDTO from "../../interfaces/person";
import AuditoriumDTO from "../../interfaces/auditorium";
import DisciplineDTO from "../../interfaces/discipline";
import ScheduleSectionDTO from "../../interfaces/scheduleSection";

import ScheduleTable, {
    AttachGroupToLesson,
    AttachTeacherToLesson, CreateLesson, DeleteLesson,
    DetachGroupFromLesson,
    DetachTeacherFromLesson,
    ReplaceLessonAuditorium,
    ReplaceLessonDiscipline,
    ReplaceLessonScheduleSection,
    UpdateSchedule
} from "../../infrastructure/table";
import SaneDate from "../../infrastructure/saneDate";
import {Toast} from "primereact/toast";
import {Button} from "primereact/button";

import './workspace.css';
import {useHotkeys} from "react-hotkeys-hook";


interface ScheduleTableViewProps {
    lessons: LessonDTO[];
    processUpdate: (update: UpdateSchedule) => any;
    currentDate: Date;
}


function ScheduleTableView(props: ScheduleTableViewProps) {
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
                    props.processUpdate(
                        new AttachGroupToLesson(lesson, entity)
                    )
                }}
                removeEntity={(entity) => {
                    props.processUpdate(
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
                    props.processUpdate(
                        new AttachTeacherToLesson(lesson, entity)
                    )
                }}
                removeEntity={(entity) => {
                    props.processUpdate(
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
                    props.processUpdate(
                        new ReplaceLessonScheduleSection(lesson, entity)
                    );
                }}
                resolveEntitiesMention={(mention) => {
                    return gateway.resolveMention(
                        {
                            schedule_section_mention: {
                                "mention": mention,
                                "date": new SaneDate(props.currentDate).toString(),
                            }
                        }
                    ).then((data) => {
                        if (data.schedule_sections) {
                            return data.schedule_sections;
                        } else {
                            return [];
                        }
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
                    props.processUpdate(
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
                    props.processUpdate(
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

    function deleteButtonTemplate(lesson: LessonDTO, _options: ColumnBodyOptions) {
        return (
            <Button
                type="button"
                icon={"pi pi-times"}
                style={{color: "red"}}
                className="p-button-sm p-button-text"
                onClick={() => {
                    props.processUpdate(
                        new DeleteLesson(lesson)
                    )
                }} />
        );
    }

    return (
        <DataTable
            value={props.lessons}
            tableStyle={{ minWidth: '50rem', }}
            showGridlines
            className={"schedule-table"}
            emptyMessage={
            <div className={"table-empty-message"}>
                <b>Пока занятий нет</b>
            </div>
            }
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
            <Column
                style={{ flex: '0 0 4rem' }}
                body={deleteButtonTemplate} />
        </DataTable>
    );
}


export interface WorkspaceProps {
    currentDate: Date;
    isSaveInProgress: boolean;
    setIsSaveInProgress: (value: boolean) => any;
    isSaveButtonPressed: boolean;
    setIsSaveDisabled: (value: boolean) => any;
    buildingNumbers: number[];
}



function Workspace(props: WorkspaceProps) {
    const [table, setTable] = useState<ScheduleTable | null>(null);
    const [lessons, setLessons] = useState<LessonDTO[]>([]);
    const schedulePullToast = useRef<any>(null);

    function reloadTable() {
        const gateway = new APIAdapter();
        ScheduleTable.pull(gateway, props.currentDate, props.buildingNumbers).then(table => {
            setTable(table);
            setLessons(table.schedule.lessons);
        })
    }

    useHotkeys('mod+z', (e) => {
        if (table !== null) {
            table.undo();
            const isUpdatesPending = Boolean(table.getUpdateSchemas().length);
            props.setIsSaveDisabled(!isUpdatesPending);
            setLessons(Object.assign([], table.schedule.lessons));
        }
    })
    useHotkeys('mod+shift+z', (e) => {
        if (table !== null) {
            table.redo();
            const isUpdatesPending = Boolean(table.getUpdateSchemas().length);
            props.setIsSaveDisabled(!isUpdatesPending);
            setLessons(Object.assign([], table.schedule.lessons));
        }
    })


    useEffect(reloadTable, [props.currentDate, props.buildingNumbers]);

    useEffect(() => {
        const gateway = new APIAdapter();
        if (table !== null && props.isSaveButtonPressed) {
            props.setIsSaveInProgress(true);
            props.setIsSaveDisabled(true);
            table.push(gateway).then(() => {
                schedulePullToast.current!.show({
                    severity: 'success',
                    summary: 'Сохранено',
                    detail: 'Изменения успешно сохранены',
                    life: 2000,
                });
                reloadTable();
            }).catch((err) => {
                if (err instanceof APIError) {
                    schedulePullToast.current!.show({
                        severity: 'error',
                        summary: `Ошибка ${err.status}`,
                        detail: 'Изменения не сохранены',
                        life: 5000,
                    });
                }
            }).finally(() => {
                props.setIsSaveInProgress(false);
            });
        }
    }, [props.isSaveButtonPressed])

    const handleProcessUpdate = (update: UpdateSchedule) => {
        if (table !== null) {
            table.addUpdate(update);
            table.redo();
            const isUpdatesPending = Boolean(table.getUpdateSchemas().length);
            props.setIsSaveDisabled(!isUpdatesPending);
            setLessons(Object.assign([], table.schedule.lessons));
        }
    }

    return (
        <main className={"workspace"}>
            <Toast
                ref={schedulePullToast}
                style={{marginTop: '5em'}}
            />
            <Button
                onClick={() => {
                    handleProcessUpdate(new CreateLesson());
                }}
                style={{
                    position: "absolute",
                    marginLeft: "90vw",
                }}
                icon={"pi pi-plus"}
            />
            {
                (table !== null) ?
                    <ScheduleTableView
                    lessons={lessons}
                    processUpdate={handleProcessUpdate}
                    currentDate={props.currentDate} />
                : null
            }
        </main>
    );
}


export default Workspace;
