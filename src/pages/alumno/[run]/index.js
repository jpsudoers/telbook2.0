import React, {useState, useContext, useRef} from 'react';
import Header from "@/components/commons/Header/Header";
import Container from "@/components/commons/Container/Container";
import {useRouter} from "next/router";
import Title from "@/components/commons/Title/Title";
import {Fieldset} from "primereact/fieldset";
import {capitalize} from "@/utils/formats";
import {InputTextarea} from "primereact/inputtextarea";
import {Button} from "primereact/button";
import StudentsContext from "@/context/students/Students.context";
import {Dialog} from "primereact/dialog";
import Loading from "@/components/commons/Loading/Loading";
import {Toast} from 'primereact/toast';

const Student = () => {
    const router = useRouter();
    const student = JSON.parse(router.query.student)
    const toast = useRef(null);

    const [observation, setObservation] = useState('')
    const [register, setRegister] = useState('')
    const [visibleObservation, setVisibleObservation] = useState(false)
    const [visibleRegister, setVisibleRegisters] = useState(false)

    const gradeName = {
        mm: 'Medio Mayor',
        pnt: 'Pre Kinder',
        '2nt': 'Kinder'
    }

    const {
        getObservationById,
        observations,
        observationsError,
        observationsLoading,
        schoolRegisters,
        schoolRegistersError,
        schoolRegistersLoading,
        getRegistersById,
        setObservationSchool,
        setSchoolRegister
    } = useContext(StudentsContext);

    const handleResponseObservation = () => {
        const date = new Date()
        const newData = {
            alumnoId: student.id,
            alumnoRun: student.run,
            evaluacion: observation,
            id: 'obs-' + student.curso.toLowerCase() + '-' + date.getTime(),
            publishedAt: date
        }
        setObservationSchool(newData)
        setObservation('')
        show()
    }

    const handleResponseRegister = () => {
        const date = new Date()
        const newData = {
            alumnoId: student.id,
            anotacion: register,
            id: 'reg-' + student.curso.toLowerCase() + '-' + date.getTime(),
            publishedAt: date
        }
        setSchoolRegister(newData)
        setRegister('')
        showRegister()
    }

    const handlerGetObservations = (id) => {
        setVisibleObservation(true)
        getObservationById(id)
    }

    const handlerGetSchoolRegisters = (id) => {
        setVisibleRegisters(true)
        getRegistersById(id)
    }

    const show = () => {
        toast.current.show({
            severity: 'success',
            summary: 'Obervación guardada',
            detail: 'La información fue guardada exitosamente'
        });
    };

    const showRegister = () => {
        toast.current.show({
            severity: 'success',
            summary: 'Registro guardado',
            detail: 'La información fue guardada exitosamente'
        });
    };

    return (
        <>
            <Header/>
            <Container>
                <Toast ref={toast} />
                <Title
                    title={gradeName[student.curso.toLowerCase().split('-')[1].slice(0, -1)] + ' - ' + 'Ficha de alumno'}/>
                <Button onClick={() => router.back()} label='<- Volver' link severity='info'/>
                <div className='flex'>
                    <Fieldset legend="Datos personales" className='flex-1'>
                        <p className="m-2">
                            <strong>Matrícula</strong>: {student.numeroMatricula}
                        </p>
                        <p className="m-2">
                            <strong>Nombre</strong>: {student.nombreCompleto}
                        </p>
                        <p className="m-2">
                            <strong>Run</strong>: {student.run}
                        </p>
                        <p className="m-2">
                            <strong>Tipo TEL</strong>: {capitalize(student.tipoTel)}
                        </p>
                    </Fieldset>
                    <Fieldset legend="Datos familiares" className='flex-1'>
                        <p className="m-2">
                            <strong>Vive Con</strong>: {student.viveCon}
                        </p>
                        <p className="m-2">
                            <strong>Nombre</strong>: {capitalize(student.nombreApoderado)}
                        </p>
                    </Fieldset>
                    <Fieldset legend="Datos demográficos" className='flex-1'>
                        <p className="m-2">
                            <strong>Nacionalidad</strong>: {student.nacionalidadAlumno}
                        </p>
                        <p className="m-2">
                            <strong>Domicilio</strong>: {capitalize(student.domicilio)}
                        </p>
                        <p className="m-2">
                            <strong>teléfono</strong>: {capitalize(student.telefono)}
                        </p>
                    </Fieldset>
                </div>
                <div className='flex gap-4 mt-3'>
                    <div className='flex-1'>
                        <p className="m-2">
                            <strong>Observaciones fonoaudiológicas</strong>
                        </p>
                        <InputTextarea
                            autoResize={true}
                            className='w-full mb-2'
                            rows={10}
                            value={observation}
                            onChange={(e) => setObservation(e.target.value)}
                        />
                        <Button severity='success' label='Guardar observación' className='mr-2'
                                onClick={handleResponseObservation}/>
                        <Button className='text-right' onClick={() => handlerGetObservations(student.run)}
                                severity='info' label='Ver observaciones'/>
                        <Dialog header="Observaciones" visible={visibleObservation} style={{width: '50vw'}}
                                onHide={() => setVisibleObservation(false)}>
                            <div className="m-0">
                                {observationsLoading ? <Loading/> :
                                    observations.map((observation, key) => {
                                        const dayName = observation.publishedAt.toDate().toLocaleDateString('es-CL', {
                                            weekday: 'long',
                                            timeZone: 'UTC'
                                        })
                                        const day = observation.publishedAt.toDate().getUTCDate()
                                        const year = observation.publishedAt.toDate().getFullYear()
                                        const monthName = observation.publishedAt.toDate().toLocaleDateString('es-CL', {month: 'long'})
                                        return <div key={key} className='mt-4'>
                                            <div>
                                                <strong>{dayName} {day} de {monthName} de {year}</strong>
                                            </div>
                                            <div className='mt-2'>
                                                {observation.evaluacion}
                                            </div>
                                        </div>
                                    })}
                            </div>
                        </Dialog>
                    </div>
                    <div className='flex-1'>
                        <p className="m-2">
                            <strong>Registro de convivencia escolar</strong>
                        </p>
                        <InputTextarea
                            autoResize={true}
                            className='w-full mb-2'
                            rows={10}
                            value={register}
                            onChange={(e) => setRegister(e.target.value)}
                        />
                        <Button severity='success' label='Guardar registro' className='mr-2'
                                onClick={handleResponseRegister}/>
                        <Button className='text-right' onClick={() => handlerGetSchoolRegisters(student.id)}
                                severity='info' label='Ver observaciones'/>
                        <Dialog header="Registros de convivencia escolar" visible={visibleRegister}
                                style={{width: '50vw'}}
                                onHide={() => setVisibleRegisters(false)}>
                            <div className="m-0">
                                {schoolRegistersLoading ? <Loading/> :
                                    schoolRegisters.map((register, key) => {
                                        const dayName = register.publishedAt.toDate().toLocaleDateString('es-CL', {
                                            weekday: 'long',
                                            timeZone: 'UTC'
                                        })
                                        const day = register.publishedAt.toDate().getUTCDate()
                                        const year = register.publishedAt.toDate().getFullYear()
                                        const monthName = register.publishedAt.toDate().toLocaleDateString('es-CL', {month: 'long'})
                                        return <div key={key} className='mt-4'>
                                            <div>
                                                <strong>{dayName} {day} de {monthName} de {year}</strong>
                                            </div>
                                            <div className='mt-2'>
                                                {register.anotacion}
                                            </div>
                                        </div>
                                    })}
                            </div>
                        </Dialog>
                    </div>

                </div>
            </Container>
        </>
    );
};

export default Student;