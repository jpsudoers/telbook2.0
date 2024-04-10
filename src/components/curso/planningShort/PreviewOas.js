import {Button} from 'primereact/button';
import { Accordion, AccordionTab } from 'primereact/accordion';

const PreviewOas = ({addedOas, removeOa}) => {
    return  (
        <>
            {addedOas.length > 0 && (
            <>
                <strong>Nuevo registro:</strong><br/><br/>
            </>
            )}
            <Accordion multiple activeIndex={null} className='mb-4'>
                {addedOas.map((oa, index) => {
                    return (
                        <AccordionTab key={index} header={`OA #${index + 1}`}>
                            <p className="m-0">
                                <strong>Ambito:</strong> {oa.ambitoSeleccionado}
                            </p>
                            <p className="m-0">
                                <strong>Nucleo:</strong> {oa.nucleoSeleccionado}
                            </p>
                            <p className="m-0">
                                <strong>OA:</strong> {oa.oaSeleccionado}
                            </p><br/>
                            <Button type='button' label='Remover' severity='warning' onClick={() => removeOa(index)}/>
                        </AccordionTab>
                    )
                })}
            </Accordion>
        </>
    )
}

export default PreviewOas;