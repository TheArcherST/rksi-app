import {useEffect, useRef, useState} from "react";

import ToolBoxView, {ToolBoxProps} from "./workspace/toolBoxView";
import ScheduleTableView from "./workspace/scheduleTableView";
import {Toast} from "primereact/toast";
import APIAdapter, {APIError} from "../../adapters/api";
import {useHotkeys} from "react-hotkeys-hook";
import ScheduleTable from "../../domain/table";
import UpdateSchedule, {WrappedLessonDTO} from "../../domain/updateSchedule/base";

import './workspace.css';
import ScheduleSectionDTO from "../../interfaces/scheduleSection";


export interface WorkspaceProps {
    toolboxProps: ToolBoxProps;
    currentDate: Date;
    isSaveInProgress: boolean;
    setIsSaveInProgress: (value: boolean) => any;
    isSaveButtonPressed: boolean;
    setIsSaveDisabled: (value: boolean) => any;
    buildingNumbers: number[];
    setScheduleSections: (value: ScheduleSectionDTO[]) => any;
}



function Workspace(props: WorkspaceProps) {
    const [table, setTable] = useState<ScheduleTable | null>(null);
    const [lessons, setLessons] = useState<WrappedLessonDTO[]>([]);
    const schedulePullToast = useRef<any>(null);

    function reloadTable(shareSections: boolean = false) {
        const gateway = new APIAdapter();
        ScheduleTable.pull(
            gateway,
            props.currentDate,
            props.buildingNumbers,
            props.toolboxProps.scheduleSection
        ).then(table => {
            setTable(table);
            setLessons(table.schedule.wrappedLessons);
            const sections = table.schedule.wrappedLessons.map(i => {
                if (i.currentTemplate.schedule_section) {
                    return i.currentTemplate.schedule_section
                } else if (i.databaseRepresentation) {
                    return i.databaseRepresentation.schedule_section
                } else {
                    return null;
                }
            })
            let cleanSections: ScheduleSectionDTO[];
            if (shareSections) {
                cleanSections = [...props.toolboxProps.scheduleSections];
            } else {
                cleanSections = [];
            }
            for (let i of sections) {
                let isContinue = false;
                if (i !== null) {
                    for (let j of cleanSections) {
                        if (j.id === i.id) {
                            isContinue = true;
                            break;
                        }
                    }
                    if (isContinue) continue;
                    cleanSections.push(i)
                }
            }
            props.setScheduleSections(cleanSections);
        })
    }

    useHotkeys('mod+z', () => {
        if (table !== null) {
            table.undo();
            const isUpdatesPending = Boolean(table.getUpdateSchemas().length);
            props.setIsSaveDisabled(!isUpdatesPending);
            setLessons(Object.assign([], table.schedule.wrappedLessons));
        }
    })
    useHotkeys('mod+shift+z', () => {
        if (table !== null) {
            table.redo();
            const isUpdatesPending = Boolean(table.getUpdateSchemas().length);
            props.setIsSaveDisabled(!isUpdatesPending);
            setLessons(Object.assign([], table.schedule.wrappedLessons));
        }
    })


    useEffect(reloadTable, [
        props.currentDate,
        props.buildingNumbers,
    ]);
    useEffect(() => reloadTable(true), [
        props.toolboxProps.scheduleSection,
    ])

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
            setLessons(Object.assign([], table.schedule.wrappedLessons));
        }
    }

    return (
        <main className={"workspace"}>
            <Toast
                ref={schedulePullToast}
                style={{marginTop: '5em'}}
            />
            <div className={"workspace-container"}>
                <ToolBoxView
                    {...props.toolboxProps}
                />
                {
                    table !== null &&
                    <ScheduleTableView
                        lessons={lessons}
                        processUpdate={handleProcessUpdate}
                        currentDate={props.currentDate} />
                }
            </div>
        </main>
    );
}


export default Workspace;
