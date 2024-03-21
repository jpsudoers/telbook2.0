import React from "react";
import {formatDate, formatRun} from "@/utils/formats";
import {Button} from "primereact/button";
import Link from "next/link";

export const studentsDecorator = (students) => {
    return students.map(student => {
        console.log(student)
        return {
            id: student.id,
            n: student.numeroMatricula,
            run: formatRun(student.run),
            name: student.nombreCompleto,
            type: student.tipoTel,
            origin: student.procedencia,
            natDate: formatDate(student.fechaNacimiento.toString()),
            enterDate: formatDate(student.fechaIncorporacion),
            //JPS se cambia de inactivo a Retirado
            //state: student.codigoAlumno == '1' ? 'Activo' : 'Inactivo',
            state: student.codigoAlumno == '1' ? 'Activo' : 'Retirado',
            grade: student.curso,
            gender: student.sexo,//.toUpperCase() === 'M' ? 'Masculino' : 'Femenino',
            read: <Link
                href={{
                    pathname: "/alumno/[run]",
                    query: {
                        run: student.run,
                        student: JSON.stringify(student)
                    }
                }}
                as={`alumno/${student.run}`}
            ><Button label="Ver" severity="success"/>
            </Link>
        }
    })
}

export const studentDecorator = (student) => {
    console.log(student)
    return {
        id: student.id,
        run: formatRun(student.run),
        name: student.nombreCompleto,
        type: student.tipoTel,
        origin: student.procedencia,
        natDate: formatDate(student.fechaNacimiento.toString()),
        enterDate: formatDate(student.fechaIncorporacion),
        // JPS se cambia de Inactivo a Retirado
        state: student.codigoAlumno == 1 ? 'Activo' : 'Retirado',
        //state: student.codigoAlumno == 1 ? 'Activo' : 'Inactivo',
        grade: student.curso,
        n: student.numeroMatricula,
        gender: student.sexo.toUpperCase() === 'M' ? 'Masculino' : 'Femenino',
        edit: <Button label="Editar" severity="info"/>,
        read: <Button label="Ver" severity="success"/>
    }
}