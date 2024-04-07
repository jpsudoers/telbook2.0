import React, {useEffect, useState, useContext} from 'react';
import {Calendar} from 'primereact/calendar';
import {Fieldset} from 'primereact/fieldset';
import PlanningContext from "@/context/planning/Planning.context";
import Loading from "@/components/commons/Loading/Loading";
import {capitalize} from "@/utils/formats";
import { Accordion, AccordionTab } from 'primereact/accordion';

const GetTel = ({grade}) => {
    const [date, setDate] = useState(new Date());

    const {
        getRegisters,
        registers,
        registersLoading,
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

    if (registersLoading) {
        return <Loading/>
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

                    // Si es un leccionario antiguo
                    // ó si es un leccionario nuevo (con multiples oas)
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
                            </p>
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
                        </Fieldset>
                    );
                })
            }

        </div>
    );
};

export default GetTel;