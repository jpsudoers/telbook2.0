import React from 'react';
import {collection, getDocs, query, where} from 'firebase/firestore';
import {db} from '@/firebase_setup/firebase';

export const getGradesQuery = async (establecimiento) => {
    const q = query(collection(db, 'cursos'), where('establecimiento', '==', establecimiento));
    const querySnapshot = await getDocs(q);
    let gradesArray = [];
    querySnapshot.forEach((doc) => {
        gradesArray.push(doc.data())
    });
    console.log('cursos =', gradesArray)
    return gradesArray
}