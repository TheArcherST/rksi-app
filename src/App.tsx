import React from "react";

import addRuLocale from "./locale";
import {locale} from "primereact/api";

import ScheduleEditorPage from "./pages/scheduleTable/page";
import MainPage from "./pages/main/page";

import {createBrowserRouter, RouterProvider} from "react-router-dom";

import 'primeicons/primeicons.css';
import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primereact/resources/primereact.css';

import './App.css';
import {MainPageDestiny} from "./pages/main/main";
import SchedulePage from "./pages/schedule/SchedulePage";


addRuLocale();


const router = createBrowserRouter(
    [
        {
            path: "/",
            element: <MainPage destiny={MainPageDestiny.LOGIN} />
        },
        {
            path: "/login",
            element: <MainPage destiny={MainPageDestiny.LOGIN} />
        },
        {
            path: "/register",
            element: <MainPage destiny={MainPageDestiny.REGISTER} />
        },
        {
            path: '/schedule-editor',
            element: <ScheduleEditorPage />
        },
        {
            path: '/schedule',
            element: <SchedulePage />
        }
    ]
)

function App() {
    locale('ru');
    return <RouterProvider router={router} />
}


export default App;
