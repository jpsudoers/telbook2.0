import React, {useRef, useState, useContext, useEffect} from "react";
import {useFormik} from 'formik';
import {SelectButton} from 'primereact/selectbutton';
import {Button} from 'primereact/button';
import {InputTextarea} from 'primereact/inputtextarea';
import {Toast} from 'primereact/toast';
import {InputText} from "primereact/inputtext";
import {classNames} from "primereact/utils";
import StudentsContext from "@/context/students/Students.context";
import Loading from "@/components/commons/Loading/Loading";

export default function Current({students, grade, user}) {
    const toast = useRef(null);
    const [presents, setPresents] = useState(0);
    const [absentees, setAbsentees] = useState(0);
    const [error, setError] = useState(false);
    const options = ['Presente', 'Ausente'];

    const {
        setAttendance,
        attendances,
        attendancesError,
        attendancesLoading,
        getAttendanceByDate,
        attendance,
        attendanceLoading,
        attendanceError,
    } = useContext(StudentsContext);

    console.log(attendance)

    useEffect(() => {
        if (attendance.length === 0) {
            getAttendanceByDate(grade.toUpperCase())
        }
    }, [grade])

    const show = () => {
        toast.current.show({
            severity: 'success',
            summary: 'Asistencia regitrada',
            detail: `Registrados ${presents + absentees} alumnos`
        });
    };

    const obj = students.reduce((o, key) => ({...o, [key.run.split('.').join("")]: {day: null, comments: ''}}), {})
    const formik = useFormik({
        initialValues: {...obj, otp: ''},
        validate: (data) => {
            let errors = {};
            const objVal = Object.values(data)
            setPresents(objVal.filter(p => p.day === 'Presente').length)
            setAbsentees(objVal.filter(p => p.day === 'Ausente').length)
            if (data.otp === '') {
                errors.otp = 'OTP obligatorio'
            }
            if (presents + absentees !== objVal.length - 1) {
                setError(true)
                errors.item = 'Todos los campos son requeridos';
            } else {
                setError(false)
                delete errors.item;
            }
            return errors;
        },
        onSubmit: (data) => {
            const alumnos = Object.keys(data).filter(item => item !== 'otp').map(item => {
                return {
                    run: item,
                    comentario: data[item].comments,
                    presente: data[item].day === 'Presente' ? 1 : 0
                }
            })
            const date = new Date();
            date.setHours(0, 0, 0, 0)
            const dataToSend = {
                alumnos,
                curso: grade.toUpperCase(),
                id: 'asis-' + grade + '-' + date.getTime(),
                run: user.run,
                updated: [],
                publishedAt: date
            }
            setAttendance(dataToSend)
            setAbsentees(0)
            setPresents(0)
            data && show();
            formik.resetForm();
            getAttendanceByDate(grade.toUpperCase())
        }
    });

    const isFormFieldInvalid = (name) => !!(formik.touched[name] && formik.errors[name]);

    const getFormErrorMessage = (name) => {
        return isFormFieldInvalid(name) ? <small className="p-error">{formik.errors[name]}<br/></small> :
            <small className="p-error"/>;
    };

    if (attendancesLoading || attendanceLoading) {
        return <Loading/>
    }

    if (attendance.length > 0) {
        return <div>
            Ya se registró la lista del día de hoy. Para ver el detalle ir a Asistencia Histórica
        </div>
    }

    return (
        <div className="p-datatable p-component p-datatable-responsive-scroll"
             data-scrollselectors=".p-datatable-wrapper" data-pc-name="datatable" data-pc-section="root">
            <Toast ref={toast}/>
            <form onSubmit={formik.handleSubmit} className="flex flex-column align-items-center gap-2">
                <table className='p-datatable-table' role="table" data-pc-section="table">
                    <tbody className='p-datatable-tbody'>
                    {students.map((student, index) => {
                        return <tr key={index}>
                            <td>{student.name}</td>
                            <td>
                                <SelectButton
                                    id='item'
                                    name={student.run.split('.').join("")}
                                    value={formik.values[student.run.split('.').join('')].day}
                                    options={options}
                                    onChange={(e) => {
                                        formik.setFieldValue(student.run.split('.').join(''), {
                                            ...formik.values[student.run.split('.').join('')],
                                            day: e.value
                                        });
                                    }}
                                />
                            </td>
                            <td>
                                <InputTextarea
                                    style={{width: '100%', resize: 'none'}}
                                    value={formik.values[student.run.split('.').join('')].comments}
                                    onChange={(e) => {
                                        formik.setFieldValue(student.run.split('.').join(''), {
                                            ...formik.values[student.run.split('.').join('')],
                                            comments: e.target.value
                                        });
                                    }}
                                    rows={1}
                                    cols={50}/>
                            </td>
                        </tr>
                    })}
                    <tr>
                        <td>
                            <strong>Presentes: {presents}</strong> <br/>
                            <strong>Ausentes: {absentees}</strong>
                        </td>
                        <td>
                            <InputText
                                id='otp'
                                name='otp'
                                type='password'
                                keyfilter="int"
                                className={classNames({'p-invalid': isFormFieldInvalid('otp')})}
                                value={formik.values.otp}
                                placeholder='Ingresar OTP'
                                onChange={(e) => {
                                    formik.setFieldValue('otp', e.target.value);
                                }}/>
                            {getFormErrorMessage('week')}
                        </td>
                        <td style={{textAlign: 'right'}}>
                            <Button label="Firmar libro" style={{margin: '10px'}} severity='success' type="submit"
                                    icon="pi pi-check"/>
                        </td>
                    </tr>
                    </tbody>
                </table>
                {error && <small className="p-error">Todos los campos son requeridos</small>}
            </form>
        </div>


    )
}
        