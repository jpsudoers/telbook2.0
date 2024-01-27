import React from 'react';
import style from './Title.module.scss'
import {currentDay, currentYear, dayName, monthName} from "@/utils/date";

const Title = ({title}) => {
    return (
        <div className={style.secondaryTitle}>
            <h1>{title}</h1>
            <h2>{dayName}, {currentDay} de {monthName} de {currentYear}</h2>
        </div>
    );
};

export default Title;