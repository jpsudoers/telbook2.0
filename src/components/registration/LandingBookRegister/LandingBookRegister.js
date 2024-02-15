import React, {useContext, useRef} from 'react';
import StudentsContext from "@/context/students/Students.context";
import Title from '@/components/commons/Title/Title';
import style from './LandingBookRegister.module.scss';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import {Button} from "primereact/button";
import DataTableFilter from '@/components/commons/DataTable/DataTable';
import Link from "next/link";
import UserContext from "@/context/user/User.context";
import Loading from "@/components/commons/Loading/Loading";
import {Toast} from "primereact/toast";
import {confirmDialog, ConfirmDialog} from "primereact/confirmdialog";
import {useRouter} from "next/router";

const LandingBookRegister = () => {
    const toast = useRef(null);
    const router = useRouter()
    const {
        students,
        removeStudent,
        getStudentsBySchool,
        studentsLoading
    } = useContext(StudentsContext);

    const {
        user,
    } = useContext(UserContext);

    const headers = [
        {field: 'n', header: 'N#'},
        {field: 'run', header: 'RUN'},
        {field: 'name', header: 'Nombre'},
        {field: 'origin', header: 'Procedencia'},
        {field: 'natDate', header: 'Fecha Nacimiento'},
        {field: 'enterDate', header: 'Fecha Ingreso'},
        {field: 'state', header: 'Estado Alumno'},
    ]

    const removeStudents = (id) => {
        confirmDialog({
            message: '¿Estás seguro/a que deseas retirar a este alumno??',
            header: 'Confirmación',
            icon: 'pi pi-exclamation-triangle',
            defaultFocus: 'accept',
            accept: () => accept(id),
            reject,
            acceptLabel: 'Si',
            rejectLabel: 'No'
        });
    }

    const accept = (id) => {
        removeStudent(id)
        getStudentsBySchool(user.establecimiento)
        toast.current.show({severity: 'success', summary: 'Confirmed', detail: 'Alumno retirado', life: 3000});
    }

    const reject = () => {
        toast.current.show({
            severity: 'info',
            summary: 'Alumno no retirado',
            life: 3000
        });
    }

    const onEdit = (id) => {
        router.push({
            pathname: '/libro-de-matricula/editar/',
            query: {
                id
            }
        })
    }

    const enhancedStudents = students.map(student => {
        return {
            ...student,
            edit: <Button label="Editar" onClick={() => onEdit(student.id)} severity="info"/>,
            remove: <Button label="Retirar" onClick={() => removeStudents(student.id)} severity="danger"/>
        }
    }).filter(student => {
        return student.state === 'Activo'
    })
    user.perfil === 'admin' && headers.push({field: 'edit', header: 'Acciones'}, {field: 'remove'})
    const search = ['run', 'name'];
    const emptyMessage = 'No existen alumnos con estos datos';

    if (studentsLoading) {
        return <Loading/>
    }

    return (
        <div className={style.landingBookRegister}>
            <Toast ref={toast}/>
            <ConfirmDialog/>
            <Title title={'Libro de matrícula'}/>
            <div className={style.buttonGroup}>
                <Link href='/matricula'>
                    <Button text={'Matricular Alumno'} type={'primary'}/>
                </Link>

                <Button text={'Descargar Libro De Matrícula'} type={'primary'}/>
            </div>
            <DataTableFilter
                size={'20%'}
                isEdit={true}
                headers={headers}
                search={search}
                isExport={true}
                emptyMessage={emptyMessage}
                data={enhancedStudents}
            />
        </div>
    );
};

export default LandingBookRegister;