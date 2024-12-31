import React, {useEffect, useState, useContext} from 'react';
import {useFormik} from 'formik';
import {MultiSelect} from 'primereact/multiselect';
import {Button} from 'primereact/button';
import {Dropdown} from 'primereact/dropdown';
import {InputText} from 'primereact/inputtext';
import {TreeTable} from 'primereact/treetable';
import {Column} from 'primereact/column';
import {classNames} from 'primereact/utils';
import UserContext from "@/context/user/User.context";
import PlanningContext from "@/context/planning/Planning.context";
import {useRouter} from "next/router";
import {dateToFirebaseWithSlash, unique} from "@/utils/formats";
import Loading from "@/components/commons/Loading/Loading";
import {getWeekNumber} from "@/utils/date";
import {Calendar} from "primereact/calendar";
import autoTable from "jspdf-autotable";
import {getRandomKey} from "@/utils/evaluations";
import {InputTextarea} from "primereact/inputtextarea";
import PreviewOas from "@/components/curso/planningShort/PreviewOas";
import ExcelJS from 'exceljs';

const LandingPlanningShort = () => {
    const [selectAmbit, setSelectAmbit] = useState(null);
    const [selectCore, setSelectCore] = useState(null);
    const [addedOas, setAddedOas] = useState([]);

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
        getPlanningShorts,
        planningShorts,
        planningShortsLoading,
        deletePlanningShort,
        planningShortsError,
        getPlanningMediums,
        planningMediums,
        planningMediumsLoading,
        planningMediumsError,
        setPlanningShort,
    } = useContext(PlanningContext);

    useEffect(() => {
        if (grade !== localStorage.getItem('gradeSP')) {
            getPlanningShorts(grade.toUpperCase())
            getCurricularBases(level.toUpperCase())
            getPlanningMediums(grade.toUpperCase())
            localStorage.setItem('gradeSP', grade.toString())
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
            date: '',
            ambit: '',
            core: '',
            resources: '',
            instruments: '',
            init: '',
            oa: [],
        },
        validate: (data) => {
            let errors = {};

            if (!data.date || data.date === '') {
                errors.date = 'La fecha es obligatoria';
            }

            if (!addedOas || addedOas.length === 0) {
                errors.oa = 'Los objetivos de aprendizaje son obligatorios';
            }
            return errors;
        },
        onSubmit: (data) => {
            if (Object.values(formik.errors).length === 0) {
                const id = new Date()
                const newData = {
                    id: grade + id.getTime(),
                    curso: grade.toUpperCase(),
                    estrategias: addedOas,
                    fecha: dateToFirebaseWithSlash(data.date),
                    inicio: data.init,
                    instrumentos: data.instruments,
                    publishedAt: id,
                    recursos: data.resources
                }
                setPlanningShort(newData)
                setAddedOas([])
                formik.resetForm();
            }
        }
    });

    const isFormFieldInvalid = (name) => !!(formik.touched[name] && formik.errors[name]);

    const getFormErrorMessage = (name) => {
        return isFormFieldInvalid(name) ? <small className="p-error">{formik.errors[name]}<br/></small> :
            <small className="p-error"/>;
    };    

    const isCurrent = (node) => {
        const {name, title} = node.data
        let firstTitle = ''
        if (title) {
            firstTitle = <b>{title}: </b>
        }
        return <span>
            {firstTitle}{name}
        </span>;
    }

    const actionTemplate = (node) => {
        const planningDate = new Date(node.date + " EDT");
        const currentDate = new Date();
        if (planningDate.getFullYear() === currentDate.getFullYear() &&
            planningDate.getMonth() === currentDate.getMonth() &&
            planningDate.getDate() === currentDate.getDate()) {
            if (Object.hasOwn(node, 'id')) {
                return <Button type='button' label='Eliminar' severity='danger' size='small' onClick={() => removePlanificacion(node.id)}/>
            }
            else return;
        }
        return;
    };

    const removePlanificacion = async (id) => {
        await deletePlanningShort(id)
        await getPlanningShorts(grade.toUpperCase())
    }

    if (planningShortsLoading || basesLoading || planningMediumsLoading) {
        return <Loading/>
    }

    const filterPlannings = planningShorts.filter(planning => {
        const weekCurrent = getWeekNumber(new Date())
        const weekPlanning = getWeekNumber(new Date(planning.date + " EDT"))
        return weekCurrent === weekPlanning
    }).sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateA - dateB;
    });

    const exportToPDF = () => {
        import('jspdf').then((jsPDF) => {
            import('jspdf-autotable').then(() => {
                const doc = new jsPDF.default(0, 0);
                const dataToPdf = planningShorts.sort((a, b) => {
                    const dateA = new Date(a.date);
                    const dateB = new Date(b.date);
                    return dateA - dateB;
                });
                let row = [];
                dataToPdf.forEach(data => {
                    row.push([
                        new Date(data.date).toLocaleDateString('es-ES'),
                        data.data.name.toUpperCase()
                    ])
                    row.push(['', '  Estrategias curriculares'])
                    data.children.forEach(child => {
                        if (child.children) {
                            child.children.forEach(ch => {
                                row.push(['', '      ' + ch.data?.title + ': ' + ch.data?.name])
                            })
                            row.push(['', '    '])
                        } else {
                            row.push(['', '  ' + child.data?.title + ': ' + child.data?.name])
                        }
                    })
                    row.push(['', '  '])
                })
                autoTable(doc, {
                    head: [['Fecha', 'Planificaciones a corto plazo ' + grade.toUpperCase()]],
                    body: row,
                    startY: 25,
                })
                doc.save('Todas las planificaciones corto plazo ' + grade.toUpperCase() + '.pdf');
            });
        });
    }

    const exportToExcel = async () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Planificaciones');
        
        // Configurar columnas
        worksheet.columns = [
            { header: 'Fecha', key: 'fecha', width: 15 },
            { header: 'Planificación', key: 'planificacion', width: 30 },
            { header: 'Tipo', key: 'tipo', width: 25 },
            { header: 'Detalle', key: 'detalle', width: 50 }
        ];

        // Estilo para el encabezado
        worksheet.getRow(1).font = { bold: true };
        worksheet.getRow(1).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFE0E0E0' }
        };

        // Usar planningShorts en lugar de filterPlannings para obtener todas las planificaciones
        const allPlannings = planningShorts.sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            return dateA - dateB;
        });

        let rowNumber = 2;

        allPlannings.forEach(data => {
            // Título de la planificación
            worksheet.addRow({
                fecha: new Date(data.date).toLocaleDateString('es-ES'),
                planificacion: data.data.name.toUpperCase(),
                tipo: '',
                detalle: ''
            });
            worksheet.getRow(rowNumber).font = { bold: true };
            rowNumber++;

            // Estrategias curriculares
            worksheet.addRow({
                fecha: '',
                planificacion: '',
                tipo: 'Estrategias curriculares',
                detalle: ''
            });
            worksheet.getRow(rowNumber).font = { italic: true };
            rowNumber++;

            // Agregar detalles
            data.children.forEach(child => {
                if (child.children) {
                    child.children.forEach(ch => {
                        worksheet.addRow({
                            fecha: '',
                            planificacion: '',
                            tipo: ch.data?.title,
                            detalle: ch.data?.name
                        });
                        rowNumber++;
                    });
                } else {
                    worksheet.addRow({
                        fecha: '',
                        planificacion: '',
                        tipo: child.data?.title,
                        detalle: child.data?.name
                    });
                    rowNumber++;
                }
            });

            // Línea en blanco entre planificaciones
            worksheet.addRow({});
            rowNumber++;
        });

        // Agregar bordes a todas las celdas con contenido
        worksheet.eachRow((row, rowNumber) => {
            row.eachCell((cell) => {
                if (cell.value) {
                    cell.border = {
                        top: { style: 'thin' },
                        left: { style: 'thin' },
                        bottom: { style: 'thin' },
                        right: { style: 'thin' }
                    };
                }
            });
        });

        // Generar y descargar el archivo
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = window.URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = `Todas las planificaciones corto plazo ${grade.toUpperCase()}.xlsx`;
        anchor.click();
        window.URL.revokeObjectURL(url);
    };

    const addOa = () => {
        const currentOas = formik.values.oa.map(o => {
            return {
                id: 'oa-' + grade.toLowerCase() + '-' + getRandomKey(),
                ambitoSeleccionado: formik.values.ambit,
                nucleoSeleccionado: formik.values.core,
                oaSeleccionado: o,
            }
        })
        setAddedOas(addedOas.concat(currentOas))
        formik.values.ambit = ''
        formik.values.core = ''
        formik.values.oa = []
    }
    

    const getCurrentPlanningMedium = planningMediums.filter(planning => {
        return planning.current
    })

    const removeOa = (oa) => {
        const newOas = addedOas.filter((_, index) => {
            return index !== oa
        })
        setAddedOas(newOas)
    }

    return (
        <form onSubmit={formik.handleSubmit}>
            <div className="formgrid grid">
                {getCurrentPlanningMedium.length === 0 &&
                    <div className="field col">
                        Necesitas crear una planificación de mediano plazo para crear una de corto plazo
                    </div>
                }
                {getCurrentPlanningMedium.length > 1 &&
                    <div className="field col">
                        Existe mas de una planificación de mediano plazo. Debe ser solo una la planificación activa.
                    </div>
                }
                {getCurrentPlanningMedium.length === 1 &&
                    <div className="field col">
                        <h2>Proyecto
                            Eje {getCurrentPlanningMedium[0].data && getCurrentPlanningMedium[0].data.name}</h2>
                        <div className="flex-auto mb-4">
                            <label htmlFor="ambit" className="font-bold block mb-2">Fecha</label>
                            <div className='p-inputgroup w-full'>
                                <Calendar dateFormat='dd/mm/yy' id='select-date' name='date'
                                          value={formik.values.date}
                                          onChange={(e) => {
                                              formik.setFieldValue('date', e.target.value);
                                          }}
                                          className={classNames({'p-invalid': isFormFieldInvalid('date')})}
                                          placeholder='Selecciona una fecha'
                                          style={{width: '272px'}}
                                          locale='es' showIcon/>
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
                                    selectedItemsLabel={'{0} Objetivos seleccionados'}
                                    placeholder="Selecciona objetivos"
                                    maxSelectedLabels={0}
                                    className={classNames({'p-invalid': isFormFieldInvalid('oa')})}

                                />
                            </div>
                        </div>
                        <Button type='button' label='Añadir OA' severity='success' className='w-full mb-4'
                                onClick={() => addOa()}/>
                        <div className="flex-auto mb-4">
                            <label htmlFor="resources" className="font-bold block mb-2">Recursos</label>
                            <div className='p-inputgroup w-full'>
                                <InputTextarea
                                    id="resources"
                                    name="resources"
                                    value={formik.values.resources}
                                    onChange={(e) => {
                                        formik.setFieldValue('resources', e.target.value);
                                    }}
                                    placeholder="Recursos"
                                    className={classNames({'p-invalid': isFormFieldInvalid('resources')})}
                                />
                            </div>
                        </div>
                        <div className="flex-auto mb-4">
                            <label htmlFor="week" className="font-bold block mb-2">Instrumentos de evaluación</label>
                            <div className='p-inputgroup w-full'>
                                <InputTextarea
                                    id="instruments"
                                    name="instruments"
                                    value={formik.values.instruments}
                                    onChange={(e) => {
                                        formik.setFieldValue('instruments', e.target.value);
                                    }}
                                    placeholder="Instrumentos de evaluación"
                                    className={classNames({'p-invalid': isFormFieldInvalid('instruments')})}
                                />
                            </div>
                        </div>
                        <div className="flex-auto mb-4">
                            <label htmlFor="week" className="font-bold block mb-2">Inicio, desarrollo y cierre</label>
                            <div className='p-inputgroup w-full'>
                                <InputTextarea
                                    id="init"
                                    name="init"
                                    value={formik.values.init}
                                    onChange={(e) => {
                                        formik.setFieldValue('init', e.target.value);
                                    }}
                                    placeholder="Cierre del proyecto"
                                    className={classNames({'p-invalid': isFormFieldInvalid('init')})}
                                />
                            </div>
                        </div>
                        {getFormErrorMessage('date')}
                        {getFormErrorMessage('ambit')}
                        {getFormErrorMessage('core')}
                        {getFormErrorMessage('oa')}
                        <Button type='submit' label='Guardar planificación' severity='success' style={{width: '100%'}}/>
                    </div>
                }
                <div className="field col">
                    {/* vista previa de los oas */}
                    <PreviewOas addedOas={addedOas} removeOa={removeOa}/>
                    <br/>

                    {/* Botón de descarga - siempre visible si hay planificaciones */}
                    {planningShorts.length > 0 && (
                        <div className="mb-4">
                            <Button 
                                type="button" 
                                onClick={exportToExcel}
                                label="Descargar planificaciones históricas" 
                                severity="info" 
                                className="w-full"
                            />
                        </div>
                    )}

                    {/* lista de planificaciones corto plazo existentes */}
                    {filterPlannings.length > 0 && (
                        <div className="card text-xs">
                            <TreeTable 
                                selectionMode="single" 
                                value={filterPlannings}
                                tableStyle={{minWidth: '50rem', fontSize: '12px'}}
                                loading={planningShortsLoading} 
                                header="Planificaciones corto plazo"
                            >
                                <Column 
                                    field="name" 
                                    header="Planificaciones corto plazo (activas de la semana)"
                                    body={isCurrent} 
                                    expander
                                />
                                <Column 
                                    body={actionTemplate} 
                                    headerClassName="w-10rem" 
                                />
                            </TreeTable>
                        </div>
                    )}
                    {filterPlannings.length === 0 &&
                        <div className="field col">
                            No hay planificaciones de corto plazo para esta semana
                        </div>
                    }
                </div>
            </div>
        </form>

    )
};

export default LandingPlanningShort;