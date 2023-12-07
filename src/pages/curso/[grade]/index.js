import React, {useState, useContext} from 'react';
import Header from "@/components/commons/Header/Header";
import Container from "@/components/commons/Container/Container";
import withAuth from "@/hoc/withAuth";
import LandingGrade from "@/components/curso/LandingGrade";
import Title from "@/components/commons/Title/Title";
import {useRouter} from "next/router";
import {Menubar} from 'primereact/menubar';
import "primereact/resources/primereact.min.css";
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primeicons/primeicons.css';
import LandingAttendance from "@/components/curso/LandingAttendance";
import LandingPlanningLarge from "@/components/curso/LandingPlanningLarge";
import LandingTEL from "@/components/curso/LandingTEL";
import LandingPlanningMedium from "@/components/curso/LandingPlanningMedium";
import LandingPlanningShort from "@/components/curso/LandingPlanningShort";
import LandingPlanningLectionary from "@/components/curso/LandingPlanningLectionary";
import UserContext from "@/context/user/User.context";
import LandingEvaluations from "@/components/curso/LandingEvaluations";
import LandingEvaluationPersonal from "@/components/curso/LandingEvaluationsPersonal";
import LandingAttendanceHistoric from "@/components/curso/LandingAttendanceHistoric";

const Grade = () => {
    const router = useRouter();
    const {grade} = router.query;
    const [activeIndex, setActiveIndex] = useState(0);

    const {
        user,
    } = useContext(UserContext);

    const gradeName = {
        mm: 'Medio Mayor',
        pnt: 'Pre Kinder',
        '2nt': 'Kinder'
    }

    const course = grade.split('-')[1].slice(-1)

    const items = [
        {label: 'Alumnos', icon: 'pi pi-fw pi-users', command: () => setActiveIndex(0)},
        {
            label: 'Asistencia', icon: 'pi pi-fw pi-calendar', items: [
                {label: 'Diaria', icon: 'pi pi-fw pi-clock', command: () => setActiveIndex(1)},
                {label: 'Histórica', icon: 'pi pi-fw pi-calendar-plus', command: () => setActiveIndex(2)},
            ]
        },
        {
            label: 'Planificaciones', icon: 'pi pi-fw pi-pencil', items: [
                {label: 'Largo plazo', icon: 'pi pi-fw pi-arrow-up', command: () => setActiveIndex(5)},
                {label: 'Mediano plazo', icon: 'pi pi-fw pi-angle-double-up', command: () => setActiveIndex(6)},
                {label: 'Corto plazo', icon: 'pi pi-fw pi-angle-up', command: () => setActiveIndex(7)},
                {label: 'Leccionario', icon: 'pi pi-fw pi-hashtag', command: () => setActiveIndex(8)},
            ]
        },
        {
            label: 'Evaluaciones', icon: 'pi pi-fw pi-book', items: [
                {label: 'Por formato', icon: 'pi pi-fw pi-book', command: () => setActiveIndex(3)},
                {label: 'Personalizada', icon: 'pi pi-fw pi-book', command: () => setActiveIndex(9)},
            ]
        },
        {label: 'Módulo TEL', icon: 'pi pi-fw pi-at', command: () => setActiveIndex(4)}
    ];

    const conditionalMenu = (menu) => {
        switch (menu) {
            case 0:
                return <LandingGrade/>
            case 1:
                return <LandingAttendance/>
            case 2:
                return <LandingAttendanceHistoric/>
            case 3:
                return <LandingEvaluations/>
            case 4:
                return <LandingTEL/>
            case 5:
                return <LandingPlanningLarge/>
            case 6:
                return <LandingPlanningMedium/>
            case 7:
                return <LandingPlanningShort/>
            case 8:
                return <LandingPlanningLectionary/>
            case 9:
                return <LandingEvaluationPersonal/>
        }
    }

    const conditionalTitle = (menu) => {
        switch (menu) {
            case 0:
                return 'Alumnos'
            case 1:
                return 'Asistencia Diaria'
            case 2:
                return 'Asistencia Histórica'
            case 3:
                return 'Evaluaciones'
            case 4:
                return 'Módulo TEL'
            case 5:
                return 'Planificaciones Largo Plazo'
            case 6:
                return 'Planificaciones Mediano Plazo'
            case 7:
                return 'Planificaciones Corto Plazo'
            case 8:
                return 'Leccionario'
            case 9:
                return 'Subir evaluaciones'
        }
    }

    if (Object.values(user).length === 0) {
        router.push('/cursos')
    }

    return (
        <>
            <Header/>
            <Container>
                <Title
                    title={gradeName[grade.split('-')[1].slice(0, -1)] + " " + course.toUpperCase() + ' - ' + conditionalTitle(activeIndex)}/>
                <div className="card">
                    <Menubar model={items}/>
                </div>
                <div style={{marginTop: 20}}/>
                {conditionalMenu(activeIndex)}
            </Container>
        </>
    );
};

export default withAuth(Grade);