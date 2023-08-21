import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {Tag} from "primereact/tag";

import './workspace.css';
import Select from "react-select";
import APIAdapter from "../adapters/api";


function CustomizedSelect(props) {
    const customStyles = {
        control: (provided, state) => ({
            ...provided,
            background: '#fff',
            borderColor: "white",
            minHeight: '30px',
            maxHeight: '1000px',
            maxWidth: '220px',
            boxShadow: state.isFocused ? null : null,
            "&:hover": {
                borderColor: "white"
            },
            padding: 'none',
            marginRight: '20px',

        }),

        valueContainer: (provided, state) => ({
            ...provided,
            maxHeight: '100px',
            maxWidth: '210px',
            padding: 'none',
        }),

        input: (provided, state) => ({
            ...provided,
            margin: '0px',
            maxHeight: '100px',
            padding: 'none',
        }),
        indicatorSeparator: state => ({
            display: 'none',
            padding: 'none',
        }),
        indicatorsContainer: (provided, state) => ({
            ...provided,
            height: '30px',
            display: 'none',
            maxHeight: '100px',
            padding: 'none',
        }),

    };

    const filterOptions = (
        candidate,
        input
    ) => {
        return true;
    };

    return <Select
        styles={customStyles}
        filterOptions={filterOptions}
        {...props}/>
}


function LessonsTable({lessons}) {
    function groupsFormatter(lesson) {
        return lesson.groups.map(
            i => <CustomizedSelect
                    placeholder="Группы"
                    defaultValue={{value: 1, label: "ИБА-11"}}
                    isSearchable="true"
                    isMulti="true"/>
        )
    }

    function teachersFormatter(lesson) {
        return lesson.teachers.map(
            i => <CustomizedSelect
                options={[
                    {value: 1, label: "1wdwdwd"},
                    {value: 2, label: "3wdwdwdwdwdwdwdwdwd"},
                    {value: 3, label: "3wdwd"},
                ]}
                placeholder="Преподаватели"
                defaultValue={{value: 1, label: "1wddwd"}}
                isSearchable="true"
                isMulti="true"/>
        )
    }

    function timeCircumstanceFormatter(lesson) {
        return (
            <CustomizedSelect
                placeholder="Время"
                defaultValue={{
                    value: lesson.time_circumstance,
                    label: lesson.time_circumstance.display_text
            }}
                isSearchable="true"/>
        );
    }

    function auditoriumFormatter(lesson) {
        return (
            <CustomizedSelect
                placeholder="Аудитория"
                defaultValue={{
                    value: lesson.auditorium,
                    label: lesson.auditorium.display_text
                }}
                isSearchable="true"/>
        );
    }

    function disciplineFormatter(lesson) {
        return (
            <CustomizedSelect
                placeholder="Дисциплина"
                defaultValue={{
                    value: lesson.discipline,
                    label: lesson.discipline.display_text
                }}
                isSearchable="true"/>
        );
    }

    return (
        <DataTable
            value={lessons}
            tableStyle={{ minWidth: '50rem' }}
            showGridlines
        >
            <Column
                field="time_circumstance"
                header="Время"
                style={{width: "130px", }}
                body={timeCircumstanceFormatter} />
            <Column
                field="auditorium"
                header="Ауд."
                style={{width: "100px",}}
                body={auditoriumFormatter} />
            <Column
                field="groups"
                header="Группы"
                style={{width: "120px", maxHeight: "100px",}}
                body={groupsFormatter} />
            <Column
                field="teachers"
                header="Преподаватели"
                style={{width: "240px", maxHeight: "100px"}}
                body={teachersFormatter} />
            <Column
                field="discipline"
                header="Дисциплина"
                body={disciplineFormatter} />
        </DataTable>
    );
}

function TableSelectComponent() {
    return <Select />;
}


function TableMultiselectComponent() {
    return <Select isMulti="true"/>;
}


function Workspace() {
    const gateway = new APIAdapter();
    const lessons = gateway.readSchedule();
    return (
        <main>
            <LessonsTable lessons={lessons}/>
        </main>
    );
}

export default Workspace;
