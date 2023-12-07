import React from 'react';
import {collection, doc, getDocs, query, addDoc, where, setDoc} from 'firebase/firestore';
import {db} from '@/firebase_setup/firebase';

export const getStudentsBySchoolQuery = async (school) => {
    const q = query(collection(db, 'alumnos'), where('curso', '>=', school), where('curso', '<', school + ''));
    const querySnapshot = await getDocs(q);
    let studentsArray = [];
    querySnapshot.forEach((doc) => {
        studentsArray.push(doc.data())
    });
    return studentsArray
}

export const setStudentQuery = async (student) => {
    const docRef = await addDoc(collection(db, 'alumnos'), student);
    return {
        ...student,
        id: docRef.id
    }
}

export const setObservationQuery = async (data) => {
    return await setDoc(doc(db, "observacionesFonoaudiologicas", data.id), data);
}

export const setSchoolRegisterQuery = async (data) => {
    return await setDoc(doc(db, "registrosConvivenciaEscolar", data.id), data);
}

export const getObservationByIdQuery = async (id) => {
    const q = query(collection(db, 'observacionesFonoaudiologicas'), where('alumnoRun', '==', id));
    const querySnapshot = await getDocs(q);
    let studentsArray = [];
    querySnapshot.forEach((doc) => {
        studentsArray.push(doc.data())
    });
    return studentsArray
}

export const getSchoolRegistersByIdQuery = async (id) => {
    console.log(id)
    const q = query(collection(db, 'registrosConvivenciaEscolar'), where('alumnoId', '==', id));
    const querySnapshot = await getDocs(q);
    let studentsArray = [];
    querySnapshot.forEach((doc) => {
        studentsArray.push(doc.data())
    });
    console.log(studentsArray)
    return studentsArray
}