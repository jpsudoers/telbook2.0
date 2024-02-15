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

const options = [{
    value: 'presente',
    icon: 'pi pi-check',
    style: {backgroundColor: 'green', borderColor: 'green'}
}, {value: 'ausente', icon: 'pi pi-times', style: {backgroundColor: 'red', borderColor: 'red'}}, {
    value: 'sin-clase',
    icon: 'pi pi-lock',
    style: {backgroundColor: 'blue', borderColor: 'blue'}
}];

const Historic = ({students, grade}) => {
    const {
        attendances, attendancesError, attendancesLoading, getAttendanceByMonth
    } = useContext(StudentsContext);

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

    const totals = {};
    formatAttendances.forEach(day => {
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
    })

    console.log(totals)
    const [editMode, setEditMode] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState(months[currentMonth]);
    const [selectedYear, setSelectedYear] = useState(currentYear);
    const [assistanceValue, setAssistanceValue] = useState(newObj);

    useEffect(() => {
        getAttendanceByMonth(grade.toUpperCase(), selectedMonth.code - 1, selectedYear)
        setAssistanceValue(newObj)
    }, [])

    const headers = [{header: 'Nombre'}, ...getAllDaysInMonth(selectedMonth.code, selectedYear).map((day, index) => {
        return {
            header: index + 1
        }
    })]

    const handleChange = ({target}) => {
        setAssistanceValue({
            ...assistanceValue, [target.id]: target.value
        })
    }

    if (attendancesLoading) {
        return <Loading/>
    }
    console.log(user)
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
            <table className='p-datatable-table' role="table" data-pc-section="table">
                <thead className="p-datatable-thead" data-pc-section="thead">
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
                <tbody className='p-datatable-tbody'>
                {students.map((student, key) => {
                    const initVal = Object.keys(assistanceValue).length === 0 ? newObj : assistanceValue
                    const formatRun = student.run.replaceAll('.', '')
                    return <tr key={key}>
                        <td style={{padding: '10px', fontSize: '12px'}}>
                            {student.name}
                        </td>
                        {getAllDaysInMonth(selectedMonth.code, selectedYear).map((day, idx) => {
                            return <td key={idx} style={{padding: 'unset', textAlign: 'center'}}>
                                <MultiStateCheckbox id={`${formatRun}-${day.getTime()}`}
                                                    value={initVal[`${formatRun}-${day.getTime()}`]}
                                                    disabled={!editMode}
                                                    onChange={handleChange}
                                                    options={options} optionValue="value"/>
                            </td>
                        })}
                    </tr>
                })}
                <tr>
                    <td style={{padding: '10px', fontSize: '12px'}}>
                        <strong>Presente</strong>
                    </td>
                    {getAllDaysInMonth(selectedMonth.code, selectedYear).map((day, idx) => {
                        return <td key={idx} style={{padding: 'unset', textAlign: 'center', color: 'gray'}}>
                            <strong>{totals[parseInt(idx) + 1]?.presente}</strong>
                        </td>
                    })}
                </tr>
                <tr>
                    <td style={{padding: '10px', fontSize: '12px'}}>
                        <strong>Ausente</strong>
                    </td>
                    {getAllDaysInMonth(selectedMonth.code, selectedYear).map((day, idx) => {
                        return <td key={idx} style={{padding: 'unset', textAlign: 'center', color: 'gray'}}>
                            <strong>{totals[parseInt(idx) + 1]?.ausente}</strong>
                        </td>
                    })}
                </tr>
                <tr>
                    <td style={{padding: '10px', fontSize: '12px'}}>
                        <strong>Total</strong>
                    </td>
                    {getAllDaysInMonth(selectedMonth.code, selectedYear).map((day, idx) => {
                        return <td key={idx} style={{padding: 'unset', textAlign: 'center', color: 'gray'}}>
                            <strong>{totals[parseInt(idx) + 1]?.total}</strong>
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
                <Button className='my-2' label='Guardar asistencia' severity={'success'}
                        onClick={() => setEditMode(false)}/> :
                <Button className='my-2' label='Editar asistencia' severity={'info'} onClick={() => setEditMode(true)}/>
        )}
    </div>);
};

export default Historic;