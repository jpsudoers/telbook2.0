import React from 'react';
import styles from './Header.module.css'
import Logo from "@/components/commons/Svg/Logo/Logo";
import Nav from "@/components/commons/Nav/Nav";
import Logout from "@/components/commons/Logout/Logout";

const Header = () => {
    return (
        <header className={styles.header}>
            <div className={styles.containerHeader}>
                <Logo size={'5rem'}/>
                <Nav/>
                <Logout/>
            </div>
        </header>
    );
};

export default Header;