import BaseHeader from "../../components/header/baseHeader";
import Footer from "../../components/footer/footer";
import {Button} from "primereact/button";

import Main, {MainPageDestiny,} from './main';


interface MainPageProps {
    destiny: MainPageDestiny;
}


function MainPage(props: MainPageProps) {
    return (
        <>
            <BaseHeader />
            <Main {...props}/>
            <Footer
                style={{
                    height: '20vh',
                }}
            />
        </>
    );
}


export default MainPage;
