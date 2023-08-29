import Header from "./header";
import {useState} from "react";
import Workspace from "./workspace";
import Footer from "../../components/footer/footer";


function ScheduleTablePage() {
    let [currentDate, setCurrentDate] = useState<Date>(new Date());
    let [isSaveInProgress, setIsSaveInProgress] = useState(false);
    let [isSaveButtonPressed, setIsSaveButtonPressed] = useState(false);
    let [isSaveDisabled, setIsSaveDisabled] = useState(true);

    return (
        <>
            <Header
                isSaveDisabled={isSaveDisabled}
                isSaveInProgress={isSaveDisabled}
                setIsSaveButtonPressed={setIsSaveButtonPressed}
                currentDate={currentDate}
                setDate={setCurrentDate}
            />
            <Workspace
                currentDate={currentDate}
                isSaveInProgress={isSaveInProgress}
                setIsSaveInProgress={setIsSaveInProgress}
                isSaveButtonPressed={isSaveButtonPressed}
                setIsSaveDisabled={setIsSaveDisabled}                
            />
            <Footer />
        </>
    )
}


export default ScheduleTablePage;
