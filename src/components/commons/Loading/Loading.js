import React from 'react';
import styles from './Loading.module.scss';

const Loading = () => {
    return (
        <div className={styles.loading}>
            <div className={styles.spinnerContainer}>
                <div className={styles.spinner}/>
            </div>
        </div>
    );
};

export default Loading;