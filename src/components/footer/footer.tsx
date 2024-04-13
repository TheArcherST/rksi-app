import './footer.scss';


interface FooterProps {
    pin?: boolean;
    style?: any;
}


function Footer({pin, style}: FooterProps) {
    return (
        <footer className={pin ? "layout-footer" : undefined} style={style}>
        </footer>
    )
}


export default Footer;
