import React, {ReactNode} from "react";
import './header.css';


function AppLogo() {
    return (
        <a className="logo" href="src/components#">РКСИ</a>
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
