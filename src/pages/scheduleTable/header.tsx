import React from "react";
import {useState} from "react";

import {Button} from "primereact/button";
import {Calendar, CalendarChangeEvent} from "primereact/calendar";

import BaseHeader from "../../components/header/baseHeader";

import './header.css';
import {SelectButton} from "primereact/selectbutton";


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
                backgroundColor: 'white',
                color: 'black',
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
            style={{width: '8em'}}
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


interface HeaderProps {
    currentDate: Date;
    setDate: (value: Date) => any;
    setIsSaveButtonPressed: (value: boolean) => any;
    isSaveDisabled: boolean;
    isSaveInProgress: boolean;
    buildingNumbers: number[];
    setBuildingNumbers: (value: number[]) => any;
}


function Header(
    {
        currentDate, setDate, setIsSaveButtonPressed,
        isSaveDisabled, isSaveInProgress, buildingNumbers, setBuildingNumbers
    }: HeaderProps
    ) {
    return (
        <BaseHeader>
            <DateSelector
                currentDate={currentDate}
                setDate={setDate}/>
            <BuildingNumberSelector
                buildingNumbers={buildingNumbers}
                setBuildingNumbers={setBuildingNumbers}
                 />
            <SaveButton
                isSaveDisabled={isSaveDisabled}
                isSaveInProgress={isSaveInProgress}
                onClick={() => {setIsSaveButtonPressed(true)}}
                onMouseUp={() => {setIsSaveButtonPressed(false)}}
            />
        </BaseHeader>
    );
}


export default Header;
