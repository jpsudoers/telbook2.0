import React from 'react';
import {collection, deleteDoc, doc, getDocs, query, setDoc, updateDoc, where} from 'firebase/firestore';
import {db} from '@/firebase_setup/firebase';

export const getPlanningMediumByGradeQuery = async (grade) => {
    const q = query(collection(db, 'planificacionesMedianoPlazo'), where('curso', '==', grade));
    const querySnapshot = await getDocs(q);
    let planningMediumArray = [];
    querySnapshot.forEach((doc) => {
        planningMediumArray.push(doc.data())
    });
    return planningMediumArray
}

export const getRegisterQuery = async (grade) => {
    const q = query(collection(db, 'registrosFonoaudiologicos'), where('curso', '==', grade));
    const querySnapshot = await getDocs(q);
    let lectionaries = [];
    querySnapshot.forEach((doc) => {
        lectionaries.push(doc.data())
    });
    return lectionaries
}

export const getPlanningLargeByGradeQuery = async (grade) => {
    const q = query(collection(db, 'planificacionesLargoPlazo'), where('curso', '==', grade));
    const querySnapshot = await getDocs(q);
    let planningLargeArray = [];
    querySnapshot.forEach((doc) => {
        planningLargeArray.push(doc.data())
    });
    return planningLargeArray
}

export const getPlanningShortByGradeQuery = async (grade) => {
    const q = query(collection(db, 'planificacionesCortoPlazo'), where('curso', '==', grade));
    const querySnapshot = await getDocs(q);
    let planningShortArray = [];
    querySnapshot.forEach((doc) => {
        planningShortArray.push(doc.data())
    });
    return planningShortArray
}

export const getLectionaryByIdQuery = async (id) => {
    const q = query(collection(db, 'evaluacionesLeccionario'), where('planificacionId', '==', id));
    const querySnapshot = await getDocs(q);
    let lectionaries = [];
    querySnapshot.forEach((doc) => {
        lectionaries.push(doc.data())
    });
    return lectionaries[0] || ''
}

export const getPlanningShortByGradeByDateQuery = async (grade, date) => {
    const q = query(collection(db, 'planificacionesCortoPlazo'), where('curso', '==', grade), where("fecha", "==", date));
    const querySnapshot = await getDocs(q);
    const planningShortArray = [];
    querySnapshot.forEach((doc) => {
        planningShortArray.push(doc.data())
    });

    return Promise.all(planningShortArray.map(async planning => {
        const q2 = query(collection(db, 'evaluacionesLeccionario'), where('planificacionId', '==', planning.id));
        const querySnapshot2 = await getDocs(q2);
        let lectionaries = [];
        querySnapshot2.forEach((doc) => {
            lectionaries.push(doc.data())
        });
        return {
            ...planning,
            observacion:lectionaries[0] && lectionaries[0].comentario || '',
            evaluacion: lectionaries[0] && lectionaries[0].evaluacion || ''
        }
    }));
}

export const setPlanningLargeByGradeQuery = async (data) => {
    return await setDoc(doc(db, "planificacionesLargoPlazo", data.id), data);
}

export const setPlanningMediumQuery = async (data) => {
    return await setDoc(doc(db, "planificacionesMedianoPlazo", data.id), data);
}

export const setPlanningShortQuery = async (data) => {
    return await setDoc(doc(db, "planificacionesCortoPlazo", data.id), data);
}

export const setRegisterQuery = async (data) => {
    return await setDoc(doc(db, "registrosFonoaudiologicos", data.id), data);
}

export const deleteRegisterQuery = async (id) => {
    await deleteDoc(doc(db, "registrosFonoaudiologicos", id));
}

export const setLectionaryQuery = async (data) => {
    return await setDoc(doc(db, "evaluacionesLeccionario", data.id), data);
}

export const deletePlanningLargeByGradeQuery = async (id) => {
    await deleteDoc(doc(db, "planificacionesLargoPlazo", id));
}

<<<<<<< HEAD
//Agrega query DeletingPlanningShort
=======
>>>>>>> dev
export const deletePlanningShortQuery = async (id) => {
    await deleteDoc(doc(db, 'planificacionesCortoPlazo', id));
}

export const editPlanningMediumById = async (id) => {
    const ref = doc(db, 'planificacionesMedianoPlazo', id);
    await updateDoc(ref, {
        vigencia: false
    });
}