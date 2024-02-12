import React, {useRef, useState, useContext, useEffect} from 'react';
import {useRouter} from "next/router";
import {Toast} from 'primereact/toast';
import {InputText} from "primereact/inputtext";
import StudentsContext from "@/context/students/Students.context";
import Loading from "@/components/commons/Loading/Loading";
import {capitalize} from "@/utils/formats";
import {Fieldset} from "primereact/fieldset";
import {Button} from "primereact/button";

const LandingEvaluationPersonal = () => {
    const ref = useRef();
    const reset = () => {
        ref.current.value = "";
    };
    const router = useRouter();
    const {grade} = router.query;
    const {
        setEvaluations,
        getEvaByGrade,
        evaluation,
        evaluationsLoading,
        evaluationsError,
    } = useContext(StudentsContext);

    useEffect(() => {
        getEvaByGrade(grade.toUpperCase())
    }, [])

    const toast = useRef(null);
    const [value, setValue] = useState('');
    const [file, setFile] = useState(null);
    const [error, setError] = useState(false)

    const onFileChange = (event) => {
        setFile(event.target.files[0])
    };

    const onUpload = () => {
        if (value === '') {
            setError(true)
            return;
        }
        if (!file) {
            return
        }
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => {
            const response = {
                curso: grade.toUpperCase(),
                detalle: value,
                nombre: file.name,
                archivo: reader.result

            }
            setEvaluations(response)
        }
        toast.current.show({severity: 'info', summary: 'Success', detail: 'Archivo subido'});
        getEvaByGrade(grade.toUpperCase())
        reset();
    };

    if (evaluationsLoading) {
        return <Loading/>
    }

    return (
        <div>
            <div className='flex-auto mb-4'>
                <label htmlFor='grade' className='font-bold block mb-2'>Detalle de evaluación</label>
                <InputText value={value} onChange={(e) => setValue(e.target.value)}/>
                {error && <><br/><small style={{color: 'red'}}>Debe escribir un detalle</small></>}
                <div className="card flex py-3">
                    <Toast ref={toast}/>
                    <input type='file' ref={ref} onChange={onFileChange}/>
                </div>
                <Button onClick={onUpload} severity={'success'} >Subir archivo</Button>
                {
                    evaluation?.map((eva, index) => {
                        return <Fieldset key={index} className='mb-3' legend={capitalize(eva.detalle)}>
                            <p className="m-0">
                                <strong>Archivo:</strong> <a href={eva.archivo} target='_blank'
                                                             download={eva.nombre}>{eva.nombre}</a>
                            </p>
                        </Fieldset>
                    })
                }
            </div>
        </div>
    )
};

export default LandingEvaluationPersonal;