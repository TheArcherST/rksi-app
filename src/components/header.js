import React from "react";
import {useState} from "react";
import './header.css';

import Select from 'react-select';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

function AppLogo() {
    return (
        <a className="logo" href="#">РКСИ</a>
    );
}

const months = [
    "февраль", "март", "апрель", "май",
    "июнь", "июль", "август", "сентябрь",
    "октябрь", "ноябрь", "декабрь"
];
const monthOptions = months.map(i => {return {value: months.indexOf(i), label: i}})
const days = new Array(...(new Array(32)).keys()).slice(1);
const dayOptions = days.map(i => {return {value: i, label: i}})


function DateSelector() {
    const [month, setMonth] = useState();
    const [day, setDay] = useState();

    function handleMonthChange(e) {
        setMonth(e.value)
    }

    function handleDayChange(e) {
        setDay(e.value);
    }

    return (
        <div className={"head-date-selector"}>
            <div className="box">
                <Select
                    options={monthOptions}
                    onChange={handleMonthChange}
                    isSearchable={true}
                />
            </div>
            <div className="box">
                <Select
                    options={dayOptions}
                    onChange={handleDayChange}
                    isSearchable={true}
                />
            </div>
        </div>
    );
}



function Header() {
    return (
        <header className="header">
            <AppLogo />
            <DateSelector />
        </header>
    )
}


export default Header;
