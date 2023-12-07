import React from 'react';
import Link from 'next/link'
import styles from './QuickAccess.module.scss';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const QuickAccess = ({title, icon, path}) => {
    return (
        <Link href={{pathname: path}}>
            <div className={styles.contentBox}>
                <div className={styles.box}>
                    <FontAwesomeIcon icon={icon}/>
                </div>
                <div className={styles.boxTitle}>
                    {title}
                </div>
            </div>
        </Link>
    );
};

export default QuickAccess;