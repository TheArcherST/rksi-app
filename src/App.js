import React from "react";
import './App.css';

import Header from './components/header.js';
import Workspace, {hookDateChange, hookSaveData} from "./components/workspace";
import Footer from "./components/footer";
import addRuLocale from "./locale";
import {locale} from "primereact/api";

addRuLocale();


function App() {
    locale('ru');
    return (
    <div className="App">
        <Header
            onSaveButtonClick={hookSaveData}
            onDateChange={hookDateChange}
        />
        <Workspace />
        <Footer />
    </div>
    );
}

export default App;
