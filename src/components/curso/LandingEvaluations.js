import React, {useContext, useState, useEffect, useRef} from 'react';
import {useRouter} from "next/router";
import {Fieldset} from 'primereact/fieldset';
import {Dropdown} from 'primereact/dropdown';
import StudentsContext from "@/context/students/Students.context";
import PlanningContext from "@/context/planning/Planning.context";
import {filterPlanningByMonth} from "@/utils/plannings";
import Loading from "@/components/commons/Loading/Loading";
import GetEvaluation from "@/components/curso/evaluacion/GetEvaluation";
import {jsPDF} from "jspdf";
import {useScreenshot} from "use-react-screenshot";
import {Button} from "primereact/button";
import { InputTextarea } from 'primereact/inputtextarea';
import { InputText } from 'primereact/inputtext';

const months = [
    {code: 0, name: 'Enero'},
    {code: 1, name: 'Febrero'},
    {code: 2, name: 'Marzo'},
    {code: 3, name: 'Abril'},
    {code: 4, name: 'Mayo'},
    {code: 5, name: 'Junio'},
    {code: 6, name: 'Julio'},
    {code: 7, name: 'Agosto'},
    {code: 8, name: 'Septiembre'},
    {code: 9, name: 'Octubre'},
    {code: 10, name: 'Noviembre'},
    {code: 11, name: 'Diciembre'},
];

const LandingEvaluation = () => {
    const router = useRouter();
    const value = '';
    const ref = useRef(null)
    const {grade} = router.query;
    const [selectedMonth, setSelectedMonth] = useState({code: 0, name: 'Enero'});
    const [selectedProjectoEje, setSelectedProjectoEje] = useState('');
    const [state, setState] = useState({})

    const download = (image, {
        name = 'Evaluaciones-' + grade + '-' + selectedMonth.name} = {}) => {
        let doc = new jsPDF('portrait');
        doc.addImage(image, 'PNG', 15, 15, 160, 240);
        doc.save(name + '.pdf');

    }
    const [image, takeScreenshot] = useScreenshot()
    const getImage = () => takeScreenshot(ref.current).then(download)

    const {
        students,
        setEvaluationsByOa,
        evaluationByOa,
        evaluationByOaLoading,
        evaluationByOaError,
        getEvaluationsByGrade
    } = useContext(StudentsContext);

    const {
        getPlanningsMediumByDate,
        planningMediumsRaw,
        planningMediumsRawLoading,
        planningMediumsRawError,
    } = useContext(PlanningContext);

    const handlerState = (event, student, key) => {
        setState({
            ...state,
            [key]: {
                ...state[key],
                [student.run.replaceAll('.', '')]: event.target.value
            }
        })
    }

    useEffect(() => {
        getPlanningsMediumByDate(grade.toUpperCase())
        if (grade !== localStorage.getItem('evaoa')) {
            getEvaluationsByGrade(grade.toUpperCase())
            localStorage.setItem('evaoa', grade.toString())
        }
    }, [grade])
    const plannings = planningMediumsRaw.filter(planificacion => planificacion.proyectoEje === selectedProjectoEje)
    const filterStudents = students.filter(student => student.grade === grade.toUpperCase())

    const filterStudents1 = filterStudents.slice(0, 8);
    const filterStudents2 = filterStudents.slice(8);

    const getDisabled = (key) => {
        if (Object.keys(state).length === 0) {
            return true
        }
        if (state[key] === undefined) {
            return true
        }
        if (Object.keys(state[key]).length === 0) {
            return true
        }
        return Object.keys(state[key]).length !== filterStudents.length;
    }

    const handlerEvaluation = (key, oa) => {
        const date = new Date()
        const newData = {
            idOa: oa.id,
            curso: grade.toUpperCase(),
            id: 'evaoa-' + date.getTime(),
            evaluaciones: state[key],
            contenidoEvaluado: value
        }
        setEvaluationsByOa(newData)
        getEvaluationsByGrade(grade.toUpperCase())
    }

    if (planningMediumsRawLoading ||evaluationByOaLoading) {
        return <Loading/>
    }

    // lista de proyectos eje para poblar el dropdown
    var projectosEje = planningMediumsRaw.map(planning => planning.proyectoEje)
    projectosEje = [...new Set(projectosEje)];

    return (
        <div ref={ref}>
            <div className='flex-auto mb-4'>
                <label htmlFor='grade' className='font-bold block mb-2'>Selecciona un proyecto</label>
                <div className='flex gap-2'>
                    <Dropdown value={selectedProjectoEje} onChange={(e) => setSelectedProjectoEje(e.value)} options={projectosEje}
                              placeholder="Proyecto" className="w-full md:w-14rem"/>
                    <div>
                        <Button label='Descargar evaluaciones' severity='success' onClick={getImage}/>
                    </div>
                </div>

            </div>
            <div>
                {
                    plannings && plannings.map((planning, index) => {
                        return <Fieldset key={index} legend={planning.name} className='mb-4'>
                            {planning.oas.map((oa, idx) => {
                                return <div key={idx} className='mb-4'>
                                    <div className='mb-1'>
                                        <strong>Ámbito:</strong> {oa.ambitoSeleccionado}
                                    </div>
                                    <div className='mb-1'>
                                        <strong>Núcleo:</strong> {oa.nucleoSeleccionado}
                                    </div>
                                    <div className='mb-3'>
                                        <strong>Objetivo de aprendizaje:</strong> {oa.oaSeleccionado}
                                    </div>
                                    
                                    
                                    {/* JPS agrego div para poner un TextArea para ingresar contenidos */}
                                    <div className='mb-1'>
                                    <strong>Ingreso Contenidos:</strong> 
                                    </div>
                                    <div className='p-inputgroup w-full'>
                                    <InputTextarea
                                    id="resources"
                                    name="resources"
                                    //value={value}
                                    placeholder="Ingrese contenidos evaluados"
                                    />
                                    </div>

                                    <GetEvaluation idx={idx} index={index} state={state} handlerState={handlerState}
                                                   students1={filterStudents1} students2={filterStudents2} oa={oa}
                                                   handlerEvaluation={handlerEvaluation} getDisabled={getDisabled}
                                                   evaluationByOa={evaluationByOa}
                                    />

                                </div>
                            })}
                        </Fieldset>
                    })
                }
            </div>
        </div>
    )
};

export default LandingEvaluation;