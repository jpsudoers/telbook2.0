import React from 'react';
import {collection, doc, getDocs, query, addDoc, where, setDoc, updateDoc} from 'firebase/firestore';
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
    // SR -  validamos primero que no exista el alumno y si existe avisamos al usuario
    const q = query(collection(db, 'alumnos'), where('codigoAlumno', '==', 1), where('run', '==', student.run));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
        // avisar al usuario con un toast
        return null
    } else {
        await addDoc(collection(db, 'alumnos'), student);    
    }
    return {
        ...student,
    }
}

export const updateStudentQuery = async (id, student) => {
    const ref = doc(db, 'alumnos', id);
    await updateDoc(ref, {
        ...student
    });
}

export const removeStudentQuery = async (id) => {
    const ref = doc(db, 'alumnos', id);
    await updateDoc(ref, {
        codigoAlumno: '0'
    });
}

export const setObservationQuery = async (data) => {
    return await setDoc(doc(db, "observacionesFonoaudiologicas", data.id), data);
}

export const setSchoolRegisterQuery = async (data) => {
    return await setDoc(doc(db, "registrosConvivenciaEscolar", data.id), data);
}

export const setEvaluationsByOaQuery = async (data) => {
    return await setDoc(doc(db, "evaluacionesPorOa", data.id), data);
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
    const q = query(collection(db, 'registrosConvivenciaEscolar'), where('alumnoId', '==', id));
    const querySnapshot = await getDocs(q);
    let studentsArray = [];
    querySnapshot.forEach((doc) => {
        studentsArray.push(doc.data())
    });
    console.log(studentsArray)
    return studentsArray
}

export const getEvaluationsByOaByQuery = async (grade) => {
    const q = query(collection(db, 'evaluacionesPorOa'), where('curso', '==', grade));
    const querySnapshot = await getDocs(q);
    let studentsArray = [];
    querySnapshot.forEach((doc) => {
        studentsArray.push(doc.data())
    });
    return studentsArray
}

export const setEvaluationsQuery = async (data) => {
    const docRef = await addDoc(collection(db, 'evaluaciones'), data);
    console.info('Evaluations - Reference doc in setEvaluations', docRef)
    return {
        ...data,
        id: docRef.id
    }
}

export const getEvaluationsByQuery = async (grade) => {
    const q = query(collection(db, 'evaluaciones'), where('curso', '==', grade));
    const querySnapshot = await getDocs(q);
    let evaluationsArray = [];
    querySnapshot.forEach((doc) => {
        evaluationsArray.push(doc.data())
    });
    return evaluationsArray
}