import React, {useContext, useState, useEffect} from 'react';
import {useRouter} from "next/router";
import {Fieldset} from 'primereact/fieldset';
import {Dropdown} from 'primereact/dropdown';
import StudentsContext from "@/context/students/Students.context";
import PlanningContext from "@/context/planning/Planning.context";
import {filterPlanningByMonth} from "@/utils/plannings";
import {Button} from "primereact/button";
import Loading from "@/components/commons/Loading/Loading";

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

    const {
        students,
    } = useContext(StudentsContext);

    const {
        getPlanningsMediumByDate,
        planningMediumsRaw,
        planningMediumsRawLoading,
        planningMediumsRawError,
    } = useContext(PlanningContext);

    useEffect(() => {
        if (planningMediumsRaw.length === 0) {
            getPlanningsMediumByDate(grade.toUpperCase())
        }
    }, [grade])

    const plannings = filterPlanningByMonth(planningMediumsRaw, selectedMonth.code)
    const filterStudents = students.filter(student => student.grade === grade.toUpperCase())

    if(planningMediumsRawLoading) {
        return <Loading />
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
                                    <div className='mb-1'>
                                        <strong>Objetivo de aprendizaje:</strong> {oa.oaSeleccionado}
                                    </div>
                                    <div className='flex text-xs'>
                                        {filterStudents && filterStudents.map((student, key) => {
                                            return <div key={key} className='mt-2 mr-1'
                                                        style={{width: '75px'}}>{student.name}</div>
                                        })}
                                    </div>
                                    <div className='flex text-xs mb-2'>
                                        {filterStudents && filterStudents.map((student, key) => {
                                            return <Dropdown className='mr-1' options={['L', 'D', 'NL', 'NE']} key={key}
                                                             dropdownIcon={false} style={{width: '75px'}}/>
                                        })}
                                    </div>
                                    <div>
                                        <Button label='Confirmar' severity='success' />
                                    </div>
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