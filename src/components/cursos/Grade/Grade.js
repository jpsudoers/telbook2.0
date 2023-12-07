import React from 'react';
import Link from 'next/link'
import style from './Grades.module.scss';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBook} from "@fortawesome/free-solid-svg-icons";

const Grade = ({title, level, code}) => {
    let backgroundColor;
    switch (level) {
        case 'MM': {
            backgroundColor = '#946e83ff'
            break
        }
        case 'PNT': {
            backgroundColor = '#ff0000ff'
            break
        }
        case '2NT': {
            backgroundColor = '#2e3532ff'
            break
        }
        default: {
            backgroundColor = '#2e3532ff'
            break
        }
    }

    return (
        <div className={style.containerGrade}>
            <Link href={{pathname: `/curso/${code.toLowerCase()}`}}  >
                <div className={style.grade} style={{backgroundColor}}>
                    <FontAwesomeIcon size={'2xl'} icon={faBook}/>
                </div>
                <div className={style.gradeTitle}>
                    {title}
                </div>
            </Link>
        </div>

    );
};

export default Grade;