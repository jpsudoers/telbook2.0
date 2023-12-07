import React, {useContext, useState, useEffect} from 'react';
import {useRouter} from "next/router";
import {Dropdown} from 'primereact/dropdown';
import PlanningContext from "@/context/planning/Planning.context";
import {Button} from "primereact/button";
import Loading from "@/components/commons/Loading/Loading";
import {InputTextarea} from "primereact/inputtextarea";

const LandingEvaluationPersonal = () => {
    const router = useRouter();
    const {grade} = router.query;
    const [selectedMonth, setSelectedMonth] = useState({code: 0, name: 'Enero'});

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

    if (planningMediumsRawLoading) {
        return <Loading/>
    }

    return (
        <div>
            <div className='flex-auto mb-4'>
                <label htmlFor='grade' className='font-bold block mb-2'>Detalle de evaluación</label>
                <InputTextarea/> <br/>
                <Button label='Agregar Evaluacion' severity='success' />
            </div>
        </div>
    )
};

export default LandingEvaluationPersonal;