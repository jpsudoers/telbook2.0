import React, {useState, useContext, useEffect, useRef} from 'react';
import {useScreenshot, createFileName} from 'use-react-screenshot'
import {Dropdown} from "primereact/dropdown";
import {currentDay, currentMonth, currentYear, getAllDaysInMonth, months, years} from "@/utils/date";
import {MultiStateCheckbox} from "primereact/multistatecheckbox";
import StudentsContext from "@/context/students/Students.context";
import Loading from "@/components/commons/Loading/Loading";
import {Button} from "primereact/button";
import {jsPDF} from 'jspdf';
import UserContext from "@/context/user/User.context";
import {useRouter} from "next/router";

const options = [
    {
        value: 1,
        icon: 'pi pi-check',
        style: {backgroundColor: 'green', borderColor: 'green'}
    },
    {
        value: 0,
        icon: 'pi pi-times',
        style: {backgroundColor: 'red', borderColor: 'red'}
    }
];

const Historic = ({filteredStudents, grade}) => {
    const {
        students, attendances, attendancesError, attendancesLoading, getAttendanceByMonth, updateAttendance
    } = useContext(StudentsContext);

    const [tempAttendance, setTempAttendance] = useState({}); // va a contener las asistencias iniciales, las que se van modificando, y las que se van a guardar finalmente
    const [studentsInAttendances, setStudentsInAttendances] = useState([]); // va a contener los estudiantes del curso, y tambien estudiantes que no estan en el curso pero que tienen asistencia
    const [daysWithAttendance, setDaysWithAttendance] = useState([]); // ["14","19","20","21",]
    
    const router = useRouter();

    useEffect(() => {
        // newAttendance es un objeto temporal que se va a usar para setear el estado de tempAttendance
        // studentsInCoursePlusAttendance es el array temporal que se va a usar para setear el estado de studentsInAttendances

        let newAttendance = {};
        let studentsInCoursePlusAttendance = [...filteredStudents.map(item => ({ run: item.run.replaceAll('.',''), name: item.name || '' }))]

        attendances.forEach(attendance => { // por cada asistencia...
            attendance.alumnos.forEach(alumno => { // por cada alumno en la asistencia...
                let student = students.find(item => item.run.replaceAll('.','') === alumno.run); // busco el alumno en la lista de alumnos...
                const studentName = student?.name // ...para poder extraer su nombre

                // lo agrego a studentsInCoursePlusAttendance si es que no está
                if (!studentsInCoursePlusAttendance.find(item => item.run === alumno.run))
                    studentsInCoursePlusAttendance.push({run: alumno.run, name: studentName});

                // si el alumno no está en newAttendance, lo agrego
                if (!newAttendance[alumno.run]) // si no existe el alumno en newAttendance...
                    newAttendance[alumno.run] = { asistencias: {}, name: studentName ? studentName : '' }; // ...creo el alumno y seteo el nombre o un string vacío
                
                newAttendance[alumno.run].asistencias[attendance.day] = alumno.presente; // finalmente agrego la asistencia al alumno en newAttendance
            });
        });
        studentsInCoursePlusAttendance.sort((a, b) => a.name?.localeCompare(b.name)); // ordeno los estudiantes por nombre
        studentsInCoursePlusAttendance = studentsInCoursePlusAttendance.filter((student, index, self) =>
            index === self.findIndex((s) => s.run === student.run)
        );
        setTempAttendance(newAttendance); // actualizo el estado
        setStudentsInAttendances(studentsInCoursePlusAttendance); // actualizo el estado

        // obtengo los días de asistencia del mes. despues se actualiza cada vez que cambia un dia
        setDaysWithAttendance(attendances.map(item => item.day)); // actualizo el estado
    }, [attendances]);

    const {
        user,
    } = useContext(UserContext);

    const ref = useRef(null)
    const download = (image, {
        name = 'Asistencia-' + grade + '-' + selectedMonth.name + '-' + selectedYear
    } = {}) => {
        let doc = new jsPDF('landscape');
        doc.addImage(image, 'PNG', 15, 15, 270, 160);
        doc.save(name + '.pdf');

    }
    const [image, takeScreenshot] = useScreenshot()
    const getImage = () => takeScreenshot(ref.current).then(download)

    
    const formatAttendances = attendances.map((attendance) => {
        return attendance.alumnos.map(alumno => {
            const time = attendance.id.split('-')[3]
            let current;
            switch (alumno.presente) {
                case 1:
                    current = 'presente';
                    break
                case 0:
                    current = 'ausente';
                    break
                case 2:
                    current = 'sin-clase';
                    break
                default:
                    current = 'ausente';
                    break
            }
            return {[alumno.run + '-' + time]: current}
        })
    })

    const newObj = Object.assign({}, ...formatAttendances.flat(1))

    const res = {
        16: {
            total: 0, presente: 0, ausente: 0,
        },
    }

    const totals = {}
    formatAttendances.forEach(day => {
        if (day.length > 0) {
            const dayAsis = new Date(parseInt(Object.keys(day[0])[0].split('-')[2]))
            let ausente = 0;
            let presente = 0;
            day.forEach(asis => {
                Object.values(asis).forEach(val => {
                    if (val === 'presente') {
                        presente++;
                    } else if (val === 'ausente') {
                        ausente++;
                    }
                })
            })
            totals[dayAsis.getUTCDate().toString()] = {
                ausente, presente, total: ausente + presente
            }
        }
    })

    const [editMode, setEditMode] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState(months[currentMonth]);
    const [selectedYear, setSelectedYear] = useState(currentYear);
    const [assistanceValue, setAssistanceValue] = useState(newObj);

    useEffect(() => {
        getAttendanceByMonth(grade.toUpperCase(), selectedMonth.code - 1, selectedYear)
        setAssistanceValue(newObj)
    }, [selectedMonth])

    const headers = [{header: 'Nombre'}, ...getAllDaysInMonth(selectedMonth.code, selectedYear).map((day, index) => {
        return {
            header: index + 1
        }
    })]

    const handleChange = ({target}) => {
        const run = target.id.run
        const day = target.id.day
        const newValue = target.value
        setTempAttendance(prevState => {
            const student = students.find(s => s.run.replaceAll('.', '') === run);
            const asistencias = prevState[run]?.asistencias || {};
            return {
                ...prevState,
                [run]: {
                    ...prevState[run],
                    name: student?.name,
                    asistencias: {
                        ...asistencias,
                        [day]: newValue
                    }
                }
            }
        })
    
        // si el dia no está en daysWithAttendance, lo agrego
        if (!daysWithAttendance.includes(day))
            setDaysWithAttendance([...daysWithAttendance, day])
        
    }

    const saveAttendances = async () => {
        setEditMode(false)
        const attendancesAsFirebase = [];
        for (const [run, data] of Object.entries(tempAttendance)) { // por cada alumno
            for (const [day, presente] of Object.entries(data.asistencias)) { // por cada dia de asistencia del alumno
                let dayData = attendancesAsFirebase.find(d => d.day === day);
                if (!dayData) {
                    const date = new Date();
                    date.setDate(day)
                    date.setMonth(selectedMonth.code.toString())
                    date.setFullYear(selectedYear)
                    date.setHours(0, 0, 0, 0)
                    dayData = {
                        alumnos: [],
                        curso: grade.toUpperCase(),
                        id: 'asis-' + grade + '-' + date.getTime(),
                        run: user.run,
                        updated: [],
                        publishedAt: date,
                        day,
                        month: selectedMonth.code.toString().padStart(2, '0'),
                        year: currentYear.toString(),
                    };
                    attendancesAsFirebase.push(dayData);
                }
                if (presente !== null) {
                    dayData.alumnos.push({ presente, run });
                } 
            }
        }
        await updateAttendance(attendancesAsFirebase)
    }

    const summary = {}
    attendances.map(item => {
        summary[item.day] = {presente: 0, ausente: 0, total: 0}
        item.alumnos.map(alumno => {
            if (alumno.presente === 1) summary[item.day].presente++
            if (alumno.presente === 0) summary[item.day].ausente++
            summary[item.day].total++
        })
    })

    if (attendancesLoading) {
        return <Loading/>
    }
    return (<div className="p-datatable p-component p-datatable-responsive-scroll pb-3"
                 data-scrollselectors=".p-datatable-wrapper" data-pc-name="datatable" data-pc-section="root">
        <div ref={ref}>
            <div className='flex'>
                <div className="card" style={{padding: '10px 0'}}>
                    <label htmlFor='select-month'
                           style={{fontWeight: 'bold', display: 'block', marginBottom: '10px'}}>
                        Seleccionar mes
                    </label>
                    <Dropdown id='select-month' value={selectedMonth} onChange={(e) => setSelectedMonth(e.value)}
                              options={months}
                              optionLabel="name"
                              placeholder="Selecciona un mes" className="w-full md:w-14rem"/>
                </div>
                <div className="card" style={{padding: '10px 0'}}>
                    <label htmlFor='select-month'
                           style={{fontWeight: 'bold', display: 'block', marginBottom: '10px'}}>
                        Seleccionar año
                    </label>
                    <Dropdown id='select-month' value={selectedYear} onChange={(e) => setSelectedYear(e.value)}
                              options={years}
                              placeholder="Selecciona año" className="w-full md:w-14rem"/>
                </div>
            </div>

            {/* tabla */}
            <table className='p-datatable-table' role="table" data-pc-section="table">

                {/* cabecera */}
                <thead className="p-datatable-thead" data-pc-section="thead">
                    {/* headers */}
                    <tr role="row" data-pc-section="headerrow">
                        {headers.map((header, index) => {
                            return <th key={index} style={{
                                padding: '1rem 0',
                                textAlign: index === 0 ? 'left' : 'center',
                                color: index === currentDay && currentMonth === selectedMonth.code - 1 ? '#6466f1' : 'gray'
                            }}>{header.header}
                            </th>
                        })}
                    </tr>
                </thead>

                {/* cuerpo */}
                <tbody className='p-datatable-tbody'>

                    {/* estudiantes */}
                    {studentsInAttendances.map(student => {
                        const formattedRun = student.run.replaceAll('.', '')

                        return (
                            <tr key={student.run}>
                                {/* nombre estudiante */}
                                <td style={{padding: '10px', fontSize: '12px'}}>
                                    {student.name?.toUpperCase() || `Nombre no encontrado (${student.run})`}
                                </td>

                                {/* dias */}
                                {getAllDaysInMonth(selectedMonth.code, selectedYear)
                                    .map(day => { // for each day in the month
                                        const dayNumber = day.getUTCDate().toString().padStart(2, '0') // the number of this day. e.g. 31

                                        if (daysWithAttendance.includes(String(dayNumber))) { // si es un dia que tiene asistencia en la DB

                                            if (tempAttendance[formattedRun]) {
                                                const studentAttendanceDay = tempAttendance[formattedRun].asistencias[dayNumber] // attendance value for this student in this day (1 or 0)
                                                return (
                                                    <td key={day} style={{padding: 'unset', textAlign: 'center'}}>
                                                        <MultiStateCheckbox id={{ run: formattedRun, day: dayNumber, name: student.name }}
                                                                            value={studentAttendanceDay}
                                                                            disabled={!editMode}
                                                                            onChange={handleChange}
                                                                            options={options}
                                                                            optionValue="value"
                                                        />
                                                    </td>
                                                )
                                            }
                                            
                                            else {
                                                return (
                                                    <td key={day} style={{padding: 'unset', textAlign: 'center'}}>
                                                        <MultiStateCheckbox id={{ run: formattedRun, day: dayNumber, name: student.name }}
                                                                            value={null}
                                                                            disabled={!editMode}
                                                                            onChange={handleChange}
                                                                            options={options}
                                                                            optionValue="value"
                                                        />
                                                    </td>
                                                )
                                            }
                                        }
                                        
                                        else { // si es un dia que no tiene asistencia en la DB
                                            return (
                                                <td key={day} style={{padding: 'unset', textAlign: 'center'}}>
                                                    <MultiStateCheckbox id={{ run: formattedRun, day: dayNumber, name: student.name }}
                                                                        value={null}
                                                                        disabled={!editMode}
                                                                        onChange={handleChange}
                                                                        options={options}
                                                                        optionValue="value"
                                                                        style={{backgroundColor: 'lightgray'}}
                                                    />
                                                </td>
                                            )
                                        }
                                    })
                                }
                            </tr>
                        )
                    })}

                    {/* resumen */}
                    <tr>
                        <td style={{padding: '10px', fontSize: '12px'}}>
                            <strong>Presente</strong>
                        </td>
                        {getAllDaysInMonth(selectedMonth.code, selectedYear).map((day, idx) => {
                            const dayNumber = (idx + 1).toString().padStart(2, '0')
                            return <td key={idx} style={{padding: 'unset', textAlign: 'center', color: 'gray'}}>
                                <strong>{summary[dayNumber]?.presente}</strong>
                            </td>
                        })}
                    </tr>
                    <tr>
                        <td style={{padding: '10px', fontSize: '12px'}}>
                            <strong>Ausente</strong>
                        </td>
                        {getAllDaysInMonth(selectedMonth.code, selectedYear).map((day, idx) => {
                            const dayNumber = (idx + 1).toString().padStart(2, '0')
                            return <td key={idx} style={{padding: 'unset', textAlign: 'center', color: 'gray'}}>
                                <strong>{summary[dayNumber]?.ausente}</strong>
                            </td>
                        })}
                    </tr>
                    <tr>
                        <td style={{padding: '10px', fontSize: '12px'}}>
                            <strong>Total</strong>
                        </td>
                        {getAllDaysInMonth(selectedMonth.code, selectedYear).map((day, idx) => {
                            const dayNumber = (idx + 1).toString().padStart(2, '0')
                            return <td key={idx} style={{padding: 'unset', textAlign: 'center', color: 'gray'}}>
                                <strong>{summary[dayNumber]?.total}</strong>
                            </td>
                        })}
                    </tr>
                </tbody>
            </table>
        </div>
        <div className='my-2'>
            <Button label='Descargar asistencia' severity='success' onClick={getImage}/>
        </div>

        {user.perfil === 'admin' && (editMode ?
                <Button
                    className='my-2'
                    label='Guardar asistencia'
                    severity={'success'}
                    onClick={() => saveAttendances()}/> :
                <Button
                    className='my-2'
                    label='Editar asistencia'
                    severity={'info'}
                    onClick={() => setEditMode(true)}/>
        )}
    </div>);
};

export default Historic;