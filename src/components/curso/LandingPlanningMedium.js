import React, {useEffect, useState, useContext} from 'react';
import {useFormik} from 'formik';
import {MultiSelect} from 'primereact/multiselect';
import {Button} from 'primereact/button';
import {Dropdown} from 'primereact/dropdown';
import {InputText} from 'primereact/inputtext';
import {InputMask} from 'primereact/inputmask';
import {TreeTable} from 'primereact/treetable';
import {Column} from 'primereact/column';
import {classNames} from 'primereact/utils';
import UserContext from "@/context/user/User.context";
import PlanningContext from "@/context/planning/Planning.context";
import {useRouter} from "next/router";
import {unique} from "@/utils/formats";
import Loading from "@/components/commons/Loading/Loading";
import {IsCurrent} from "@/components/curso/planningMedium/bodyCurrentPlanningMedium";
import {trueFirst} from "@/utils/sort";
import {getRandomKey} from "@/utils/evaluations";
import autoTable from "jspdf-autotable";


const LandingPlanningMedium = () => {
    const [selectAmbit, setSelectAmbit] = useState(null);
    const [selectCore, setSelectCore] = useState(null);

    const router = useRouter();
    const {grade} = router.query;
    const level = grade.split('-')[1].slice(0, -1)
    const {
        getCurricularBases,
        bases,
        basesLoading,
        basesError,
    } = useContext(UserContext);

    const {
        getPlanningMediums,
        setPlanningMedium,
        editPlanningMedium,
        planningMediums,
        planningMediumsLoading,
        planningMediumsError,
    } = useContext(PlanningContext);

    useEffect(() => {
        if (grade !== localStorage.getItem('gradeMP')) {
            getPlanningMediums(grade.toUpperCase())
            getCurricularBases(level.toUpperCase())
            localStorage.setItem('gradeMP', grade.toString())
        }
    }, [])

    const ambit = unique(bases.map(base => {
        return base.ambito
    }));

    const core = unique(bases.filter(base => {
        return base.ambito === selectAmbit
    }).map(base => base.nucleo));

    const oa = unique(bases.filter(base => {
        return base.nucleo === selectCore
    }).map(base => `${base.numero}. ${base.OA}`));

    const formik = useFormik({
        initialValues: {
            week: '',
            project: '',
            ambit: '',
            core: '',
            objective: '',
            close: '',
            strategy: '',
            oa: [],
        },
        validate: (data) => {
            let errors = {};

            if (!data.week || data.week === '') {
                errors.week = 'La cantidad de semanas es obligatoria';
            }

            if (!data.project || data.project === '') {
                errors.project = 'El proyecto es obligatorio';
            }

            if (!data.ambit || data.ambit === '') {
                errors.ambit = 'El ámbito es obligatorio';
            }

            if (!data.core || data.core === '') {
                errors.core = 'El núcleo es obligatorio';
            }

            if (!data.objective || data.objective === '') {
                errors.objective = 'El objetivo es obligatorio';
            }

            if (!data.close || data.close === '') {
                errors.close = 'El cierre es obligatorio';
            }

            if (!data.strategy || data.strategy === '') {
                errors.strategy = 'La estrategia es obligatorio';
            }

            if (!data.oa || data.oa.length === 0) {
                errors.strategy = 'Los objetivos de aprendizaje son obligatorios';
            }
            return errors;
        },
        onSubmit: (data) => {
            if (Object.values(formik.errors).length === 0) {
                const id = new Date()
                const newData = {
                    id: grade + id.getTime(),
                    cierre: data.close,
                    curso: grade.toUpperCase(),
                    estrategias: data.strategy,
                    oas: data.oa.map(o => {
                        return {
                            id: 'oa-' + grade.toLowerCase() + '-' + getRandomKey(),
                            ambitoSeleccionado: data.ambit,
                            nucleoSeleccionado: data.core,
                            oaSeleccionado: o
                        }
                    }),
                    objetivos: data.objective,
                    proyectoEje: data.project,
                    publishedAt: id,
                    tiempo: data.week,
                    vigencia: true,
                }
                setPlanningMedium(newData)
                formik.resetForm();
            }
        }
    });

    const isFormFieldInvalid = (name) => !!(formik.touched[name] && formik.errors[name]);

    const getFormErrorMessage = (name) => {
        return isFormFieldInvalid(name) ? <small className="p-error">{formik.errors[name]}<br/></small> :
            <small className="p-error"/>;
    };

    const exportToPDF = () => {
        import('jspdf').then((jsPDF) => {
            import('jspdf-autotable').then(() => {
                const doc = new jsPDF.default(0, 0);
                const dataToPdf = planningMediums
                console.log(dataToPdf)
                let row = [];
                dataToPdf.forEach(data => {
                    row.push([data.data.name.toUpperCase()])
                    row.push(['  ' + data.children[2].data.name])
                    row.push(['  ' + data.children[3].data.name])
                    row.push(['  ' + data.children[4].data.name])
                    row.push(['   Objetivos de aprendizaje:'])
                    data.children[0].children.forEach(child => {
                        child.data.name !== '' && row.push(['     ' + child.data.name])
                    })
                })
                autoTable(doc, {
                    head: [['Planificaciones a mediano plazo ' + grade.toUpperCase()]],
                    body: row,
                    startY: 25,
                })
                doc.save('Planificaciones a mediano plazo ' + grade.toUpperCase() + '.pdf');
            });
        });
    }

    if (planningMediumsLoading || basesLoading) {
        return <Loading/>
    }

    return (
        <form onSubmit={formik.handleSubmit}>
            <div className="formgrid grid">
                <div className="field col">
                    <div className="flex-auto mb-4">
                        <label htmlFor="week" className="font-bold block mb-2">Cantidad de semanas</label>
                        <div className='p-inputgroup w-full'>
                            <InputMask
                                id="week"
                                name="week"
                                value={formik.values.week}
                                onChange={(e) => {
                                    formik.setFieldValue('week', e.target.value);
                                }}
                                mask="99"
                                placeholder="01-99"
                                className={classNames({'p-invalid': isFormFieldInvalid('week')})}
                            />
                            <span className="p-inputgroup-addon">Semanas</span>
                        </div>
                    </div>
                    <div className="flex-auto mb-4">
                        <label htmlFor="week" className="font-bold block mb-2">Projecto eje de los aprendizajes</label>
                        <div className='p-inputgroup w-full'>
                            <InputText
                                id="project"
                                name="project"
                                value={formik.values.project}
                                onChange={(e) => {
                                    formik.setFieldValue('project', e.target.value);
                                }}
                                placeholder="Projecto eje de los aprendizajes"
                                className={classNames({'p-invalid': isFormFieldInvalid('project')})}
                            />
                        </div>
                    </div>
                    <div className="flex-auto mb-4">
                        <label htmlFor="ambit" className="font-bold block mb-2">Ámbito</label>
                        <div className='p-inputgroup w-full'>
                            <Dropdown
                                inputId="ambit"
                                name="ambit"
                                value={formik.values.ambit}
                                options={ambit}
                                placeholder="Selecciona un ámbito"
                                className={classNames({'p-invalid': isFormFieldInvalid('ambit')})}
                                onChange={(e) => {
                                    setSelectAmbit(e.value)
                                    formik.setFieldValue('ambit', e.value);
                                }}
                            />
                        </div>
                    </div>
                    <div className="flex-auto mb-4">
                        <label htmlFor="core" className="font-bold block mb-2">Núcleo</label>
                        <div className='p-inputgroup w-full'>
                            <Dropdown
                                inputId="core"
                                name="core"
                                value={formik.values.core}
                                options={core}
                                emptyMessage={'Selecciona un ámbito'}
                                placeholder="Selecciona un núcleo"
                                className={classNames({'p-invalid': isFormFieldInvalid('core')})}
                                onChange={(e) => {
                                    setSelectCore(e.value)
                                    formik.setFieldValue('core', e.value);
                                }}
                            />
                        </div>
                    </div>
                    <div className="flex-auto mb-4">
                        <label htmlFor="oa" className="font-bold block mb-2">Objetivos de aprendizaje</label>
                        <div className='p-inputgroup w-full'>
                            <MultiSelect
                                id="oa"
                                name="oa"
                                options={oa}
                                value={formik.values.oa}
                                emptyMessage='Selecciona un núcleo'
                                onChange={(e) => {
                                    formik.setFieldValue('oa', e.value);
                                }}
                                placeholder="Selecciona objetivos"
                                maxSelectedLabels={0}
                                selectedItemsLabel={'{0} Objetivos seleccionados'}
                                className={classNames({'p-invalid': isFormFieldInvalid('oa')})}
                            />
                        </div>
                    </div>
                    <div className="flex-auto mb-4">
                        <label htmlFor="week" className="font-bold block mb-2">Objetivos</label>
                        <div className='p-inputgroup w-full'>
                            <InputText
                                id="project"
                                name="project"
                                value={formik.values.objective}
                                onChange={(e) => {
                                    formik.setFieldValue('objective', e.target.value);
                                }}
                                placeholder="Objetivos"
                                className={classNames({'p-invalid': isFormFieldInvalid('objective')})}
                            />
                        </div>
                    </div>
                    <div className="flex-auto mb-4">
                        <label htmlFor="week" className="font-bold block mb-2">Estrategias para alcanzar el
                            proyecto</label>
                        <div className='p-inputgroup w-full'>
                            <InputText
                                id="project"
                                name="project"
                                value={formik.values.strategy}
                                onChange={(e) => {
                                    formik.setFieldValue('strategy', e.target.value);
                                }}
                                placeholder="Estrategias para alcanzar el proyecto"
                                className={classNames({'p-invalid': isFormFieldInvalid('strategy')})}
                            />
                        </div>
                    </div>
                    <div className="flex-auto mb-4">
                        <label htmlFor="week" className="font-bold block mb-2">Cierre del proyecto</label>
                        <div className='p-inputgroup w-full'>
                            <InputText
                                id="close"
                                name="close"
                                value={formik.values.close}
                                onChange={(e) => {
                                    formik.setFieldValue('close', e.target.value);
                                }}
                                placeholder="Cierre del proyecto"
                                className={classNames({'p-invalid': isFormFieldInvalid('close')})}
                            />
                        </div>
                    </div>
                    {getFormErrorMessage('week')}
                    {getFormErrorMessage('project')}
                    {getFormErrorMessage('ambit')}
                    {getFormErrorMessage('core')}
                    {getFormErrorMessage('objective')}
                    {getFormErrorMessage('close')}
                    {getFormErrorMessage('strategy')}
                    {getFormErrorMessage('oa')}
                    <Button type='submit' label='Guardar planificación' severity='success' style={{width: '100%'}}/>
                </div>
                <div className="field col">
                    <div className="card text-xs">
                        <TreeTable selectionMode="single" value={trueFirst(planningMediums)}
                                   tableStyle={{minWidth: '50rem', fontSize: '12px'}} loading={planningMediumsLoading}>
                            <Column field="name" header="Planificaciones mediano plazo" body={IsCurrent} expander/>
                        </TreeTable>
                        <Button type='button' className='mt-4' onClick={exportToPDF} label='Descargar planificaciones'
                                severity='success' style={{width: '100%'}}/>
                    </div>
                </div>
            </div>
        </form>

    )
};

export default LandingPlanningMedium;