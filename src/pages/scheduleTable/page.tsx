import {useEffect, useState} from "react";
import Workspace from "./workspace";
import Footer from "../../components/footer/footer";
import storage from "../../infrastructure/storage";
import BaseHeader from "../../components/header/baseHeader";
import ScheduleSectionDTO from "../../interfaces/scheduleSection";
import TimetableDTO from "../../interfaces/timetable";
import ScheduleFragmentDTO from "../../interfaces/scheduleFragment";


const DEFAULT_BUILDING_NUMBERS = [1];


function ScheduleEditorPage() {
  let [currentDate, setCurrentDate] = useState<Date>(new Date());
  let [isSaveInProgress, setIsSaveInProgress] = useState(false);
  let [isSaveButtonPressed, setIsSaveButtonPressed] = useState(false);
  let [isSaveDisabled, setIsSaveDisabled] = useState<boolean>(true);
  let [buildingNumbers, setBuildingNumbers] = useState<number[]>(
      storage.getBuildingNumbers() || DEFAULT_BUILDING_NUMBERS
  );
  let [scheduleSection, setScheduleSection] = useState<ScheduleSectionDTO | null>(null);
  let [timetable, setTimetable] = useState<TimetableDTO | null>(null);
  let [scheduleFragment, setScheduleFragment] = useState<ScheduleFragmentDTO | null>(null);
  let [scheduleSections, setScheduleSections] = useState<ScheduleSectionDTO[]>([]);
  let [timetables, setTimetables] = useState<TimetableDTO[]>([]);

  useEffect(() => {
      storage.setBuildingNumbers(buildingNumbers)
  }, [buildingNumbers])

  return (
    <>
      <BaseHeader />
      <Workspace
        toolboxProps={{
          isSaveDisabled: isSaveDisabled,
          isSaveInProgress: isSaveInProgress,
          setIsSaveButtonPressed: setIsSaveButtonPressed,
          currentDate: currentDate,
          setDate: setCurrentDate,
          buildingNumbers: buildingNumbers,
          setBuildingNumbers: setBuildingNumbers,
          scheduleSection: scheduleSection,
          setScheduleSection: setScheduleSection,
          scheduleSections: scheduleSections,
          setScheduleSections: setScheduleSections,
          timetable: timetable,
          setTimetable: setTimetable,
          timetables: timetables,
          setTimetables: setTimetables,
          scheduleFragment: scheduleFragment,
          setScheduleFragment: setScheduleFragment,
        }}
        setScheduleSections={setScheduleSections}
        currentDate={currentDate}
        isSaveInProgress={isSaveInProgress}
        setIsSaveInProgress={setIsSaveInProgress}
        isSaveButtonPressed={isSaveButtonPressed}
        isSaveDisabled={isSaveDisabled}
        setIsSaveDisabled={setIsSaveDisabled}
        buildingNumbers={buildingNumbers}
      />
      <Footer />
    </>
  )
}


export default ScheduleEditorPage;
