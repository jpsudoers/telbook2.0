import React from "react";
import {formatDate, formatRun} from "@/utils/formats";
import {Button} from "primereact/button";
import Link from "next/link";
import {useRouter} from "next/router";

export const studentsDecorator = (students) => {
    return students.map(student => {
        return {
            run: formatRun(student.run),
            name: student.nombreCompleto,
            type: student.tipoTel,
            origin: student.procedencia,
            natDate: formatDate(student.fechaNacimiento.toString()),
            enterDate: formatDate(student.fechaIncorporacion),
            state: student.codigoAlumno === 1 ? 'Activo' : 'Inactivo',
            grade: student.curso,
            gender: student.sexo.toUpperCase() === 'M' ? 'Masculino' : 'Femenino',
            edit: <Button label="Editar" severity="info"/>,
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
    return {
        run: formatRun(student.run),
        name: student.nombreCompleto,
        type: student.tipoTel,
        origin: student.procedencia,
        natDate: formatDate(student.fechaNacimiento.toString()),
        enterDate: formatDate(student.fechaIncorporacion),
        state: student.codigoAlumno === 1 ? 'Activo' : 'Inactivo',
        grade: student.curso,
        gender: student.sexo.toUpperCase() === 'M' ? 'Masculino' : 'Femenino',
        edit: <Button label="Editar" severity="info"/>,
        read: <Button label="Ver" severity="success"/>
    }
}