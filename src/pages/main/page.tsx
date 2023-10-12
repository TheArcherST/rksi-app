import BaseHeader from "../../components/header/baseHeader";
import Footer from "../../components/footer/footer";

import Main, {MainPageDestiny,} from './main';
import {useSearchParams} from "react-router-dom";


interface MainPageProps {
    destiny: MainPageDestiny;
}


function MainPage(props: MainPageProps) {
    const [searchParams, _] = useSearchParams();
    let origin = searchParams.get('origin');
    let isTelegramRedirect = origin === 'telegram';

    return (
        <>
            <BaseHeader />
            <Main {...{
                isTelegramRedirect: isTelegramRedirect,
                ...props
            }}/>
            <Footer
                style={{
                    height: '20vh',
                }}
            />
        </>
    );
}


export default MainPage;
