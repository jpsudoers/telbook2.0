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
    
    useEffect(() => {
        getPlanning(date)
    }, [])

    const [activePlanningEvaluation, setActivePlanningEvaluation] = useState(null) // esto va a guardar el id de la planificacion que se va a evaluar
    const [dialogVisible, setDialogVisible] = useState(false); // este es el flag para mostrar el dialogo o no
    const [currentEvaluationValue, setCurrentEvaluationValue] = useState(''); // este es el valor de la evaluacion positiva, negativa
    const [currentCommentValue, setCurrentCommentValue] = useState(''); // este es el valor del comentario
    const [currentOtpValue, setCurrentOtpValue] = useState(''); // este es el valor del otp

    const startEvaluation = (id) => {
        setActivePlanningEvaluation(id)
        setDialogVisible(true)
    }

    const dismissEvaluation = () => {
        setActivePlanningEvaluation(null)
        setCurrentEvaluationValue('')
        setCurrentCommentValue('')
        setCurrentOtpValue('')
        setDialogVisible(false)
    }

    const finishEvaluation = () => {
        submit(activePlanningEvaluation)
        dismissEvaluation()
    }

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
            comentario: currentCommentValue,
            curso: grade.toUpperCase(),
            evaluacion: currentEvaluationValue,
            hora: date,
            publishedAt: currentDate,
            planificacionId: id,
            otp: currentOtpValue,
            usuario: user.run
        }
        setPlanningLectionary(newData)
        getPlanning(date)
    }

    if (planningShortsLectionaryLoading) {
        return <Loading/>
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
                                        <Button type='button' label='Evaluar experiencia de aprendizaje' severity='success' onClick={() => startEvaluation(planning.id)} />
                                        {
                                            activePlanningEvaluation && (
                                                <Dialog header="Evaluar planificacion" visible={dialogVisible} style={{width: '50vw'}} onHide={dismissEvaluation}>
                                                    <SelectButton id='item' name='evaluation' value={currentEvaluationValue} options={['positiva', 'negativa']} onChange={(e) => {setCurrentEvaluationValue(e.value)}}/>
                                                    <br/>
                                                    <InputTextarea placeholder='Comentario' className='mt-1' style={{resize: 'none', marginBottom: '20px'}} rows={6} cols={75} value={currentCommentValue} onChange={(e) => setCurrentCommentValue(e.target.value)} />
                                                    <br/>
                                                    <InputText placeholder='Codigo OTP' className='mb-3' type='password' keyfilter="int" value={currentOtpValue} onChange={(e) => setCurrentOtpValue(e.target.value)}/>
                                                    <br/>
                                                    <Button type='button' label='Agregar evaluación' severity='success' disabled={currentOtpValue === '' || currentCommentValue === '' || currentEvaluationValue === ''} onClick={() => finishEvaluation()}/>
                                                </Dialog>
                                            )
                                        }
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