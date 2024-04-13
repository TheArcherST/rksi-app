import React, {ReactNode} from "react";
import './header.scss';


function AppLogo() {
    return (
        <a className="logo" href="/login">РКСИ</a>
    );
}


export interface HeaderProps {
    children?: ReactNode
}


function BaseHeader({children}: HeaderProps) {
    return (
        <header className="header">
            <AppLogo />
            {children}
        </header>
    );
}


export default BaseHeader;
