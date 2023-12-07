import React from 'react';
import style from './Alert.module.scss';

const Alert = ({children, variant}) => {
    return (
        <div className={style[variant]}>
            {children}
        </div>
    );
};

export default Alert;