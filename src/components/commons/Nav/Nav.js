import React from 'react';
import Link from 'next/link'
import styles from './Nav.module.scss'


const Nav = () => {
    return (
        <nav className={styles.nav}>
            <div>
                <Link className={styles.anchorNav} href="/cursos">cursos</Link>
            </div>
            <div className={styles.space}>
                <Link className={styles.anchorNav} href="/libro-de-matricula">matriculas</Link>
            </div>
        </nav>
    );
};

export default Nav;