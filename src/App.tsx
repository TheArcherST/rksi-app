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
import PrivacyPolicyPage from "./pages/privacyPolicy/privacy_policy";
import BaseHeader from "./components/header/baseHeader";
import Footer from "./components/footer/footer";


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
        },
        {
            path: '/schedule/:date',
            element: <SchedulePage />
        },
        {
            path: '/privacy-policy',
            element: <PrivacyPolicyPage />
        },
    ]
)

function App() {
    locale('ru');
    return (
    <>
        <BaseHeader/>
        <RouterProvider router={router} />
        <Footer/>
    </>
    )
}


export default App;
