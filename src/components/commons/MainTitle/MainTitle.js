import React from 'react';
import style from './MainTitle.module.scss';

const MainTitle = ({name}) => {
    return (
        <div className={style.mainTitle}>
            <h1>¡Bienvenido {name}!</h1>
        </div>
    );
};

export default MainTitle;