import React, {useEffect, useState, useContext} from 'react';
import {Calendar} from 'primereact/calendar';
import {Fieldset} from 'primereact/fieldset';
import PlanningContext from "@/context/planning/Planning.context";
import Loading from "@/components/commons/Loading/Loading";
import {capitalize} from "@/utils/formats";

const GetTel = ({grade}) => {
    const [date, setDate] = useState(new Date());

    const {
        getRegisters,
        registers,
        registersLoading,
        lectionariesError,
    } = useContext(PlanningContext);

    console.log(registers)

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

                    return <Fieldset key={index} className='mb-3' legend={date}>
                        <p className="m-0">
                            <strong>Modalidad:</strong> {lectionary.modalidad}
                        </p>
                        <p className="m-0">
                            <strong>Alumnos: </strong> {
                            lectionary.alumnos && lectionary.alumnos.map((students) => {
                                return capitalize(students.alumnoSeleccionado) + ', '
                            })
                        }
                        </p>
                        <p className="m-0">
                            <strong>Contenidos: </strong>{
                            lectionary.contenidos && lectionary.contenidos.map((content) => {
                                return `(${content.contenido.ambito}) ${content.contenido.contenido}, `
                            })
                        }
                        </p>
                        <p className="m-0">
                            <strong>Observaciones:</strong> {lectionary.observaciones}
                        </p>
                    </Fieldset>
                })
            }

        </div>
    );
};

export default GetTel;