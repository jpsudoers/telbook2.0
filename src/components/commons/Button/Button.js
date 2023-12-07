import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faRightFromBracket} from '@fortawesome/free-solid-svg-icons'

import styles from './Button.module.scss';

const Button = ({type, text, onClick, isDisabled, typeButton}) => {
    let variable;

    switch (type) {
        case 'logout':
            variable = 'buttonLogout'
            break;
        case 'primary':
            variable = 'primary'
            break;
        case 'primary-outline':
            variable = 'primaryOutline'
            break;
        case 'neutral':
            variable = 'neutral'
            break;
        default:
            break;
    }

    return (
        <div>
            <button type={typeButton} className={styles[variable]} onClick={onClick} disabled={isDisabled}>
                {variable === 'buttonLogout' && <FontAwesomeIcon icon={faRightFromBracket}/>}
                <span style={{marginLeft: '5px'}}>{text}</span>
            </button>
        </div>

    );
};

export default Button;