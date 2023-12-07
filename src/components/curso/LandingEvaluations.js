import React, {useContext, useState, useEffect} from 'react';
import {useRouter} from "next/router";
import {Fieldset} from 'primereact/fieldset';
import {Dropdown} from 'primereact/dropdown';
import StudentsContext from "@/context/students/Students.context";
import PlanningContext from "@/context/planning/Planning.context";
import {filterPlanningByMonth} from "@/utils/plannings";
import Loading from "@/components/commons/Loading/Loading";
import GetEvaluation from "@/components/curso/evaluacion/GetEvaluation";

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
    const {grade} = router.query;
    const [selectedMonth, setSelectedMonth] = useState({code: 0, name: 'Enero'});
    const [state, setState] = useState({})

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
    const plannings = filterPlanningByMonth(planningMediumsRaw, selectedMonth.code)
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
            evaluaciones: state[key]
        }
        setEvaluationsByOa(newData)
        getEvaluationsByGrade(grade.toUpperCase())
    }

    if (planningMediumsRawLoading ||evaluationByOaLoading) {
        return <Loading/>
    }

    return (
        <div>
            <div className='flex-auto mb-4'>
                <label htmlFor='grade' className='font-bold block mb-2'>Selecciona un mes</label>
                <Dropdown value={selectedMonth} onChange={(e) => setSelectedMonth(e.value)} options={months}
                          optionLabel='name'
                          placeholder="Selecciona un mes" className="w-full md:w-14rem"/>
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