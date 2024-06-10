import React from 'react';
import {Dropdown} from "primereact/dropdown";
import {Button} from "primereact/button";
import { InputTextarea } from 'primereact/inputtextarea';

const GetEvaluation = ({
                           state,
                           index,
                           idx,
                           handlerState,
                           students1,
                           students2,
                           handlerEvaluation,
                           getDisabled,
                           oa,
                           evaluationByOa
                       }) => {

    const isEvaluated = () => {
        const response = evaluationByOa.filter(oas => {
            return oa.id === oas.idOa
        })
        return response.length > 0
    }

    const getCurrentEvaluation = () => {
        const response = evaluationByOa.filter(oas => {
            return oa.id === oas.idOa
        })
        return response.length > 0
    }

    if (isEvaluated()) {
        return <div>
            <div className='flex text-xs'>
                {students1 && students1.map((student, key) => {
                    return <div key={key} className='mt-2 mr-1'
                                style={{width: '135px'}}>{student.name}</div>
                })}
            </div>
            <div className='flex text-xs mb-2'>
                {students1 && students1.map((student, key) => {
                    const value = evaluationByOa.filter(oas => {
                        return oas.idOa === oa.id
                    })
                    return <Dropdown
                        className='mr-1'
                        options={['L', 'D', 'NL', 'NE']}
                        key={key}
                        disabled={true}
                        style={{width: '135px', fontSize: '10px'}}
                        value={value[0].evaluaciones[student.run.replaceAll('.', '')]}
                        onChange={(e) => handlerState(e, student, index + '-' + idx)}
                    />
                })}
            </div>
            <div className='flex text-xs'>
                {students2 && students2.map((student, key) => {
                    return <div key={key} className='mt-2 mr-1'
                                style={{width: '135px'}}>{student.name}</div>
                })}
            </div>
            <div className='flex text-xs mb-2'>
                {students2 && students2.map((student, key) => {
                    const value = evaluationByOa.filter(oas => {
                        return oas.idOa === oa.id
                    })
                    return <Dropdown
                        className='mr-1'
                        options={['L', 'D', 'NL', 'NE']}
                        key={key}
                        disabled={true}
                        style={{width: '135px', fontSize: '10px'}}
                        value={value[0].evaluaciones[student.run.replaceAll('.', '')]}
                        onChange={(e) => handlerState(e, student, index + '-' + idx)}
                    />
                })}
            </div>
        </div>
    }

    return <div>
        <div className='flex text-xs'>
            {students1 && students1.map((student, key) => {
                return <div key={key} className='mt-2 mr-1'
                            style={{width: '135px'}}>{student.name}</div>
            })}
        </div>
        <div className='flex text-xs mb-2'>
            {students1 && students1.map((student, key) => {
                const value = state[index + '-' + idx] && state[index + '-' + idx][student.run.replaceAll('.', '')] || ''
                return <Dropdown
                    className='mr-1'
                    options={['L', 'D', 'NL', 'NE']}
                    key={key}
                    style={{width: '135px', fontSize: '10px'}}
                    value={value}
                    onChange={(e) => handlerState(e, student, index + '-' + idx)}
                />
            })}
        </div>
        <div className='flex text-xs'>
            {students2 && students2.map((student, key) => {
                return <div key={key} className='mt-2 mr-1'
                            style={{width: '135px'}}>{student.name}</div>
            })}
        </div>
        <div className='flex text-xs mb-2'>
            {students2 && students2.map((student, key) => {
                const value = state[index + '-' + idx] && state[index + '-' + idx][student.run.replaceAll('.', '')] || ''
                return <Dropdown
                    className='mr-1'
                    options={['L', 'D', 'NL', 'NE']}
                    key={key}
                    style={{width: '135px', fontSize: '10px'}}
                    value={value}
                    onChange={(e) => handlerState(e, student, index + '-' + idx)}
                />
            })}
        </div>
        
          {/* JPS agrego div para poner un TextArea para ingresar contenidos
        <div className='mb-3' 
       
       >
                                    <strong>Ingreso Contenidos:</strong> 
                                    </div>
                                    <div className='p-inputgroup w-full'>
                                    <InputTextarea
                                    id="resources"
                                    name="resources"
                                    //value={value}
                                    placeholder="Ingrese contenidos evaluados"
                                    />
                                    </div> */}


        <div className='mb-3' >
            <Button label='Confirmar' severity='success'
                    onClick={() => handlerEvaluation(index + '-' + idx, oa)}
                    disabled={getDisabled(index + '-' + idx)}/>
        </div>
     
       


    </div>
};

export default GetEvaluation;