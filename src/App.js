import React, {useState} from "react";
import './App.css';

import Header from './components/header.js';
import Workspace, {hookDateChange, hookSaveData} from "./components/workspace";
import Footer from "./components/footer";
import addRuLocale from "./locale";
import {locale} from "primereact/api";

addRuLocale();


function getDateWithoutTime() {
    return new Date();
}


function App() {
    locale('ru');
    let [currentDate, setCurrentDate] = useState(getDateWithoutTime());
    let [isSaveInProgress, setIsSaveInProgress] = useState(false);
    let [isSaveButtonPressed, setIsSaveButtonPressed] = useState(false);
    let [isSaveEnabled, setIsSaveEnabled] = useState(false);

    return (
    <div className="App">
        <Header
            currentDate={currentDate}
            savingDisabled={!isSaveEnabled}
            isSaveInProgress={isSaveInProgress}
            setIsSaveButtonPressed={setIsSaveButtonPressed}
            onDateChange={(e) => {
                setCurrentDate(e.value)
            }}
        />
        <Workspace currentDate={currentDate}
                   setIsSaveInProgress={setIsSaveInProgress}
                   isSaveButtonPressed={isSaveButtonPressed}
                   setIsSaveEnabled={setIsSaveEnabled}
        />
        <Footer />
    </div>
    );
}

export default App;
