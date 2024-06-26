import React, {useEffect, useState, useContext} from 'react';
import {Calendar} from 'primereact/calendar';
import {Fieldset} from 'primereact/fieldset';
import PlanningContext from "@/context/planning/Planning.context";
import Loading from "@/components/commons/Loading/Loading";
import {capitalize} from "@/utils/formats";
import { Accordion, AccordionTab } from 'primereact/accordion';
import {Button} from 'primereact/button';
import {Column} from 'primereact/column';

const GetTel = ({grade}) => {
    const [date, setDate] = useState(new Date());

    const {
        getRegisters,
        registers,
        registersLoading,
        deleteRegister,
        lectionariesError,
    } = useContext(PlanningContext);


    useEffect(() => {
        getRegisters(grade.toUpperCase())
    }, [])

    const filterLectionaries = registers.filter(lectionary => {
        const year = lectionary.publishedAt.toDate().getFullYear()
        const month = lectionary.publishedAt.toDate().getUTCMonth()
        const currentYear = new Date(date).getFullYear()
        const currentMonth = new Date(date).getUTCMonth()

        if (year === currentYear && month === currentMonth) {
            return lectionary
        }
    })

    const removeOa = async (lectionary) => {
        await deleteRegister(lectionary.id)
        await getRegisters(grade.toUpperCase())
    }

    if (registersLoading) {
        return <Loading/>
    }

    // JPS Se reutiliza variable que trae solo el día para eliminar

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

    // JPS termino de la varible.

    const planningIsFromCurrentDay = (item) => {
        const lectionary = new Date(item.publishedAt.seconds * 1000); // Convert seconds to milliseconds
        const currentDate = new Date();
        if (lectionary.getFullYear() === currentDate.getFullYear() &&
            lectionary.getMonth() === currentDate.getMonth() &&
            lectionary.getDate() === currentDate.getDate()) {
            return true;
        }
        return false;
    }

    return (
        <div>
            <Calendar className='mb-3' value={date} onChange={(e) => setDate(e.value)} showIcon view="month"
                      dateFormat="mm/yy"/>

            {
                filterLectionaries && filterLectionaries.map((lectionary, index) => {
                    const dayName = lectionary.publishedAt.toDate().toLocaleDateString('es-CL', {
                        weekday: 'long',
                        timeZone: 'UTC'
                    })
                    const day = lectionary.publishedAt.toDate().getUTCDate()
                    const year = lectionary.publishedAt.toDate().getFullYear()
                    const monthName = lectionary.publishedAt.toDate().toLocaleDateString('es-CL', {month: 'long'})
                    const date = dayName + " " + day + " de " + monthName + " de " + year;

                    // Si es un leccionario antiguo (caso if)
                    // ó si es un leccionario nuevo (con multiples oas) (caso else)
                    // esto debido a que el formato de los leccionarios antiguos es diferente al de los nuevos. los nuevos tienen multiples contenidos 
                    return !Object.hasOwn(lectionary, 'contenidosTel') ? (
                        <Fieldset key={index} className='mb-3' legend={date}>
                            <p className="m-0">
                                <strong>Modalidad:</strong> {lectionary.modalidad}
                            </p><br/>
                            <p className="m-0">
                                <strong>Observaciones:</strong> {lectionary.observaciones}
                            </p><br/>
                            <p className="m-0">
                                <strong>Alumnos:</strong> {
                                lectionary.alumnos && lectionary.alumnos.map((alumno) => {
                                    return <p key={alumno}>{alumno.alumnoSeleccionado}</p>
                                })
                                }
                            </p>
                            <p className="m-0">
                                <strong>Contenidos:</strong> {
                                lectionary.contenidos && lectionary.contenidos.map((contenido) => {
                                    return <p key={contenido}>
                                        ({contenido.contenido.ambito}) {contenido.contenido.contenido}
                                    </p>
                                })
                                }
                            </p><br/>

                            <Column body={actionTemplate} headerClassName="w-10rem" />         
                             {/* <Button type='button' label='Eliminar' severity='danger' onClick={() => removeOa(lectionary)}/> */} 
                        </Fieldset>
                    ) : (
                        <Fieldset key={index} className='mb-3' legend={date}>
                            <p className="m-0">
                                <strong>Observaciones:</strong> {lectionary.observaciones}
                            </p><br/>
                            <Accordion multiple activeIndex={null} className='mb-4'>
                            {
                                // POR CADA OA
                                lectionary.contenidosTel && lectionary.contenidosTel.map((oa, index) => {
                                    return (
                                        <AccordionTab key={index + 1} header={`Contenido #${index + 1}`}>
                                            <p className="m-0">
                                                <strong>Modalidad:</strong> {oa.modalidad}
                                            </p><br/>

                                            <p className="m-0" >
                                                <strong>Alumnos: </strong><br/> {
                                                // POR CADA ALUMNO EN EL OA
                                                oa.alumnos && oa.alumnos.map((alumno) => {
                                                    return <p key={alumno}>{alumno.alumnoSeleccionado}</p>
                                                })
                                            }
                                            </p><br/>

                                            <p className="m-0">
                                            <strong>Contenidos: </strong><br/> {
                                                // POR CADA CONTENIDO EN EL OA
                                                oa.contenidos && oa.contenidos.map((contenido) => {
                                                    return <p key={contenido}>({contenido.contenido.ambito}) {contenido.contenido.contenido}</p>
                                                })
                                            }
                                            </p>
                                        </AccordionTab>
                                    )
                                })
                            }
                            </Accordion>

                            {planningIsFromCurrentDay(lectionary) &&
                                <Button type='button'
                                        label='Eliminar'
                                        severity='danger'
                                        onClick={() => removeOa(lectionary)}
                                />
                            }
                        </Fieldset>
                    );
                })
            }

        </div>
    );
};

export default GetTel;