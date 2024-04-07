import {Fieldset} from 'primereact/fieldset';
import {Button} from 'primereact/button';
import { Accordion, AccordionTab } from 'primereact/accordion';

const LandingTEL = ({addedOas, removeOa}) => {
    return (
        <>
            {addedOas.length > 0 && (
                <>
                    <strong>Nuevo registro:</strong><br/><br/>
                </>
            )}
            <Accordion multiple activeIndex={null} className='mb-4'>
                {addedOas.map((oa, index) => {
                    return (
                        <AccordionTab key={index} header={`Contenido #${index + 1}`}>
                            <p className="m-0">
                                <strong>Modalidad:</strong> {oa.modalidad}
                            </p>
                            <p className="m-0">
                                <strong>Alumnos:</strong>
                            </p>
                            <ul>
                                {oa.alumnos && oa.alumnos.map((item, index) => {
                                    return (
                                        <li key={index}>
                                            <p className="m-0">
                                                {item.alumnoSeleccionado}
                                            </p>
                                        </li>
                                    )
                                })}
                            </ul>
                            <p className="m-0">
                                <strong>Contenidos:</strong>
                            </p>
                            <ul>
                                {oa.contenidos && oa.contenidos.map((item, index) => {
                                    return (
                                        <li key={index}>
                                            <p className="m-0">
                                                <strong>{item.contenido.ambito}</strong> {item.contenido.contenido}
                                            </p>
                                        </li>
                                    )
                                })}
                            </ul>
                            <Button type='button' label='Remover' severity='warning' onClick={() => removeOa(index)}/>
                        </AccordionTab>
                    )
                })}
            </Accordion>
        </>
    )
};

export default LandingTEL;