import React, {useRef, useState, useContext, useEffect} from 'react';
import {Splitter, SplitterPanel} from 'primereact/splitter';
import {useFormik} from 'formik';
import {Calendar} from 'primereact/calendar';
import {InputTextarea} from 'primereact/inputtextarea';
import {ScrollPanel} from 'primereact/scrollpanel';
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import {Button} from 'primereact/button';
import {Toast} from 'primereact/toast';
import PlanningContext from "@/context/planning/Planning.context";
import {useRouter} from "next/router";
import Loading from "@/components/commons/Loading/Loading";
import autoTable from 'jspdf-autotable'
import {exportToPDF} from "@/utils/formats";

const LandingPlanningLarge = () => {
    const router = useRouter();
    const {grade} = router.query;

    const {
        getPlanningLarges,
        setPlanningLarge,
        deletePlanningLarge,
        planningLarges,
        planningLargesLoading,
        planningLargesError,
    } = useContext(PlanningContext);

    useEffect(() => {

        if (grade !== localStorage.getItem('gradeLP')) {
            getPlanningLarges(grade.toUpperCase())
            localStorage.setItem('gradeLP', grade.toString())
        }
    }, [])

    const toast = useRef(null);

    const show = () => {
        toast.current.show({
            severity: 'success',
            summary: 'Planificación agregada',
            detail: formik.values.description
        });
    };

    const formik = useFormik({
        initialValues: {
            description: '',
            date: ''
        },
        validate: (data) => {
            let errors = {};

            if (!data.description || data.description === '') {
                errors.description = 'La descripción es obligatoria';
            }

            if (!data.date) {
                errors.date = 'La fecha es obligatoria.';
            }

            return errors;
        },
        onSubmit: (data) => {
            if (!formik.errors.date) {
                data && show(data);
                const dateFormat = data.date.toLocaleDateString('es-CL')
                const newData = {
                    fecha: dateFormat.split('-').reverse().join('-'),
                    texto: data.description,
                    curso: grade.toUpperCase(),
                    mes: data.date.getMonth() + 1,
                    publishedAt: new Date(),
                    id: (grade.toUpperCase() + data.description).replaceAll(' ', '')
                }
                setPlanningLarge(newData)
                formik.resetForm();
            }
        }
    });

    const isFormFieldInvalid = (name) => !!(formik.touched[name] && formik.errors[name]);

    const getFormErrorMessage = (name) => {
        return isFormFieldInvalid(name) ? <small className="p-error">{formik.errors[name]}</small> :
            <small className="p-error">&nbsp;</small>;
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-trash" rounded outlined severity="danger"
                        onClick={() => deletePlanningLarge(rowData.id)}/>
            </React.Fragment>
        );
    };

    if (planningLargesLoading) {
        return <Loading/>
    }

    const downloadList = (e) => {
        e.preventDefault();
        const title = "Planificaciones a largo plazo " + grade.toUpperCase();
        const head = ['Fecha', 'Planificación a largo plazo']
        const attr = ['date', 'description']
        exportToPDF(planningLarges, title, head, attr)
    }

    planningLarges.sort((a, b) => (a.date > b.date) ? 1 : ((b.date > a.date) ? -1 : 0))

    return (
        <>
            <Splitter style={{height: '500px'}}>
                <SplitterPanel size={25} minSize={25}>
                    <form onSubmit={formik.handleSubmit} className='flex flex-column gap-2'>
                        <div style={{padding: '15px'}}>
                            <label htmlFor='select-date'
                                   style={{fontWeight: 'bold', display: 'block', marginBottom: '10px'}}>
                                Seleccionar fecha
                            </label>
                            <Toast ref={toast}/>
                            <Calendar dateFormat='dd/mm/yy' id='select-date' name='date'
                                      value={formik.values.date}
                                      onChange={(e) => {
                                          formik.setFieldValue('date', e.target.value);
                                      }}
                                      style={{width: '272px'}}
                                      locale='es' showIcon/>
                            <label htmlFor='select-description'
                                   style={{
                                       fontWeight: 'bold',
                                       display: 'block',
                                       marginBottom: '10px',
                                       marginTop: '15px'
                                   }}>
                                Descripción
                            </label>
                            <InputTextarea
                                inputid='description'
                                name='description'
                                style={{resize: 'none', marginBottom: '20px'}}
                                rows={4}
                                cols={27}
                                value={formik.values.description}
                                onChange={(e) => {
                                    formik.setFieldValue('description', e.target.value);
                                }}
                            />
                            <p>{getFormErrorMessage('date')}</p>
                            <p>{getFormErrorMessage('description')}</p>
                            <Button type='submit' label='Agregar' severity='success' style={{width: '100%'}}/>
                        </div>
                    </form>
                </SplitterPanel>
                <SplitterPanel size={75} minSize={75}>
                    <ScrollPanel style={{width: '100%', height: '500px'}}>
                        <DataTable value={planningLarges} tableStyle={{minWidth: '50rem'}}>
                            <Column field='date' header='Fecha'/>
                            <Column field='description' header='Descripción de la planificación'/>
                            <Column body={actionBodyTemplate} header='Acción'/>
                        </DataTable>
                    </ScrollPanel>
                </SplitterPanel>
            </Splitter>
            <Button className='mt-2' type='button' label='Descargar lista de planificaciones' onClick={downloadList} severity='success'/>
        </>
    )
};

export default LandingPlanningLarge;