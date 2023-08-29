import BaseHeader from "../../components/header/baseHeader";
import Footer from "../../components/footer/footer";
import {Button} from "primereact/button";

import Main from './main';


function MainPage() {
    return (
        <>
            <BaseHeader />
            <Main />
            <Footer
                style={{
                    height: '20vh',
                }}
            />
        </>
    );
}


export default MainPage;
