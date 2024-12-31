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
import ExcelJS from 'exceljs';

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

    const handleDownloadExcel = async () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Planificaciones');

        // Agregar título y encabezado
        worksheet.mergeCells('A1:C1');
        worksheet.getCell('A1').value = `PLANIFICACIONES DE LARGO PLAZO ${grade.toUpperCase()}`;
        worksheet.getCell('A1').font = { 
            bold: true, 
            size: 14,
            color: { argb: '000000' }  // Negro
        };
        worksheet.getCell('A1').alignment = { 
            horizontal: 'center',
            vertical: 'middle'
        };
        worksheet.getRow(1).height = 30; // Altura para el título

        // Agregar fecha actual
        worksheet.mergeCells('A2:C2');
        worksheet.getCell('A2').value = `Fecha de generación: ${new Date().toLocaleDateString('es-CL')}`;
        worksheet.getCell('A2').alignment = { 
            horizontal: 'center',
            vertical: 'middle'
        };
        worksheet.getCell('A2').font = {
            size: 11,
            italic: true
        };

        // Espacio en blanco
        worksheet.addRow([]);

        // Definir las columnas con mejor formato
        worksheet.columns = [
            { header: 'Fecha', key: 'date', width: 15 },
            { header: 'Curso', key: 'curso', width: 15 },
            { header: 'Planificaciones de Largo Plazo', key: 'description', width: 85 }
        ];

        // Estilo para el encabezado
        worksheet.getRow(4).font = { bold: true };
        worksheet.getRow(4).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFE0E0E0' }
        };

        // Ordenar planificaciones por fecha
        const sortedPlannings = [...planningLarges].sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            return dateA - dateB;
        });

        // Agregar datos
        sortedPlannings.forEach(plan => {
            worksheet.addRow({
                date: plan.date,
                curso: plan.curso || grade.toUpperCase(), // Usar el curso del plan o el grade actual
                description: plan.description
            });
        });

        // Ajustar el contenido y bordes
        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber > 3) { // No aplicar a las filas de título
                row.eachCell((cell) => {
                    cell.border = {
                        top: { style: 'thin' },
                        left: { style: 'thin' },
                        bottom: { style: 'thin' },
                        right: { style: 'thin' }
                    };
                    cell.alignment = { 
                        vertical: 'middle', 
                        wrapText: true,
                        horizontal: cell.col === 1 || cell.col === 2 ? 'center' : 'left'
                    };
                });
            }
        });

        // Generar y descargar el archivo
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { 
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
        });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Planificaciones_${grade}_${new Date().toLocaleDateString('es-CL').replace(/\//g, '-')}.xlsx`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

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
                            <Column 
                                header='Descripción de la planificación' 
                                body={(rowData) => (
                                    <div>
                                        <strong>Curso: {rowData.curso}</strong>
                                        <br/>
                                        {rowData.description}
                                    </div>
                                )}
                            />
                            <Column body={actionBodyTemplate} header='Acción'/>
                        </DataTable>
                    </ScrollPanel>
                </SplitterPanel>
            </Splitter>
            <Button 
                className='mt-2' 
                type='button' 
                label='Descargar planificaciones históricas' 
                onClick={handleDownloadExcel} 
                severity='success'
                icon="pi pi-file-excel"
            />
        </>
    )
};

export default LandingPlanningLarge;