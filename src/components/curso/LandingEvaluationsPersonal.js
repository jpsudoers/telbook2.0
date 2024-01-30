import React, {useRef, useState, useContext} from 'react';
import {useRouter} from "next/router";
import {Toast} from 'primereact/toast';
import {FileUpload} from 'primereact/fileupload';
import {InputText} from "primereact/inputtext";
import StudentsContext from "@/context/students/Students.context";

const LandingEvaluationPersonal = () => {
    const router = useRouter();
    const {grade} = router.query;
    const {
        setEvaluations,
    } = useContext(StudentsContext);

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
            </div>
        </div>
    )
};

export default LandingEvaluationPersonal;