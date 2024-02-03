import React, {useRef, useState, useContext, useEffect} from 'react';
import {useRouter} from "next/router";
import {Toast} from 'primereact/toast';
import {FileUpload} from 'primereact/fileupload';
import {InputText} from "primereact/inputtext";
import StudentsContext from "@/context/students/Students.context";
import Loading from "@/components/commons/Loading/Loading";
import {capitalize} from "@/utils/formats";
import {Fieldset} from "primereact/fieldset";

const LandingEvaluationPersonal = () => {
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

    const onUpload = (e) => {
        const files = e.files || e.dataTransfer.files
        if (!files.length) {
            return
        }
        const reader = new FileReader()
        reader.readAsDataURL(files[0])
        reader.onload = () => {
            const response = {
                curso: grade.toUpperCase(),
                detalle: value,
                nombre: files[0].name,
                archivo: reader.result

            }
            setEvaluations(response)
        }
        toast.current.show({severity: 'info', summary: 'Success', detail: 'Archivo subido'});
    };

    if (evaluationsLoading) {
        return <Loading/>
    }

    return (
        <div>
            <div className='flex-auto mb-4'>
                <label htmlFor='grade' className='font-bold block mb-2'>Detalle de evaluación</label>
                <InputText value={value} onChange={(e) => setValue(e.target.value)}/>
                <div className="card flex py-3">
                    <Toast ref={toast}/>
                    <FileUpload accept="pdf/*" maxFileSize={1000000} cancelLabel={"Cancelar"}
                                uploadLabel={"Guardar archivo"}
                                onUpload={onUpload} chooseLabel="Subir archivo"/>
                </div>
                {
                    evaluation?.map((eva, index) => {
                        return <Fieldset key={index} className='mb-3' legend={capitalize(eva.detalle)}>
                            <p className="m-0">
                                <strong>Archivo:</strong> <a href={eva.archivo} target='_blank' download={eva.nombre}>{eva.nombre}</a>
                            </p>
                        </Fieldset>
                    })
                }
            </div>
        </div>
    )
};

export default LandingEvaluationPersonal;