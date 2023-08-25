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


function DateSelector({onDateChange}) {
    const [date, setDate] = useState(() => {
        onDateChange();
        return new Date();
    });

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


function SaveButton({savingDisabled, savingInProgress, onClick}) {
    return (
        <Button
            className="save-button"
            loading={savingInProgress}
            disabled={savingDisabled}
            onClick={onClick}>
            Сохранить
        </Button>
    )
}


function Header({onDateChange, onSaveButtonClick,
                    savingDisabled, savingInProgress}) {
    return (
        <header className="header">
            <AppLogo />
            <DateSelector
                onDateChange={onDateChange}/>
            <SaveButton
                savingDisabled={savingDisabled}
                savingInProgress={savingInProgress}
                onClick={onSaveButtonClick} />
        </header>
    )
}


export default Header;
