import React, {useState} from "react";

import {Button} from "primereact/button";
import {Calendar} from "primereact/calendar";

import {SelectButton} from "primereact/selectbutton";

import './toolBoxView.css';
import ScheduleSectionDTO from "../../../interfaces/scheduleSection";
import {Dropdown} from "primereact/dropdown";
import APIAdapter from "../../../adapters/api";
import SaneDate from "../../../infrastructure/saneDate";
import TimetableDTO from "../../../interfaces/timetable";
import ScheduleFragmentDTO from "../../../interfaces/scheduleFragment";


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
                value={buildingNumbers[0]}
                onChange={(e) => {
                    setBuildingNumbers([e.value]);
                }}
                optionLabel="name"
                options={items}/>
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

    const items = props.scheduleSections.map(i => ({name: i.display_text, value: i}));

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


interface TimetableSelectorProps {
  timetables: TimetableDTO[];
  timetable: TimetableDTO | null;
  setTimetable: (value: TimetableDTO) => any;
}

function TimetableSelector(
  props: TimetableSelectorProps,
) {
  const items = props.timetables.map(i => ({name: i.display_text, value: i}));
  
  return (
    <Dropdown
      value={props.timetable}
      onChange={(e) => {
        props.setTimetable(e.value);
      }}
      optionLabel="name"
      options={items}/>
  );
}


export interface ToolBoxProps {
    scheduleSection: ScheduleSectionDTO | null;
    setScheduleSection: (value: ScheduleSectionDTO) => any;
    scheduleSections: ScheduleSectionDTO[];
    setScheduleSections: (value: ScheduleSectionDTO[]) => any;
    timetable: TimetableDTO | null;
    setTimetable: (value: TimetableDTO) => any;
    timetables: TimetableDTO[];
    setTimetables: (value: TimetableDTO[]) => any;
    scheduleFragment: ScheduleFragmentDTO | null;
    setScheduleFragment: (value: ScheduleFragmentDTO) => any;
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
      setScheduleSection, scheduleSection, scheduleSections, setScheduleSections,
      timetable, setTimetable, timetables, setTimetables,
      scheduleFragment, setScheduleFragment,
    }: ToolBoxProps
) {
    const onDateUpdate = (value: Date) => {
      const gateway = new APIAdapter();
      // load all timetables
      gateway.resolveMention({
        timetable_mention: {}
      }).then((response) => {
        setTimetables(response.timetables);
      });

      // load current fragment and its context
      gateway.resolveMention({
        schedule_fragment_mention: {
          context: {
            study_days: {
              context: {
                date: new SaneDate(value).toString(),
              }
            },
            building_numbers: buildingNumbers,
          }
        }
      }).then((response) => {
        if (response.schedule_fragments.length !== 1) {
          console.error(
            "Schedule fragments count not equals to one. Domain " +
            "agreement is violated so application wont do anything."
          )
          return;
        }
        return response.schedule_fragments[0];
      }).then((fragment: ScheduleFragmentDTO | undefined) => {
        // load all timetable sections of current context
        gateway.resolveMention({
          schedule_section_mention: {
            natural_language: null,
            context: {
              date: new SaneDate(value).toString(),
              building_numbers: buildingNumbers,
              schedule_fragment_id: fragment?.id,
            }
          }
        }).then((response) => {
          setTimetable(fragment!.timetable);
          setScheduleFragment(fragment!);
          setScheduleSection(response.schedule_sections[0]);
          setScheduleSections(response.schedule_sections);
        })
        });
    }

    const onTimetableUpdate = (value: TimetableDTO) => {
      const gateway = new APIAdapter();
      gateway.editSchedule({
        updates: [{
          edit_schedule_fragment: {
            schedule_fragment: {
              id: scheduleFragment?.id,
            },
            set_timetable: {
              id: value.id,
            }
          }
        }]
      }).then(() => {
        onDateUpdate(currentDate);
      });
    }

    const onBuildingNumbersUpdate = (value: number[]) => {
      setBuildingNumbers(value);
      buildingNumbers = value;
      onDateUpdate(currentDate);
    }
    useState(() => {
      onDateUpdate(currentDate);
    });

    return (
        <div className={"toolbox"}>
            <DateSelector
                currentDate={currentDate}
                setDate={(value) => {
                    setDate(value);
                    onDateUpdate(value);
                }}/>
            <BuildingNumberSelector
                buildingNumbers={buildingNumbers}
                setBuildingNumbers={onBuildingNumbersUpdate}
            />
            <TimetableSelector
              timetable={timetable}
              setTimetable={onTimetableUpdate}
              timetables={timetables}
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
