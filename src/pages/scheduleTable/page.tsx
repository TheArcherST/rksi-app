import {useEffect, useState} from "react";
import Workspace from "./workspace";
import Footer from "../../components/footer/footer";
import storage from "../../infrastructure/storage";
import BaseHeader from "../../components/header/baseHeader";
import ScheduleSectionDTO from "../../interfaces/scheduleSection";


const DEFAULT_BUILDING_NUMBERS = [1];


function ScheduleTablePage() {
    let [currentDate, setCurrentDate] = useState<Date>(new Date());
    let [isSaveInProgress, setIsSaveInProgress] = useState(false);
    let [isSaveButtonPressed, setIsSaveButtonPressed] = useState(false);
    let [isSaveDisabled, setIsSaveDisabled] = useState(true);
    let [buildingNumbers, setBuildingNumbers] = useState<number[]>(
        storage.getBuildingNumbers() || DEFAULT_BUILDING_NUMBERS
    );
    let [scheduleSection, setScheduleSection] = useState<ScheduleSectionDTO | null>(null);
    let [scheduleSections, setScheduleSections] = useState<ScheduleSectionDTO[]>([]);

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
                }}
                setScheduleSections={setScheduleSections}
                currentDate={currentDate}
                isSaveInProgress={isSaveInProgress}
                setIsSaveInProgress={setIsSaveInProgress}
                isSaveButtonPressed={isSaveButtonPressed}
                setIsSaveDisabled={setIsSaveDisabled}
                buildingNumbers={buildingNumbers}
            />
            <Footer />
        </>
    )
}


export default ScheduleTablePage;
