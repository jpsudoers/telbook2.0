import React, {useState, useContext, useEffect} from 'react';
import {Fieldset} from 'primereact/fieldset';
import {Calendar} from 'primereact/calendar';
import {Divider} from 'primereact/divider';
import {SelectButton} from 'primereact/selectbutton';
import {InputTextarea} from 'primereact/inputtextarea';
import {Button} from 'primereact/button'
import {Dialog} from 'primereact/dialog';
import {useRouter} from "next/router";
import Loading from "@/components/commons/Loading/Loading";

import 'primereact/resources/themes/bootstrap4-light-blue/theme.css';
import '/node_modules/primeflex/primeflex.css';
import "primereact/resources/primereact.min.css";
import {InputText} from "primereact/inputtext";
import PlanningContext from "@/context/planning/Planning.context";
import {capitalize, dateToFirebaseWithSlash} from "@/utils/formats";
import UserContext from "@/context/user/User.context";

const LandingPlanningLectionary = () => {
    const router = useRouter();
    const {grade} = router.query;
    const [date, setDate] = useState(new Date())
    const [evaluation, setEvaluation] = useState(null)
    const [comment, setComment] = useState('')
    const [visible, setVisible] = useState(false);
    const [otp, setOtp] = useState('');

    const {
        user,
    } = useContext(UserContext);

    const {
        getPlanningShortByDate,
        planningShortsLectionary,
        planningShortsLectionaryLoading,
        planningShortsLectionaryError,
        setPlanningLectionary,
        getLectionaryById
    } = useContext(PlanningContext);

    const getPlanning = (d) => {
        const dateFormat = dateToFirebaseWithSlash(d)
        getPlanningShortByDate(grade.toUpperCase(), dateFormat)
    }

    const submit = (id) => {
        const currentDate = new Date()
        const newData = {
            id: 'lec-' + grade.toUpperCase() + '-' + currentDate.getTime(),
            comentario: comment,
            curso: grade.toUpperCase(),
            evaluacion: evaluation === 'Positiva' ? 'positiva' : 'negativa',
            hora: date,
            publishedAt: currentDate,
            planificacionId: id,
            usuario: user.run
        }
        setEvaluation(null)
        setComment('')
        setOtp('');
        setPlanningLectionary(newData)
        const dateFormat = dateToFirebaseWithSlash(date)
        getPlanningShortByDate(grade.toUpperCase(), dateFormat)
    }

    if (planningShortsLectionaryLoading) {
        return <Loading/>
    }

    const onHide = () => {
        setVisible(false)
        setOtp('')
    }

    const onSuccess = (id) => {
        setVisible(false)
        submit(id)
    }
    return (
        <div style={{padding: '15px'}}>
            <label htmlFor='select-date'
                   style={{fontWeight: 'bold', display: 'block', marginBottom: '10px'}}>
                Seleccionar fecha
            </label>
            <Calendar dateFormat='dd/mm/yy' id='select-date' name='date'
                      value={date}
                      onChange={(e) => {
                          setDate(e.target.value)
                          getPlanning(e.target.value)
                      }}
                      style={{width: '272px'}}
                      locale='es' showIcon/>
            <div className='mt-3'>
                {
                    Object.keys(planningShortsLectionary) && Object.keys(planningShortsLectionary).length === 0 &&
                    <p>No existen planificaciones </p>
                }
                {
                    Object.keys(planningShortsLectionary) && Object.keys(planningShortsLectionary).map((id, idx) => {
                        const planning = planningShortsLectionary[id];
                        return <Fieldset key={idx} legend={date.toLocaleDateString('es-CL')} className='mb-3'>
                            <strong className="m-0">Inicio, desarrollo y cierre</strong>
                            <p className="mt-1">
                                {planning.inicio}
                            </p>
                            <Divider type="solid"/>
                            <strong className="m-0">Objetivos de aprendizaje</strong>
                            {planning.estrategias && planning.estrategias.map((est, key) => {
                                return <p key={key} className="mt-1">
                                    {est.nucleoSeleccionado} <br/>
                                    {est.oaSeleccionado}
                                </p>
                            })}
                            <Divider type="solid"/>
                            {
                                planning.evaluacion === 'positiva' || planning.evaluacion === 'negativa' ?
                                    <div>
                                        <p><strong>Esta experiencia ya ha sido evaluado como</strong></p>
                                        <SelectButton
                                            id='item'
                                            name='evaluation'
                                            value={capitalize(planning.evaluacion)}
                                            disabled={true}
                                            options={['Positiva', 'Negativa']}
                                        />
                                        <p><strong>Observación: </strong>{planning.observacion}</p>
                                    </div> :
                                    <>
                                        <div className="m-0 mb-1"><strong>Evaluar experiencia de aprendizaje</strong></div>
                                        <SelectButton
                                            id='item'
                                            name='evaluation'
                                            value={evaluation}
                                            options={['Positiva', 'Negativa']}
                                            onChange={(e) => {
                                                setEvaluation(e.value)
                                            }}
                                        />
                                        <InputTextarea
                                            className='mt-1'
                                            style={{resize: 'none', marginBottom: '20px'}}
                                            rows={4}
                                            cols={40}
                                            value={comment}
                                            onChange={(e) => setComment(e.target.value)}
                                        />
                                        <Button type='button' label='Agregar evaluación' severity='success'
                                                disabled={evaluation === null} style={{width: '100%'}}
                                                onClick={() => setVisible(true)}/>
                                        <Dialog header="Firmar evaluación" visible={visible} style={{width: '50vw'}}
                                                onHide={onHide}>
                                            <p className="m-0">
                                                <InputText className='mb-3' type='password' keyfilter="int" value={otp}
                                                           onChange={(e) => setOtp(e.target.value)}/>
                                                <br/>
                                                <Button type='button' label='Agregar evaluación' severity='success'
                                                        disabled={otp === ''}
                                                        onClick={() => onSuccess(planning.id)}/>
                                            </p>
                                        </Dialog>
                                    </>
                            }
                        </Fieldset>
                    })
                }

            </div>
        </div>
    )
};

export default LandingPlanningLectionary;