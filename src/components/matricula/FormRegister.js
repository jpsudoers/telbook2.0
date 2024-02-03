import React, {useContext, useRef} from 'react';
import {useFormik} from 'formik';
import {Dropdown} from 'primereact/dropdown';
import {Button} from 'primereact/button';
import {Toast} from 'primereact/toast';
import {InputText} from 'primereact/inputtext';
import UserContext from '@/context/user/User.context';
import StudentContext from '@/context/students/Students.context';
import 'primereact/resources/themes/bootstrap4-light-blue/theme.css';
import '/node_modules/primeflex/primeflex.css';
import {classNames} from 'primereact/utils';
import {Calendar} from 'primereact/calendar';
import validateForm, {initialValues} from '@/components/matricula/validation';
import {dateToFirebase} from "@/utils/formats";
import {regionsChile} from "@/utils/const";
import Loading from "@/components/commons/Loading/Loading";

const FormRegister = () => {
    const {
        grades,
        gradesLoading,
    } = useContext(UserContext);

    const {
        setStudent,
        students,
        studentsLoading,
    } = useContext(StudentContext);

    const {
        userLoading,
    } = useContext(UserContext);

    const toast = useRef(null);

    const show = () => {
        toast.current.show({severity: 'success', summary: 'Alumno matriculado'});
    };

    const formik = useFormik({
        initialValues: initialValues,
        validate: (data) => {
            return validateForm(data)
        },
        onSubmit: (data) => {
            const filterStudents = students.filter(student => student.grade === data.grade.codigo)
            const newData = {
                'alumnoPuebloOriginario': data.originalTown,
                'anio': 2024,
                'codigoAlumno': 1,
                'comuna': data.town,
                'curso': data.grade.codigo,
                'domicilio': data.address,
                'email': data.email,
                'fechaIncorporacion': dateToFirebase(data.join),
                'fechaNacimiento': dateToFirebase(data.birthday),
                'jornada': data.turn,
                'nacionalidadAlumno': data.nationality,
                'nivelEducacionalMadre': data.educationMother,
                'nivelEducacionalPadre': data.educationFather,
                'nombreApoderado': data.tutorName,
                'nombreCompleto': data.names + " " + data.lastnames,
                'nombresAlumno': data.names,
                'apellidosAlumno': data.lastnames,
                'numeroLista': filterStudents.length + 1,
                'numeroMatricula': students.length + 1,
                'parentezcoConAlumno': data.parent,
                'problemasDeAprendizaje': data.learnIssue,
                'procedencia': data.origin,
                'region': data.region,
                'run': data.run,
                'sexo': data.gender,
                'situacionSocial': data.social,
                'telefono': data.phone,
                'tipoTel': data.tel,
                'viveCon': data.live
            }
            setStudent(newData)
            data && show(data);
            formik.resetForm();
        }
    });

    const isFormFieldInvalid = (name) => {
        return !!(formik.touched[name] && formik.errors[name]);
    }

    const getFormErrorMessage = (name) => {
        return isFormFieldInvalid(name) && <span className='p-error'>{formik.errors[name]}</span>;
    };

    if (studentsLoading || gradesLoading || userLoading) {
        return <Loading/>
    }

    return (
        <form onSubmit={formik.handleSubmit}>
            <Toast ref={toast}/>
            <div className='formgrid grid'>
                <div className='field col'>
                    <div className='flex-auto mb-4'>
                        <label htmlFor='grade' className='font-bold block mb-2'>Curso</label>
                        <div className='p-inputgroup w-full'>
                            <Dropdown
                                inputId='grade'
                                name='grade'
                                value={formik.values.grade}
                                options={grades}
                                optionLabel='codigo'
                                placeholder='Seleccionar curso'
                                className={classNames({'p-invalid': isFormFieldInvalid('grade')})}
                                onChange={(e) => {
                                    formik.setFieldValue('grade', e.value);
                                }}
                            />
                        </div>
                        {getFormErrorMessage('grade')}
                    </div>
                    <div className='flex-auto mb-4'>
                        <label htmlFor='names' className='font-bold block mb-2'>Nombres</label>
                        <div className='p-inputgroup w-full'>
                            <InputText
                                id='names'
                                name='names'
                                value={formik.values.names}
                                onChange={(e) => {
                                    formik.setFieldValue('names', e.target.value);
                                }}
                                placeholder='Nombres del alumno'
                                className={classNames({'p-invalid': isFormFieldInvalid('names')})}
                            />
                        </div>
                        {getFormErrorMessage('names')}
                    </div>
                    <div className='flex-auto mb-4'>
                        <label htmlFor='names' className='font-bold block mb-2'>Apellidos</label>
                        <div className='p-inputgroup w-full'>
                            <InputText
                                id='lastnames'
                                name='lastnames'
                                value={formik.values.lastnames}
                                onChange={(e) => {
                                    formik.setFieldValue('lastnames', e.target.value);
                                }}
                                placeholder='Apellidos del alumno'
                                className={classNames({'p-invalid': isFormFieldInvalid('lastnames')})}
                            />
                        </div>
                        {getFormErrorMessage('lastnames')}
                    </div>
                    <div className='flex-auto mb-4'>
                        <label htmlFor='names' className='font-bold block mb-2'>RUN</label>
                        <div className='p-inputgroup w-full'>
                            <InputText
                                id='run'
                                name='run'
                                value={formik.values.run}
                                onChange={(e) => {
                                    formik.setFieldValue('run', e.target.value);
                                }}
                                placeholder='RUN del alumno'
                                className={classNames({'p-invalid': isFormFieldInvalid('run')})}
                            />
                        </div>
                        {getFormErrorMessage('run')}
                    </div>
                    <div className='flex-auto mb-4'>
                        <label htmlFor='birthday' className='font-bold block mb-2'>Fecha de nacimiento</label>
                        <div className='p-inputgroup w-full'>
                            <Calendar dateFormat='dd/mm/yy' id='select-birthday' name='birthday'
                                      value={formik.values.birthday}
                                      placeholder='Ingresar fecha de nacimiento'
                                      className={classNames({'p-invalid': isFormFieldInvalid('birthday')})}
                                      onChange={(e) => {
                                          formik.setFieldValue('birthday', e.target.value);
                                      }}
                                      style={{width: '272px'}}
                                      locale='es' showIcon/>
                        </div>
                        {getFormErrorMessage('birthday')}
                    </div>
                    <div className='flex-auto mb-4'>
                        <label htmlFor='join' className='font-bold block mb-2'>Fecha de incorporación</label>
                        <div className='p-inputgroup w-full'>
                            <Calendar dateFormat='dd/mm/yy' id='select-join' name='join'
                                      value={formik.values.join}
                                      placeholder='Ingresar fecha de incorporación'
                                      className={classNames({'p-invalid': isFormFieldInvalid('join')})}
                                      onChange={(e) => {
                                          formik.setFieldValue('join', e.target.value);
                                      }}
                                      style={{width: '272px'}}
                                      locale='es' showIcon/>
                        </div>
                        {getFormErrorMessage('join')}
                    </div>
                    <div className='flex-auto mb-4'>
                        <label htmlFor='gender' className='font-bold block mb-2'>Género</label>
                        <div className='p-inputgroup w-full'>
                            <Dropdown
                                inputId='gender'
                                name='gender'
                                value={formik.values.gender}
                                options={['Masculino', 'Femenino', 'No quiero contestar']}
                                placeholder='Seleccionar género'
                                className={classNames({'p-invalid': isFormFieldInvalid('gender')})}
                                onChange={(e) => {
                                    formik.setFieldValue('gender', e.value);
                                }}
                            />
                        </div>
                        {getFormErrorMessage('gender')}
                    </div>
                    <div className='flex-auto mb-4'>
                        <label htmlFor='address' className='font-bold block mb-2'>Domicilio</label>
                        <div className='p-inputgroup w-full'>
                            <InputText
                                id='address'
                                name='address'
                                value={formik.values.address}
                                onChange={(e) => {
                                    formik.setFieldValue('address', e.target.value);
                                }}
                                placeholder='Dirección del alumno'
                                className={classNames({'p-invalid': isFormFieldInvalid('address')})}
                            />
                        </div>
                        {getFormErrorMessage('address')}
                    </div>
                    <div className='flex-auto mb-4'>
                        <label htmlFor='region' className='font-bold block mb-2'>Región</label>
                        <div className='p-inputgroup w-full'>
                            <Dropdown
                                inputId='region'
                                name='region'
                                value={formik.values.region}
                                options={regionsChile}
                                placeholder='Seleccionar región'
                                className={classNames({'p-invalid': isFormFieldInvalid('region')})}
                                onChange={(e) => {
                                    formik.setFieldValue('region', e.value);
                                }}
                            />
                        </div>
                        {getFormErrorMessage('region')}
                    </div>
                    <div className='flex-auto mb-4'>
                        <label htmlFor='nationality' className='font-bold block mb-2'>Nacionalidad</label>
                        <div className='p-inputgroup w-full'>
                            <InputText
                                id='nationality'
                                name='nationality'
                                value={formik.values.nationality}
                                onChange={(e) => {
                                    formik.setFieldValue('nationality', e.target.value);
                                }}
                                placeholder='Nacionalidad del alumno'
                                className={classNames({'p-invalid': isFormFieldInvalid('nationality')})}
                            />
                        </div>
                        {getFormErrorMessage('nationality')}
                    </div>
                    <div className='flex-auto mb-4'>
                        <label htmlFor='town' className='font-bold block mb-2'>Comuna</label>
                        <div className='p-inputgroup w-full'>
                            <InputText
                                id='town'
                                name='town'
                                value={formik.values.town}
                                onChange={(e) => {
                                    formik.setFieldValue('town', e.target.value);
                                }}
                                placeholder='Comuna del alumno'
                                className={classNames({'p-invalid': isFormFieldInvalid('town')})}
                            />
                        </div>
                        {getFormErrorMessage('town')}
                    </div>
                    <div className='flex-auto mb-4'>
                        <label htmlFor='originalTown' className='font-bold block mb-2'>Pertenece a pueblo
                            originario</label>
                        <div className='p-inputgroup w-full'>
                            <Dropdown
                                inputId='originalTown'
                                name='originalTown'
                                value={formik.values.originalTown}
                                options={['Si', 'No']}
                                placeholder='Seleccionar si pertenece a pueblo originario'
                                className={classNames({'p-invalid': isFormFieldInvalid('originalTown')})}
                                onChange={(e) => {
                                    formik.setFieldValue('originalTown', e.value);
                                }}
                            />
                        </div>
                        {getFormErrorMessage('originalTown')}
                    </div>
                </div>
                <div className='field col'>
                    <div className='flex-auto mb-4'>
                        <label htmlFor='tutorName' className='font-bold block mb-2'>Nombre completo apoderado</label>
                        <div className='p-inputgroup w-full'>
                            <InputText
                                id='tutorName'
                                name='tutorName'
                                value={formik.values.tutorName}
                                onChange={(e) => {
                                    formik.setFieldValue('tutorName', e.target.value);
                                }}
                                placeholder='Nombre completo apoderado'
                                className={classNames({'p-invalid': isFormFieldInvalid('tutorName')})}
                            />
                        </div>
                        {getFormErrorMessage('tutorName')}
                    </div>
                    <div className='flex-auto mb-4'>
                        <label htmlFor='parent' className='font-bold block mb-2'>Parentesco</label>
                        <div className='p-inputgroup w-full'>
                            <Dropdown
                                inputId='parent'
                                name='parent'
                                value={formik.values.parent}
                                options={['Madre', 'Padre', 'Tutor']}
                                placeholder='Parentesco del apoderado con el alumno'
                                className={classNames({'p-invalid': isFormFieldInvalid('parent')})}
                                onChange={(e) => {
                                    formik.setFieldValue('parent', e.value);
                                }}
                            />
                        </div>
                        {getFormErrorMessage('parent')}
                    </div>
                    <div className='flex-auto mb-4'>
                        <label htmlFor='email' className='font-bold block mb-2'>Correo electrónico</label>
                        <div className='p-inputgroup w-full'>
                            <InputText
                                id='email'
                                name='email'
                                value={formik.values.email}
                                onChange={(e) => {
                                    formik.setFieldValue('email', e.target.value);
                                }}
                                placeholder='Ingrese correo electrónico'
                                className={classNames({'p-invalid': isFormFieldInvalid('email')})}
                            />
                        </div>
                        {getFormErrorMessage('email')}
                    </div>
                    <div className='flex-auto mb-4'>
                        <label htmlFor='phone' className='font-bold block mb-2'>Teléfono</label>
                        <div className='p-inputgroup w-full'>
                            <InputText
                                id='phone'
                                name='phone'
                                value={formik.values.phone}
                                onChange={(e) => {
                                    formik.setFieldValue('phone', e.target.value);
                                }}
                                placeholder='Ingrese teléfono'
                                className={classNames({'p-invalid': isFormFieldInvalid('phone')})}
                            />
                        </div>
                        {getFormErrorMessage('phone')}
                    </div>
                    <div className='flex-auto mb-4'>
                        <label htmlFor='educationMother' className='font-bold block mb-2'>Nivel educacional de la
                            madre</label>
                        <div className='p-inputgroup w-full'>
                            <Dropdown
                                inputId='educationMother'
                                name='educationMother'
                                value={formik.values.educationMother}
                                options={[
                                    'BÁSICA COMPLETA',
                                    'BÁSICA INCOMPLETA',
                                    'MEDIA COMPLETA',
                                    'MEDIA INCOMPLETA',
                                    'TÉCNICO PROFESIONAL COMPLETA',
                                    'TÉCNICO PROFESIONAL INCOMPLETA',
                                    'UNIVERSITARIA COMPLETA',
                                    'UNIVERSITARIA INCOMPLETA'
                                ]}
                                placeholder='Seleccionar nivel educacional de la madre'
                                className={classNames({'p-invalid': isFormFieldInvalid('educationMother')})}
                                onChange={(e) => {
                                    formik.setFieldValue('educationMother', e.value);
                                }}
                            />
                        </div>
                        {getFormErrorMessage('educationMother')}
                    </div>
                    <div className='flex-auto mb-4'>
                        <label htmlFor='educationFather' className='font-bold block mb-2'>Nivel educacional del
                            padre</label>
                        <div className='p-inputgroup w-full'>
                            <Dropdown
                                inputId='educationFather'
                                name='educationFather'
                                value={formik.values.educationFather}
                                options={[
                                    'BÁSICA COMPLETA',
                                    'BÁSICA INCOMPLETA',
                                    'MEDIA COMPLETA',
                                    'MEDIA INCOMPLETA',
                                    'TÉCNICO PROFESIONAL COMPLETA',
                                    'TÉCNICO PROFESIONAL INCOMPLETA',
                                    'UNIVERSITARIA COMPLETA',
                                    'UNIVERSITARIA INCOMPLETA'
                                ]}
                                placeholder='Seleccionar nivel educacional del padre'
                                className={classNames({'p-invalid': isFormFieldInvalid('educationFather')})}
                                onChange={(e) => {
                                    formik.setFieldValue('educationFather', e.value);
                                }}
                            />
                        </div>
                        {getFormErrorMessage('educationFather')}
                    </div>
                    <div className='flex-auto mb-4'>
                        <label htmlFor='turn' className='font-bold block mb-2'>Jornada</label>
                        <div className='p-inputgroup w-full'>
                            <Dropdown
                                inputId='turn'
                                name='turn'
                                value={formik.values.turn}
                                options={[
                                    'MAÑANA',
                                    'TARDE'
                                ]}
                                placeholder='Seleccionar jornada educacional'
                                className={classNames({'p-invalid': isFormFieldInvalid('turn')})}
                                onChange={(e) => {
                                    formik.setFieldValue('turn', e.value);
                                }}
                            />
                        </div>
                        {getFormErrorMessage('turn')}
                    </div>
                    <div className='flex-auto mb-4'>
                        <label htmlFor='origin' className='font-bold block mb-2'>Procedencia</label>
                        <div className='p-inputgroup w-full'>
                            <Dropdown
                                inputId='origin'
                                name='origin'
                                value={formik.values.origin}
                                options={[
                                    'Continuidad',
                                    'Ingreso nuevo'
                                ]}
                                placeholder='Seleccionar procedencia'
                                className={classNames({'p-invalid': isFormFieldInvalid('origin')})}
                                onChange={(e) => {
                                    formik.setFieldValue('origin', e.value);
                                }}
                            />
                        </div>
                        {getFormErrorMessage('origin')}
                    </div>
                    <div className='flex-auto mb-4'>
                        <label htmlFor='educationFather' className='font-bold block mb-2'>Tipo TEL</label>
                        <div className='p-inputgroup w-full'>
                            <Dropdown
                                inputId='tel'
                                name='tel'
                                value={formik.values.tel}
                                options={[
                                    'TEL MIXTO',
                                    'TEL EXPRESIVO'
                                ]}
                                placeholder='Seleccionar Tipo TEL'
                                className={classNames({'p-invalid': isFormFieldInvalid('tel')})}
                                onChange={(e) => {
                                    formik.setFieldValue('tel', e.value);
                                }}
                            />
                        </div>
                        {getFormErrorMessage('tel')}
                    </div>
                    <div className='flex-auto mb-4'>
                        <label htmlFor='learnIssue' className='font-bold block mb-2'>Problemas de aprendizaje</label>
                        <div className='p-inputgroup w-full'>
                            <Dropdown
                                inputId='learnIssue'
                                name='learnIssue'
                                value={formik.values.learnIssue}
                                options={['Si', 'No']}
                                placeholder='Seleccionar si alumno tiene problemas de aprendizaje'
                                className={classNames({'p-invalid': isFormFieldInvalid('learnIssue')})}
                                onChange={(e) => {
                                    formik.setFieldValue('learnIssue', e.value);
                                }}
                            />
                        </div>
                        {getFormErrorMessage('learnIssue')}
                    </div>
                    <div className='flex-auto mb-4'>
                        <label htmlFor='live' className='font-bold block mb-2'>Vive con</label>
                        <div className='p-inputgroup w-full'>
                            <Dropdown
                                inputId='live'
                                name='live'
                                value={formik.values.live}
                                options={['Ambos padres', 'Madre', 'Padre', 'Tutor']}
                                placeholder='Seleccionar con quien vive el alumno'
                                className={classNames({'p-invalid': isFormFieldInvalid('live')})}
                                onChange={(e) => {
                                    formik.setFieldValue('live', e.value);
                                }}
                            />
                        </div>
                        {getFormErrorMessage('live')}
                    </div>
                    <div className='flex-auto mb-4'>
                        <label htmlFor='social' className='font-bold block mb-2'>Situación social</label>
                        <div className='p-inputgroup w-full'>
                            <Dropdown
                                inputId='social'
                                name='social'
                                value={formik.values.social}
                                options={['Priotitario', 'Preferente']}
                                placeholder='Seleccionar si alumno es preferente o prioritario'
                                className={classNames({'p-invalid': isFormFieldInvalid('social')})}
                                onChange={(e) => {
                                    formik.setFieldValue('social', e.value);
                                }}
                            />
                        </div>
                        {getFormErrorMessage('social')}
                    </div>
                </div>
            </div>
            <Button className='mb-4' severity='success' type='submit' label='Matricular alumno'/>
        </form>
    );
};

export default FormRegister;