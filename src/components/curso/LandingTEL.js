import React, {useEffect, useState, useContext} from 'react';
import {useFormik} from 'formik';
import {MultiSelect} from 'primereact/multiselect';
import {Button} from 'primereact/button';
import {Dropdown} from 'primereact/dropdown';
import {classNames} from 'primereact/utils';
import UserContext from "@/context/user/User.context";
import {useRouter} from "next/router";
import {unique} from "@/utils/formats";
import Loading from "@/components/commons/Loading/Loading";
import {modeSpeech} from "@/utils/const";
import StudentsContext from "@/context/students/Students.context";
import {InputTextarea} from "primereact/inputtextarea";
import PreviewTel from "@/components/curso/tel/PreviewTel";
import GetTel from "@/components/curso/tel/GetTel";
import PlanningContext from "@/context/planning/Planning.context";
import { set } from '@firebase/database';
import {Column} from 'primereact/column';

const LandingTEL = () => {
    const [selectAmbit, setSelectAmbit] = useState(null);

    const router = useRouter();
    const {grade} = router.query;
    const level = grade.split('-')[1].slice(0, -1)
    const {
        getSpeechBases,
        speechBases,
        speechBasesLoading,
        speechBasesError,
        user,
        //Add OTP
        otp,
    } = useContext(UserContext);

    const {
        getRegisters,
        setRegister,
        registersLoading,
        lectionariesError,
    } = useContext(PlanningContext);

    const {
        students,
    } = useContext(StudentsContext);

   // const filterStudents = students.filter(student =>{ student.grade === grade.toUpperCase() && student.state === "Activo"})

    const filterStudents = students.filter(student => student.grade === grade.toUpperCase() && student.state === "Activo")
    
     // JPS ordeno los estudiantes por nombre
    filterStudents.sort((a, b) => a.name?.localeCompare(b.name));

    
    

    const ambit = unique(speechBases.map(base => {
        return base.ambito
    }));

    const content = unique(speechBases.filter(base => {
        return base.ambito === selectAmbit
    }).map(base => base.contenido));

    useEffect(() => {
        if (speechBases.length === 0) {
            getSpeechBases(level.toUpperCase())
        }
    }, [grade])

    const formik = useFormik({
        initialValues: {
            mode: '',
            ambit: '',
            content: '',
            studentsSpeech: [],
            register: '',
            otp: ''
        },
        validate: (data) => {
            let errors = {};

            if (!addedOas || addedOas.length === 0) {
                errors.mode = 'D';
            }

            //JPS agrego validación al registro y Clave OTP
            if (!data.register || data.register.length === 0) {
                errors.register = 'El registro es obligatorio';
            }
            
            if (!data.otp || data.otp.length === 0) {
                errors.otp = 'La clave GOB es obligatoria';
            }
            return errors;
        },
        onSubmit: (data) => {
            if (Object.values(formik.errors).length === 0) {
                const id = new Date()
                const newData = {
                    id: 'reg-fono-' + grade + "-" + id.getTime(),
                    contenidosTel: addedOas,
                    curso: grade.toUpperCase(),
                    publishedAt: id,
                    observaciones: data.register,
                    usuario: user,
               //JPS agrego OTP para guardar en base de datos
                    opt: data.otp

                }
                setRegister(newData)
                getRegisters(grade.toUpperCase())
                setAddedOas([])
                formik.resetForm();
            }
        }
    });

    const isFormFieldInvalid = (name) => !!(formik.touched[name] && formik.errors[name]);

    const getFormErrorMessage = (name) => {
        return isFormFieldInvalid(name) ? <small className="p-error">{formik.errors[name]}<br/></small> :
            <small className="p-error"/>;
    };




// REFACTOR
const [addedOas, setAddedOas] = useState([]);
const addOa = () => {
    const currentOas = {}
    currentOas['modalidad'] = formik.values.mode
    currentOas['alumnos'] = formik.values.studentsSpeech.map(student => {
        return {alumnoSeleccionado: student.name}
    })
    currentOas['contenidos'] = formik.values.content.map(content => {
        return {
            "contenido": {
                "ambito": formik.values.ambit,
                "contenido": content,
            },
        }
    })
    formik.values.mode = ''
    formik.values.studentsSpeech = []
    formik.values.content = []
    formik.values.ambit = ''
    setAddedOas(addedOas.concat(currentOas))
}
const removeOa = (oa) => {
    const newOas = addedOas.filter((item, index) => {
        return index !== oa
    })
    setAddedOas(newOas)
}
// REFACTOR




    if (speechBasesLoading) {
        return <Loading/>
    }

    return (
        <form onSubmit={formik.handleSubmit}>
            <div className="flex gap-5">
                <div className="">
                    <div className="flex-auto mb-4">
                        <label htmlFor="mode" className="font-bold block mb-2">Modalidad</label>
                        <div className='p-inputgroup w-full'>
                            <Dropdown
                                inputId="mode"
                                name="mode"
                                value={formik.values.mode}
                                options={modeSpeech}
                                placeholder="Selecciona una modalidad"
                                className={classNames({'p-invalid': isFormFieldInvalid('mode')})}
                                onChange={(e) => {
                                    formik.setFieldValue('mode', e.value);
                                }}
                            />
                        </div>
                    </div>
                    <div className="flex-auto mb-4">
                        <label htmlFor="studentsSpeech" className="font-bold block mb-2">Seleccionar alumnos</label>
                        <div className='p-inputgroup w-full'>
                            <MultiSelect
                                id="studentsSpeech"
                                name="studentsSpeech"
                                options={filterStudents}
                                value={formik.values.studentsSpeech}
                                emptyMessage='No existen alumnos matriculados para este curso'
                                onChange={(e) => {
                                    formik.setFieldValue('studentsSpeech', e.value);
                                }}
                                optionLabel='name'
                                placeholder="Seleccionar alumnos"
                                maxSelectedLabels={0}
                                selectedItemsLabel={'{0} Alumnos seleccionados'}
                                className={classNames({'p-invalid': isFormFieldInvalid('studentsSpeech')})}
                            />
                        </div>
                    </div>
                    <div className="flex-auto mb-4">
                        <label htmlFor="ambit" className="font-bold block mb-2">Niveles fonoaudiológicos</label>
                        <div className='p-inputgroup w-full'>
                            <Dropdown
                                inputId="ambit"
                                name="ambit"
                                value={formik.values.ambit}
                                options={ambit}
                                placeholder="Selecciona un nivel"
                                className={classNames({'p-invalid': isFormFieldInvalid('ambit')})}
                                onChange={(e) => {
                                    setSelectAmbit(e.value)
                                    formik.setFieldValue('ambit', e.value);
                                }}
                            />
                        </div>
                    </div>
                    <div className="flex-auto mb-4">
                        <label htmlFor="content" className="font-bold block mb-2">Contenido</label>
                        <div className='p-inputgroup w-full'>
                            
                            <MultiSelect
                                inputId="content"
                                name="content"
                                value={formik.values.content}
                                options={content}
                                emptyMessage={'Debes seleccionar un nivel primero'}
                               
                                 //JPS se agrega filtro en contenido.   
                                //placeholder="Seleccionar contenido"

                                filter placeholder="Seleccionar contenido"
                                className={classNames({'p-invalid': isFormFieldInvalid('content')})}
                                selectedItemsLabel={'{0} Contenidos seleccionados'}
                                maxSelectedLabels={0}
                                                                               
                                onChange={(e) => {
                                    // setSelectAmbit(e.value)
                                    formik.setFieldValue('content', e.value);
                                  
                                }}
                            />
                           
                        </div>
                    </div>




                    {/* REFACTOR */}
                    <Button
                        type='button'
                        label='Añadir'
                        severity='success'
                        className='w-full mb-4'
                        onClick={() => addOa()}
                        disabled={
                            formik.values.mode === '' ||
                            formik.values.ambit === '' ||
                            formik.values.studentsSpeech.length === 0 ||
                            formik.values.content.length === 0
                        }
                    />
                    {/* REFACTOR */}




                    <div className="flex-auto mb-4">
                        <label htmlFor="register" className="font-bold block mb-2">Registro / Observaciones</label>
                        <div className='p-inputgroup w-full'>
                            <InputTextarea
                                id="register"
                                name="register"
                                value={formik.values.register}
                                onChange={(e) => {
                                    formik.setFieldValue('register', e.target.value);
                                }}
                                placeholder="Ingresar registros u observaciones"
                                className={classNames({'p-invalid': isFormFieldInvalid('register')})}
                            />
                        </div>
                    </div>
                    <div className="flex-auto mb-4">
                        <label htmlFor="otp" className="font-bold block mb-2">Clave GOB</label>
                        <div className='p-inputgroup w-full'>
                            <InputTextarea
                                id="otp"
                                name="otp"
                                value={formik.values.otp}
                                onChange={(e) => {
                                    formik.setFieldValue('otp', e.target.value);
                                }}
                                placeholder="Ingrese clave de GOB para firmar el registro fonoaudiológico"
                                className={classNames({'p-invalid': isFormFieldInvalid('otp')})}
                            />
                        </div>
                    </div>

                    {getFormErrorMessage('mode')}
                    {getFormErrorMessage('studentsSpeech')}
                    {getFormErrorMessage('ambit')}
                    {getFormErrorMessage('content')}
                    {getFormErrorMessage('register')}
                    <Button type='submit' label='Guardar registro fonoaudiológico' severity='success'
                            style={{width: '100%'}}/>
                </div>
                <div className="flex-auto">
                    {/* lista de evaluaciones existentes */}
                    <PreviewTel addedOas={addedOas} removeOa={removeOa}/>
                    <GetTel grade={grade}/>
                    
                </div>
            </div>
        </form>

    )
};

export default LandingTEL;