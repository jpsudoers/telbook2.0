import React from 'react';
import Link from 'next/link'
import styles from './Nav.module.scss'


const Nav = () => {
    return (
        <nav className={styles.nav}>
            <div className={styles.space}>
                <Link className={styles.anchorNav} href="/cursos">cursos</Link>
            </div>
            <div className={styles.space}>
                <Link className={styles.anchorNav} href="/libro-de-matricula">matriculas</Link>
            </div>
            <div className={styles.space}>
                <Link
                    className={styles.anchorNavHighlighted}
                    href="http://localhost:5173"
                >
                    Pre-Matricula
                </Link>
            </div>
            {/*<div className={styles.space}>*/}
            {/*    <Link className={styles.anchorNav} href="/libro-de-matricula">administración</Link>*/}
            {/*</div>*/}
        </nav>
    );
};

export default Nav;