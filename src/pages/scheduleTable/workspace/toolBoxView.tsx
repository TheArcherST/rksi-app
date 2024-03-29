import React from "react";
import {useState} from "react";

import {Button} from "primereact/button";
import {Calendar} from "primereact/calendar";

import {SelectButton} from "primereact/selectbutton";

import './toolBoxView.css';
import ScheduleSectionDTO from "../../../interfaces/scheduleSection";
import {Dropdown} from "primereact/dropdown";


interface DateSelectorProps {
    currentDate: Date;
    setDate: (e: Date) => any;
}


function DateSelector(
    {
        currentDate, setDate
    }: DateSelectorProps
) {
    const [internalDate, setInternalDate] = useState(currentDate);

    return (
        <div className={"head-date-selector"}>
            <Calendar
                style={{
                    border: '1px solid #ced4da',
                    borderRadius: '6px',
                }}
                dateFormat="dd.mm.yy"
                value={internalDate}
                onChange={(e) => {
                    if (e.value instanceof Date) {
                        setInternalDate(e.value);
                        setDate(e.value);
                    } else {
                        throw Error("Selecting date range is not supported");
                    }
                }}
            />
        </div>
    );
}


interface SaveButtonProps {
    isSaveDisabled: boolean;
    isSaveInProgress: boolean;
    onClick: (e: any) => any;
    onMouseUp: (e: any) => any;

}

function SaveButton(
    {
        isSaveDisabled, isSaveInProgress, onClick, onMouseUp
    }: SaveButtonProps
) {
    return (
        <Button
            className="save-button"
            loading={isSaveInProgress}
            disabled={isSaveDisabled}
            onClick={onClick}
            onMouseUp={onMouseUp}
            style={{width: '10em'}}
        >
            Сохранить
        </Button>
    );
}


interface BuildingNumberSelectorProps {
    buildingNumbers: number[];
    setBuildingNumbers: (value: number[]) => any;
}


function BuildingNumberSelector(
    {buildingNumbers, setBuildingNumbers}: BuildingNumberSelectorProps
) {
    const items = [
        { name: 'Корпус 1', value: 1 },
        { name: 'Корпус 2', value: 2 },
    ];

    return (
        <div className="card flex justify-content-center">
            <SelectButton
                value={buildingNumbers}
                onChange={(e) => {
                    setBuildingNumbers(e.value);
                }}
                optionLabel="name"
                options={items}
                multiple />
        </div>
    );
}


interface ScheduleSectionSelectorProps {
    scheduleSections: ScheduleSectionDTO[];
    scheduleSection: ScheduleSectionDTO | null;
    setScheduleSection: (value: ScheduleSectionDTO) => any;
}
function ScheduleSectionSelector(
    props: ScheduleSectionSelectorProps,
) {
    const items = props.scheduleSections.map(i =>
        new Object({name: i.display_text, value: i}));
    if (props.scheduleSection === null && props.scheduleSections.length > 0) {
        props.setScheduleSection(props.scheduleSections[0]);
    }
    return (
        <Dropdown
            value={props.scheduleSection}
            onChange={(e) => {
                props.setScheduleSection(e.value);
            }}
            optionLabel="name"
            options={items}/>
    );
}


export interface ToolBoxProps {
    scheduleSection: ScheduleSectionDTO | null;
    setScheduleSection: (value: ScheduleSectionDTO | null) => any;
    setScheduleSections: (value: ScheduleSectionDTO[]) => any;
    scheduleSections: ScheduleSectionDTO[];
    currentDate: Date;
    setDate: (value: Date) => any;
    setIsSaveButtonPressed: (value: boolean) => any;
    isSaveDisabled: boolean;
    isSaveInProgress: boolean;
    buildingNumbers: number[];
    setBuildingNumbers: (value: number[]) => any;
}


function ToolBoxView(
    {
        currentDate, setDate, setIsSaveButtonPressed,
        isSaveDisabled, isSaveInProgress, buildingNumbers, setBuildingNumbers,
        setScheduleSection, scheduleSection, scheduleSections, setScheduleSections
    }: ToolBoxProps
) {
    return (
        <div className={"toolbox"}>
            <DateSelector
                currentDate={currentDate}
                setDate={(value) => {
                    setDate(value);
                    setScheduleSection(null);
                    setScheduleSections([]);
                }}/>
            <BuildingNumberSelector
                buildingNumbers={buildingNumbers}
                setBuildingNumbers={setBuildingNumbers}
            />
            <ScheduleSectionSelector
                scheduleSection={scheduleSection}
                setScheduleSection={setScheduleSection}
                scheduleSections={scheduleSections}
            />
            <SaveButton
                isSaveDisabled={isSaveDisabled}
                isSaveInProgress={isSaveInProgress}
                onClick={() => {setIsSaveButtonPressed(true)}}
                onMouseUp={() => {setIsSaveButtonPressed(false)}}
            />
        </div>
    );
}


export default ToolBoxView;
