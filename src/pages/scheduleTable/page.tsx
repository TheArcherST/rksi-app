import Header from "./header";
import {useEffect, useState} from "react";
import Workspace from "./workspace";
import Footer from "../../components/footer/footer";
import storage from "../../infrastructure/storage";


function ScheduleTablePage() {
    let [currentDate, setCurrentDate] = useState<Date>(new Date());
    let [isSaveInProgress, setIsSaveInProgress] = useState(false);
    let [isSaveButtonPressed, setIsSaveButtonPressed] = useState(false);
    let [isSaveDisabled, setIsSaveDisabled] = useState(true);
    let [buildingNumbers, setBuildingNumbers] = useState<number[]>(storage.getBuildingNumbers() || []);

    useEffect(() => {
        storage.setBuildingNumbers(buildingNumbers)
    }, [buildingNumbers])

    return (
        <>
            <Header
                isSaveDisabled={isSaveDisabled}
                isSaveInProgress={isSaveDisabled}
                setIsSaveButtonPressed={setIsSaveButtonPressed}
                currentDate={currentDate}
                setDate={setCurrentDate}
                buildingNumbers={buildingNumbers}
                setBuildingNumbers={setBuildingNumbers}
            />
            <Workspace
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
