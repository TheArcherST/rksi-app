import React from "react";
import {useState} from "react";

import {Button} from "primereact/button";
import {Calendar, CalendarChangeEvent} from "primereact/calendar";

import BaseHeader from "../../components/header/baseHeader";

import './header.css';


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


interface HeaderProps {
    currentDate: Date;
    setDate: (value: Date) => any;
    setIsSaveButtonPressed: (value: boolean) => any;
    isSaveDisabled: boolean;
    isSaveInProgress: boolean;
}


function Header(
    {
        currentDate, setDate, setIsSaveButtonPressed,
        isSaveDisabled, isSaveInProgress
    }: HeaderProps
    ) {
    return (
        <BaseHeader>
            <DateSelector
                currentDate={currentDate}
                setDate={setDate}/>
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
