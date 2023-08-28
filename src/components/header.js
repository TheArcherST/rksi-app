import React from "react";
import {useState} from "react";
import './header.css';

import {Button} from "primereact/button";
import {Calendar} from "primereact/calendar";


function AppLogo() {
    return (
        <a className="logo" href="#">РКСИ</a>
    );
}


function DateSelector({currentDate, onDateChange}) {
    const [date, setDate] = useState(currentDate);

    return (
        <div className={"head-date-selector"}>
            <Calendar
                style={
                {
                    backgroundColor: 'white',
                    color: 'black',
                }
            }
                dateFormat="dd.mm.yy"
                value={date}
                onChange={(e) => {
                    setDate(e.value);
                    onDateChange(e);
                }}></Calendar>
        </div>
    );
}


function SaveButton({savingDisabled, isSaveInProgress, onClick, onMouseUp}) {
    return (
        <Button
            className="save-button"
            loading={isSaveInProgress}
            disabled={savingDisabled}
            onClick={onClick}
            onMouseUp={onMouseUp}>
            Сохранить
        </Button>
    )
}


function Header({currentDate, onDateChange, setIsSaveButtonPressed,
                    savingDisabled, isSaveInProgress}) {
    return (
        <header className="header">
            <AppLogo />
            <DateSelector
                currentDate={currentDate}
                onDateChange={onDateChange}/>
            <SaveButton
                savingDisabled={savingDisabled}
                isSaveInProgress={isSaveInProgress}
                onClick={() => {setIsSaveButtonPressed(true)}}
                onMouseUp={() => {setIsSaveButtonPressed(false)}}
            />
        </header>
    )
}


export default Header;
