import React, {useContext} from "react";
import {Chip} from "primereact/chip";
import {Button} from "primereact/button";
import PlanningContext from "@/context/planning/Planning.context";

export const isCurrent = (node) => {
    let {name} = node.data;
    let {current} = node;
    let fontWeight = current ? 'bold' : 'normal';

    return <span style={{fontWeight: fontWeight}}>
        {name}
        {
            current &&
            <Chip style={{marginLeft: '10px', backgroundColor: 'green', color: 'white', fontSize: '10px'}}
                  label="En curso"/>
        }
        </span>;
}

export const ButtonFinish = (node) => {
    const {
        editPlanningMedium,
    } = useContext(PlanningContext);

    const handleFinish = (e) => {
        e.preventDefault();
        editPlanningMedium(node.id)
    }
    let {current} = node;
    return current &&
        <Button severity="danger" style={{marginRight: '10px', fontSize: '10px'}}
                label="Finalizar" onClick={handleFinish}/>
}

