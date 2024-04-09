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
        <Main
            isTelegramRedirect={isTelegramRedirect}
            destiny={props.destiny}
        />
    );
}


export default MainPage;
