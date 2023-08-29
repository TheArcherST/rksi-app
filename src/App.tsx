import React from "react";

import addRuLocale from "./locale";
import {locale} from "primereact/api";


import ScheduleTablePage from "./pages/scheduleTable/page";

import 'primeicons/primeicons.css';
import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primereact/resources/primereact.css';

import './App.css';


addRuLocale();


function App() {
    locale('ru');
    return <ScheduleTablePage />
}


export default App;
