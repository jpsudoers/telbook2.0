import React from 'react';
import style from './Title.module.scss'

const Title = ({title}) => {
    return (
        <h1 className={style.secondaryTitle}>{title}</h1>
    );
};

export default Title;