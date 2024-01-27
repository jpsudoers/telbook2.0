import React, {useContext, useEffect} from 'react';
import styles from './LandingHome.module.scss'
import QuickAccess from "@/components/cursos/QuickAccess/QuickAccess";
import {faUserPlus} from "@fortawesome/free-solid-svg-icons";
import {faBook} from "@fortawesome/free-solid-svg-icons";
import Grade from "@/components/cursos/Grade/Grade";
import MainTitle from "@/components/commons/MainTitle/MainTitle";
import UserContext from "@/context/user/User.context";
import StudentsContext from "@/context/students/Students.context";
import Loading from "@/components/commons/Loading/Loading";
import {AuthContext} from "@/context/auth/Auth.context";
import {useRouter} from "next/router";

const LandingHome = () => {
    const {
        user, userLoading, getGrades, gradesLoading, grades, getUser,
    } = useContext(UserContext);

    const {
        userAuth,
    } = useContext(AuthContext);

    const {
        students, studentsLoading, getStudentsBySchool,
    } = useContext(StudentsContext);

    const router = useRouter();

    useEffect(() => {
        if (!userAuth) {
            router.push('/')
        }
    }, [])

    useEffect(() => {
        if (Object.values(user).length === 0 && userAuth !== null) {
            getUser(userAuth.uid)
        }
        if (grades.length === 0) {
            getGrades(user.establecimiento)
        }
        if (students.length === 0) {
            getStudentsBySchool(user.establecimiento)
        }
    }, [user])

    if (userLoading || gradesLoading || studentsLoading) {
        return <Loading/>
    }

    const getCurrentGrades = (level) => {
        if (user.cursos === '') {
            return grades && grades.filter(grade => grade.nombreNivelAlt === level).map((grade, index) => {
                return <Grade key={index} code={grade.codigo} title={grade.nombre} level={level}/>
            })
        }
        return grades && grades.filter(grade => grade.nombreNivelAlt === level && user.cursos.includes(grade.codigo)).map((grade, index) => {
            return <Grade key={index} code={grade.codigo} title={grade.nombre} level={level}/>
        })
    }

    return (<>
        <MainTitle name={`${user.nombre} ${user.apellidoPaterno}`}/>
        <h2>Mis accesos directos</h2>
        <div className={styles.quickAccess}>
            <QuickAccess path='/matricula' title='Matricular alumno' icon={faUserPlus}/>
            <QuickAccess title='Descargar libro matricula' icon={faBook}/>
        </div>
        <h2>Mis cursos</h2>
        <div className={styles.gradesHome}>
            <div className={styles.grade}>
                <h3>Nivel Medio Mayor (MM)</h3>
                <div className={styles.containerGrades}>
                    {
                        getCurrentGrades('MM')
                    }
                </div>
            </div>
            <div className={styles.grade}>
                <h3>Nivel Pre Kinder (NT1)</h3>
                <div className={styles.containerGrades}>
                    {getCurrentGrades('PNT')}
                </div>
            </div>
            <div className={styles.grade}>
                <h3>Nivel Kinder (NT2)</h3>
                <div className={styles.containerGrades}>
                    {getCurrentGrades('2NT')}
                </div>
            </div>
        </div>

    </>);
};

export default LandingHome;