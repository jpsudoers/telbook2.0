import React, {useContext, useRef} from "react";
import {ConfirmDialog, confirmDialog} from 'primereact/confirmdialog';
import {Toast} from 'primereact/toast';
import {Chip} from "primereact/chip";
import {Button} from "primereact/button";
import PlanningContext from "@/context/planning/Planning.context";

export const IsCurrent = (node) => {
    const toast = useRef(null);
    const {
        getPlanningMediums,
        deletePlanningMedium,
        editPlanningMedium,
    } = useContext(PlanningContext);
    let {name} = node.data;
    let {current} = node;
    let fontWeight = current ? 'bold' : 'normal';

    const handleFinish = (e) => {
        confirmDialog({
            message: '¿Estás seguro/a que deseas cerrar esta planificación?',
            header: 'Confirmación',
            icon: 'pi pi-exclamation-triangle',
            defaultFocus: 'accept',
            accept,
            reject,
            acceptLabel: 'Si',
            rejectLabel: 'No'
        });
    }

    const accept = () => {
        editPlanningMedium(node.id)
        toast.current.show({severity: 'success', summary: 'Confirmed', detail: 'Planificación cerrada', life: 3000});
    }

    const reject = () => {
        toast.current.show({
            severity: 'info',
            summary: 'Planificacion abierta',
            detail: 'Planificación continua activa',
            life: 3000
        });
    }

    const planningIsFromCurrentDay = () => {
        const planningDate = new Date(node?.date?.seconds * 1000); // Convert seconds to milliseconds
        const currentDate = new Date();
        if (planningDate.getFullYear() === currentDate.getFullYear() &&
            planningDate.getMonth() === currentDate.getMonth() &&
            planningDate.getDate() === currentDate.getDate()) {
            return true;
        }
        return false;
    }

    const handleRemove = () => {
        confirmDialog({
            message: '¿Estás seguro/a que deseas eliminar esta planificación?',
            header: 'Confirmación',
            icon: 'pi pi-exclamation-triangle',
            defaultFocus: 'accept',
            accept: acceptRemove,
            reject: rejectRemove,
            acceptLabel: 'Si',
            rejectLabel: 'No'
        });
    }

    const acceptRemove = async () => {
        await deletePlanningMedium(node.id)
        await getPlanningMediums(node.grade);
    }

    const rejectRemove  = () => {}

    return <span style={{
        fontWeight: fontWeight,
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        justifyContent: 'space-between'
    }}>
        {name}
        {
            current &&
            <span style={{display: 'flex'}}>
                            <Toast ref={toast}/>
                <ConfirmDialog/>
                <Chip style={{marginLeft: '10px', backgroundColor: 'green', color: 'white', fontSize: '10px'}}
                      label="En curso"/>
                <Button severity="danger" style={{fontSize: '10px', marginLeft: '10px'}}
                        label="Finalizar" onClick={handleFinish}/>
                {planningIsFromCurrentDay() &&
                    <Button severity="warning" style={{fontSize: '10px', marginLeft: '10px'}}
                    label="Eliminar" onClick={handleRemove} type="button"/>
                }
            </span>
        }
        </span>;
}

