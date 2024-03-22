import React, {useContext} from 'react';
import {useRouter} from "next/router";
import DataTableFilter from "@/components/commons/DataTable/DataTable";
import StudentsContext from "@/context/students/Students.context";

const LandingGrade = () => {
    const {
        students,
    } = useContext(StudentsContext);
    const router = useRouter();
    const {grade} = router.query;
    const headers = [
        {field: 'name', header: 'Nombre', size: '30%'},
        {field: 'run', header: 'RUT', size: '15%'},
        {field: 'type', header: 'Tipo TEL'},
        {field: 'gender', header: 'Género', size: '10%'},
        {field: 'natDate', header: 'Fecha Nacimiento', size: '15%'},
        {field: 'enterDate', header: 'Fecha Matrícula', size: '15%'},
        {field: 'read', header: 'Ver', size: '15%'},
    ]

    const emptyMessage = 'No existen alumnos con estos datos';
    const search = ['run', 'name'];
    const filterStudents = students.filter(student => student.grade === grade.toUpperCase() && student.state === "Activo")
    
    return (
        <div>
            <DataTableFilter
                isEdit={true}
                isHeader={true}
                headers={headers}
                search={search}
                isExport={true}
                emptyMessage={emptyMessage}
                data={filterStudents}
            />
        </div>
    );
};

export default LandingGrade;