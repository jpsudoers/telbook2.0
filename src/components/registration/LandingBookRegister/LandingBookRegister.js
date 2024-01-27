import React, {useContext} from 'react';
import StudentsContext from "@/context/students/Students.context";
import Title from '@/components/commons/Title/Title';
import style from './LandingBookRegister.module.scss';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import Button from '@/components/commons/Button/Button';
import DataTableFilter from '@/components/commons/DataTable/DataTable';
import Link from "next/link";

const LandingBookRegister = () => {
    const {
        students,
    } = useContext(StudentsContext);

    const headers = [
        {field: 'n', header: 'N#'},
        {field: 'run', header: 'RUN'},
        {field: 'name', header: 'Nombre'},
        // {field: 'type', header: 'Tipo TEL'},
        {field: 'origin', header: 'Procedencia'},
        {field: 'natDate', header: 'Fecha Nacimiento'},
        {field: 'enterDate', header: 'Fecha Ingreso'},
        {field: 'state', header: 'Estado Alumno'},
        {field: 'edit', header: 'Acciones'}
    ]
    const search = ['run', 'name'];
    const emptyMessage = 'No existen alumnos con estos datos';

    console.log(students)

    return (
        <div className={style.landingBookRegister}>
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
                data={students}
            />
        </div>
    );
};

export default LandingBookRegister;