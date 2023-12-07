import React, {useContext} from 'react';
import StudentsContext from "@/context/students/Students.context";
import {useRouter} from "next/router";
import Historic from "@/components/curso/asistencia/Historic";
import {getStudentsByGrade} from "@/utils/student";

const LandingAttendanceHistoric = () => {
    const {
        students,
    } = useContext(StudentsContext);

    const router = useRouter();
    const {grade} = router.query;

    const filterStudents = getStudentsByGrade(students, grade)
    return (
        <Historic students={filterStudents} grade={grade}/>
    );
};

export default LandingAttendanceHistoric;