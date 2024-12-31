import Link from 'next/link'
import styles from './Nav.module.scss'

import React, { useContext } from 'react';
import UserContext from '@/context/user/User.context'; // Adjust the import path

const Nav = () => {
    const { user } = useContext(UserContext);

    return (
        <nav className={styles.nav}>
            <div className={styles.space}>
                <Link className={styles.anchorNav} href="/cursos">cursos</Link>
            </div>
            <div className={styles.space}>
                <Link className={styles.anchorNav} href="/libro-de-matricula">matriculas</Link>
            </div>
            {/* Comentar la sección de PRE-MATRICULA
            <div className={styles.space}>
                <Link
                    className={styles.anchorNavHighlighted}
                    href={`https://eduti-prematricula-2024.netlify.app/?u=${user.id}`}
                >
                    Pre-Matricula
                </Link>
            </div>
            */}
        </nav>
    );
};

export default Nav;
