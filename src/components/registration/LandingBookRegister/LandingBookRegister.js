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
import autoTable from "jspdf-autotable";
import {orderByList} from "@/utils/sort";
import swal from 'sweetalert';
import { CSVLink, CSVDownload } from "react-csv";



const LandingBookRegister = () => {
    const toast = useRef(null);
    const router = useRouter()
    const {
        students, studentsRaw, removeStudent, getStudentsBySchool, studentsLoading
    } = useContext(StudentsContext);

    const {
        user,
    } = useContext(UserContext);

    const headers = [{field: 'n', header: 'N#'}, {field: 'run', header: 'RUN'}, {
        field: 'name',
        header: 'Nombre'
    }, {field: 'origin', header: 'Procedencia'}, {field: 'natDate', header: 'Fecha Nacimiento'}, {
        field: 'enterDate',
        header: 'Fecha Ingreso'
    }, {field: 'state', header: 'Estado Alumno'},]

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
        // JPS agrego información
        swal("Realizado", "Alumno retirado", "success");
        //toast.current.show({severity: 'success', summary: 'Confirmed', detail: 'Alumno retirado', life: 3000});
    }

    const reject = () => {
        toast.current.show({
            severity: 'info', summary: 'Alumno no retirado', life: 3000
        });
    }

    const onEdit = (id) => {
        router.push({
            pathname: '/libro-de-matricula/editar/', query: {
                id
            }
        })
    }

    const enhancedStudents = students.map(student => {
        const enhancedStudent = {
            ...student,
        }
        if (student?.state === 'Activo') {
            enhancedStudent.edit = <Button label="Editar" onClick={() => onEdit(student.id)} severity="info"/>
            enhancedStudent.remove = <Button label="Retirar" onClick={() => removeStudents(student.id)} severity="danger"/>
        }
        return enhancedStudent
    })
    user.perfil === 'admin' && headers.push({field: 'edit', header: 'Acciones'}, {field: 'remove'})
    const search = ['run', 'name'];
    const emptyMessage = 'No existen alumnos con estos datos';

    const exportToPDF = () => {
        import('jspdf').then((jsPDF) => {
            import('jspdf-autotable').then(() => {
                const doc = new jsPDF.default('l', 0, 0);
                const dataToPdf = orderByList(studentsRaw)
                let rowOk = []
                doc.text(10, 10, 'Libro de matrícula');
                rowOk.push([['N°'], ['Nombre'], ['Género'], ['Curso'], ['RUN'], ['F. Nacimiento'], ['F. Incorpotacion'], ['F. Retiro'], ['Domicilio'], ['Comuna'], ['Tipo de TEL']])
                dataToPdf.forEach(data => {
                    let row = [];
                    row.push([data.numeroMatricula])
                    row.push([data.nombreCompleto])
                    row.push([data.sexo])
                    row.push([data.curso])
                    row.push([data.run])
                    row.push([data.fechaNacimiento])
                    row.push([data.fechaIncorporacion])
                    row.push([data.fechaRetiroEscuela])
                    row.push([data.domicilio])
                    row.push([data.comuna])
                    row.push([data.tipoTel])
                    rowOk.push(row)
                })
                autoTable(doc, {
                    // head: [['Libro de matricula']],
                    body: rowOk, startY: 25,
                })
                doc.save('Libro de matricula.pdf');
            });
        });
    }

    //JPS intentando hacer un export a CSV
    const csvdata = studentsRaw;



    if (studentsLoading) {
        return <Loading/>
    }

   return (<div className={style.landingBookRegister}>
        <Toast ref={toast}/>
        <ConfirmDialog/>
      <div className={style.buttonGroup}>
        <Link href='/matricula'>
          <Button label={'Matricular Alumno'} severity='success'/>
    </Link>

    
    
    {/* <CSVLink data={csvdata} filename = 'libro_matriculas.csv'>Download me</CSVLink> */}

    <Button severity='success' >  <CSVLink data={csvdata} 
                                          separator=";"
                                         
                                          wrapColumnChar="'"
                                          style={{color: 'white', font: 'bold'}}

                                          filename = 'libro_matriculas.csv'>Descarga Libro de Matriculas Completo
                                 </CSVLink>
     </Button>


    
    <Button label={'Descargar Libro De Matrícula Resumido'} onClick={exportToPDF} severity='success'/>
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
    </div>); 
};

export default LandingBookRegister;