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
    isSaveDisabled: boolean;
    setIsSaveDisabled: (value: boolean) => any;
    buildingNumbers: number[];
    setScheduleSections: (value: ScheduleSectionDTO[]) => any;
}



function Workspace(props: WorkspaceProps) {
    const [table, setTable] = useState<ScheduleTable | null>(null);
    const [lessons, setLessons] = useState<WrappedLessonDTO[]>([]);
    const schedulePullToast = useRef<any>(null);

    function reloadTable(previous: ScheduleTable | null = null) {
        const gateway = new APIAdapter();
        ScheduleTable.pull(
            gateway,
            props.currentDate,
            props.buildingNumbers,
            props.toolboxProps.scheduleSection
        ).then(table => {
            setTable(table);
            setLessons(table.schedule.wrappedLessons);
            props.setScheduleSections(table.schedule.scheduleSections);
        })
    }

    function onSave() {
        const gateway = new APIAdapter();
        if (table !== null) {
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
    useHotkeys('mod+s', (e) => {
        e.preventDefault();
        if (!props.isSaveDisabled) onSave();
    })

    useEffect(reloadTable, [
        props.currentDate,
        props.buildingNumbers,
    ]);
    useEffect(reloadTable, [
        props.toolboxProps.scheduleSection,
    ])

    useEffect(() => {
        if (props.isSaveButtonPressed) onSave();
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
