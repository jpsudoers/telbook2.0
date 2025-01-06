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
import {InputText} from "primereact/inputtext";
import { InputTextarea } from 'primereact/inputtextarea';
import swal from 'sweetalert';
import ExcelJS from 'exceljs';

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
    const [otp, setOtp] = useState('');
    const [comment, setComment] = useState('');
    
    const router = useRouter();

    // Función auxiliar para normalizar el valor de presente
    const normalizePresenteValue = (value) => {
        // Convertir a número si es string
        const numValue = Number(value);
        
        // Si es NaN o undefined, retornar 0
        if (isNaN(numValue) || value === undefined) {
            return 0;
        }
        
        // Si es 1 retornar 1, cualquier otro número retornar 0
        return numValue === 1 ? 1 : 0;
    };

    useEffect(() => {
        console.log('Datos crudos de Firebase:', attendances);

        let newAttendance = {};
        let studentsInCoursePlusAttendance = [...filteredStudents.map(item => ({ run: item.run.replaceAll('.',''), name: item.name || '' }))]

        attendances.forEach(attendance => {
            console.log('Procesando asistencia del día:', attendance.day);
            console.log('Alumnos en esta asistencia:', attendance.alumnos);

            attendance.alumnos.forEach(alumno => {
                console.log('Procesando alumno:', alumno.run);
                console.log('Valor presente original:', alumno.presente);
                console.log('Tipo de dato presente:', typeof alumno.presente);

                let student = students.find(item => item.run.replaceAll('.','') === alumno.run);
                const studentName = student?.name

                if (!studentsInCoursePlusAttendance.find(item => item.run === alumno.run))
                    studentsInCoursePlusAttendance.push({run: alumno.run, name: studentName});

                if (!newAttendance[alumno.run])
                    newAttendance[alumno.run] = { asistencias: {}, name: studentName ? studentName : '' };
                
                // Asegurarse de que el valor de presente sea explícitamente 1 o 0
                const presenteValue = normalizePresenteValue(alumno.presente);
                console.log('Valor presente procesado:', presenteValue);
                
                newAttendance[alumno.run].asistencias[attendance.day] = presenteValue;
            });
        });

        console.log('Objeto de asistencia procesado:', newAttendance);

        studentsInCoursePlusAttendance.sort((a, b) => a.name?.localeCompare(b.name));
        studentsInCoursePlusAttendance = studentsInCoursePlusAttendance.filter((student, index, self) =>
            index === self.findIndex((s) => s.run === student.run)
        );
        
        setTempAttendance(newAttendance);
        setStudentsInAttendances(studentsInCoursePlusAttendance);
        setDaysWithAttendance(attendances.map(item => item.day));
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

        console.log('Cambiando asistencia:', {run, day, newValue});

        setTempAttendance(prevState => {
            const student = students.find(s => s.run.replaceAll('.', '') === run);
            const asistencias = prevState[run]?.asistencias || {};
            
            // Si el valor es null o undefined, lo tratamos como ausente (0)
            const valueToStore = newValue === 1 ? 1 : 0;

            return {
                ...prevState,
                [run]: {
                    ...prevState[run],
                    name: student?.name,
                    asistencias: {
                        ...asistencias,
                        [day]: valueToStore
                    }
                }
            }
        });

        // si el dia no está en daysWithAttendance, lo agrego
        if (!daysWithAttendance.includes(day))
            setDaysWithAttendance([...daysWithAttendance, day]);
    }

    const saveAttendances = async () => {
        setEditMode(false)
        const attendancesAsFirebase = [];
        for (const [run, data] of Object.entries(tempAttendance)) {
            for (const [day, presente] of Object.entries(data.asistencias)) {
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
                        otp: otp,
                        comment: comment
                    };
                    attendancesAsFirebase.push(dayData);
                }
                // Asegurar que el valor sea 1 o 0
                const presenteValue = presente === 1 ? 1 : 0;
                dayData.alumnos.push({ presente: presenteValue, run });
            }
        }
        await updateAttendance(attendancesAsFirebase)
        setOtp('')
        setComment('')
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

    const downloadExcel = async () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Asistencia');

        // Agregar el título del curso
        const titleRow = worksheet.addRow([`CURSO: ${grade.toUpperCase()}`]);
        titleRow.font = { bold: true, size: 14 };
        worksheet.addRow([]); // Fila en blanco después del título

        // Configurar estilos
        const headerStyle = {
            font: { bold: true },
            alignment: { horizontal: 'center' },
            fill: {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFE0E0E0' }
            }
        };

        // Agregar encabezados con las nuevas columnas
        const headers = ['Nombre'];
        getAllDaysInMonth(selectedMonth.code, selectedYear).forEach((_, index) => {
            headers.push(index + 1);
        });
        // Agregar encabezados de las columnas de estadísticas
        headers.push('DT', 'DA', 'DI', '%A', '%I');
        worksheet.addRow(headers);

        // Aplicar estilo a los encabezados
        worksheet.getRow(3).eachCell((cell) => {
            cell.style = headerStyle;
        });

        // Agregar datos de estudiantes con sus estadísticas
        studentsInAttendances.forEach(student => {
            const formattedRun = student.run.replaceAll('.', '');
            const rowData = [student.name?.toUpperCase() || `Nombre no encontrado (${student.run})`];
            
            // Contadores para las estadísticas
            let diasTrabajados = 0;
            let diasAsistidos = 0;
            let diasInasistidos = 0;

            // Agregar los datos de asistencia por día
            getAllDaysInMonth(selectedMonth.code, selectedYear).forEach((day) => {
                const dayNumber = day.getUTCDate().toString().padStart(2, '0');
                const asistencia = tempAttendance[formattedRun]?.asistencias[dayNumber];
                
                // Solo contar días donde hay registro (1 o 0)
                if (daysWithAttendance.includes(dayNumber)) {
                    diasTrabajados++;
                    if (asistencia === 1) {
                        diasAsistidos++;
                    } else {
                        diasInasistidos++;
                    }
                }
                
                rowData.push(asistencia === 1 ? 1 : asistencia === 0 ? 0 : '-');
            });

            // Calcular porcentajes
            const porcentajeAsistencia = diasTrabajados > 0 ? 
                ((diasAsistidos / diasTrabajados) * 100).toFixed(1) : '0.0';
            const porcentajeInasistencia = diasTrabajados > 0 ? 
                ((diasInasistidos / diasTrabajados) * 100).toFixed(1) : '0.0';

            // Agregar las estadísticas al final de la fila
            rowData.push(
                diasTrabajados,
                diasAsistidos,
                diasInasistidos,
                porcentajeAsistencia,
                porcentajeInasistencia
            );
            
            worksheet.addRow(rowData);
        });

        // Agregar totales con estilo amarillo
        const summaryStyle = {
            font: { bold: true },
            fill: {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFFFFF00' }
            }
        };

        worksheet.addRow([]); // Fila en blanco antes de los totales

        // Agregar PRESENTE, AUSENTE y TOTAL con las columnas adicionales vacías
        const addSummaryRow = (label, values) => {
            const rowData = [label];
            getAllDaysInMonth(selectedMonth.code, selectedYear).forEach((_, idx) => {
                const dayNumber = (idx + 1).toString().padStart(2, '0');
                rowData.push(summary[dayNumber]?.[values] || 0);
            });
            // Agregar 5 celdas vacías para las columnas de estadísticas
            rowData.push('', '', '', '', '');
            const row = worksheet.addRow(rowData);
            row.eachCell(cell => {
                cell.style = summaryStyle;
            });
        };

        addSummaryRow('PRESENTE', 'presente');
        addSummaryRow('AUSENTE', 'ausente');
        addSummaryRow('TOTAL', 'total');

        // Agregar una fila en blanco antes de la leyenda
        worksheet.addRow([]);

        // Agregar la leyenda
        const leyendaStyle = {
            font: { size: 11 },
            alignment: { vertical: 'middle', horizontal: 'left' }
        };

        worksheet.addRow(['DT: Días Trabajados']).eachCell(cell => cell.style = leyendaStyle);
        worksheet.addRow(['DA: Días Asistidos']).eachCell(cell => cell.style = leyendaStyle);
        worksheet.addRow(['DI: Días Inasistidos']).eachCell(cell => cell.style = leyendaStyle);
        worksheet.addRow(['%A: Porcentaje de Asistencia']).eachCell(cell => cell.style = leyendaStyle);
        worksheet.addRow(['%I: Porcentaje de Inasistencia']).eachCell(cell => cell.style = leyendaStyle);

        // Ajustar ancho de columnas
        worksheet.getColumn(1).width = 30;
        worksheet.columns.forEach((column, index) => {
            if (index > 0) column.width = 10;
        });

        // Generar y descargar el archivo
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Asistencia-${grade}-${selectedMonth.name}-${selectedYear}.xlsx`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    // Función para calcular estadísticas de asistencia por estudiante
    const calculateStudentStats = (run) => {
        if (!tempAttendance[run]?.asistencias) return {
            diasTrabajados: 0,
            diasAsistidos: 0,
            diasSinAsistencia: 0,
            porcentajeAsistencia: 0,
            porcentajeInasistencia: 0
        };

        // Obtener solo los días que tienen valor 1 o 0 (ignorar los días sin asistencia marcada)
        const asistencias = Object.values(tempAttendance[run].asistencias).filter(a => a === 1 || a === 0);
        
        // Calcular estadísticas solo con días válidos
        const diasTrabajados = asistencias.length;
        const diasAsistidos = asistencias.filter(a => a === 1).length;
        const diasSinAsistencia = asistencias.filter(a => a === 0).length;
        
        // Calcular porcentajes solo si hay días trabajados
        const porcentajeAsistencia = diasTrabajados ? ((diasAsistidos / diasTrabajados) * 100).toFixed(1) : 0;
        const porcentajeInasistencia = diasTrabajados ? ((diasSinAsistencia / diasTrabajados) * 100).toFixed(1) : 0;

        return {
            diasTrabajados,
            diasAsistidos,
            diasSinAsistencia,
            porcentajeAsistencia,
            porcentajeInasistencia
        };
    };

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
                            }}>{header.header}</th>
                        })}
                        {/* Encabezados modificados */}
                        <th style={{padding: '1rem 0', textAlign: 'center', color: 'gray'}}>DT</th>
                        <th style={{padding: '1rem 0', textAlign: 'center', color: 'gray'}}>DA</th>
                        <th style={{padding: '1rem 0', textAlign: 'center', color: 'gray'}}>DI</th>
                        <th style={{padding: '1rem 0', textAlign: 'center', color: 'gray'}}>%A</th>
                        <th style={{padding: '1rem 0', textAlign: 'center', color: 'gray'}}>%I</th>
                    </tr>
                </thead>

                {/* cuerpo */}
                <tbody className='p-datatable-tbody'>

                    {/* estudiantes */}
                    {studentsInAttendances.map(student => {
                        const formattedRun = student.run.replaceAll('.', '')
                        const stats = calculateStudentStats(formattedRun);

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
                                                        <MultiStateCheckbox 
                                                            id={{ run: formattedRun, day: dayNumber, name: student.name }}
                                                            value={tempAttendance[formattedRun]?.asistencias[dayNumber] ?? null}
                                                            disabled={!editMode}
                                                            onChange={handleChange}
                                                            options={[
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
                                                            ]}
                                                            optionValue="value"
                                                            style={tempAttendance[formattedRun]?.asistencias[dayNumber] === 1 ? 
                                                                {backgroundColor: 'green', borderColor: 'green'} : 
                                                                tempAttendance[formattedRun]?.asistencias[dayNumber] === 0 ? 
                                                                {backgroundColor: 'red', borderColor: 'red'} : 
                                                                {backgroundColor: 'lightgray'}}
                                                        />
                                                    </td>
                                                )
                                            } else {
                                                return (
                                                    <td key={day} style={{padding: 'unset', textAlign: 'center'}}>
                                                        <MultiStateCheckbox 
                                                            id={{ run: formattedRun, day: dayNumber, name: student.name }}
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
                                        } else { // si es un dia que no tiene asistencia en la DB
                                            return (
                                                <td key={day} style={{padding: 'unset', textAlign: 'center'}}>
                                                    <MultiStateCheckbox 
                                                        id={{ run: formattedRun, day: dayNumber, name: student.name }}
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

                                {/* Nuevas columnas de estadísticas */}
                                <td style={{padding: '10px', fontSize: '12px', textAlign: 'center'}}>
                                    {stats.diasTrabajados}
                                </td>
                                <td style={{padding: '10px', fontSize: '12px', textAlign: 'center'}}>
                                    {stats.diasAsistidos}
                                </td>
                                <td style={{padding: '10px', fontSize: '12px', textAlign: 'center'}}>
                                    {stats.diasSinAsistencia}
                                </td>
                                <td style={{padding: '10px', fontSize: '12px', textAlign: 'center'}}>
                                    {stats.porcentajeAsistencia}%
                                </td>
                                <td style={{padding: '10px', fontSize: '12px', textAlign: 'center'}}>
                                    {stats.porcentajeInasistencia}%
                                </td>
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
            <Button label='Descargar PDF' severity='success' onClick={getImage} className="mr-2"/>
            <Button label='Descargar Excel' severity='success' onClick={downloadExcel}/>
        </div>

        <div className='my-2'>
            {user.perfil === 'admin' && (editMode ?
            
                    <Button
                        className='my-2'
                        label='Guardar asistencia'
                        severity={'success'}
                        disabled={otp.length !== 6}
                        onClick={() => saveAttendances()}/> :
                    <Button
                        className='my-2'
                        label='Editar asistencia'
                        severity={'info'}
                        onClick={() => setEditMode(true)}/>
            )}
        </div>

        <div className='my-2'>
            {editMode == true && (
                <InputText
                    id='otp'
                    name='otp'
                    type='password'
                    keyfilter={/^\d{0,4}$/}
                    placeholder='Ingresar Clave de GOB'
                    value={otp}
                    onChange={(e) => { setOtp(e.target.value) }}
                />
               
            )}
        </div>
        <div className='my-2'>
            {editMode == true && (
                
                <InputTextarea
                    id='comment'
                    name='comment'
                    rows={4}
                    cols={40}
                    //type='password'
                    //keyfilter={/^\d{0,4}$/}
                    placeholder='Ingrese el comentario. POR NORMATIVA; DEBE INGRESAR COMENTARIOS'
                    value={comment}
                    onChange={(e) => { setComment(e.target.value) }}
                />
               
            )}
        </div>

        <div style={{
            marginTop: '20px',
            padding: '15px',
            backgroundColor: '#f8f9fa',
            borderRadius: '5px',
            fontSize: '12px'
        }}>
            <strong>Leyenda:</strong>
            <div style={{display: 'flex', gap: '20px', marginTop: '10px'}}>
                <div>DT: Días Trabajados</div>
                <div>DA: Días Asistidos</div>
                <div>DI: Días Inasistidos</div>
                <div>%A: Porcentaje de Asistencia</div>
                <div>%I: Porcentaje de Inasistencia</div>
            </div>
        </div>

    </div>);
};

export default Historic;