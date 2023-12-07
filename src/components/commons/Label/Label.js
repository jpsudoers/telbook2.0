import React from 'react';
import styles from './Labe.module.scss';

const Label = ({children, variant}) => {
    return (
        <div className={styles[variant]}>
            {children}
        </div>
    );
};

export default Label;