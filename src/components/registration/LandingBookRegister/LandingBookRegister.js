import React, {useContext} from 'react';
import StudentsContext from "@/context/students/Students.context";
import Title from '@/components/commons/Title/Title';
import style from './LandingBookRegister.module.scss';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import Button from '@/components/commons/Button/Button';
import DataTableFilter from '@/components/commons/DataTable/DataTable';
import Link from "next/link";
import UserContext from "@/context/user/User.context";

const LandingBookRegister = () => {
    const {
        students,
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
    user.perfil === 'admin' && headers.push({field: 'edit', header: 'Editar'}, {field: 'edit', header: 'Retirar'} )
    const search = ['run', 'name'];
    const emptyMessage = 'No existen alumnos con estos datos';

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