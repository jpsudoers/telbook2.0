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

    const onFileChange = (event) => {
        setFile(event.target.files[0])
    };

    const onUpload = () => {
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
                <div className="card flex py-3">
                    <Toast ref={toast}/>
                    {/*<FileUpload accept="pdf/*" maxFileSize={1000000} cancelLabel={"Cancelar"}*/}
                    {/*            uploadLabel={"Guardar archivo"}*/}
                    {/*            onUpload={onUpload} chooseLabel="Subir archivo"/>*/}
                    <input type='file' ref={ref} onChange={onFileChange}/>
                    <button onClick={onUpload}>Subir archivo</button>
                </div>
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