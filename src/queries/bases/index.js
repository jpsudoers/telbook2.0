import React from 'react';
import {collection, getDocs, query, where, or} from 'firebase/firestore';
import {db} from '@/firebase_setup/firebase';

export const getBases = async (level) => {
    const q = query(collection(db, 'basesCurriculares'), where('nivel', '==', level));
    const querySnapshot = await getDocs(q);
    let basesArray = [];
    querySnapshot.forEach((doc) => {
        basesArray.push(doc.data())
    });
    return basesArray
}

export const getSpeechBasesQuery = async (level) => {
    let mask;
    switch (level) {
        case 'MM':
            mask = 'Medio Mayor'
            break;
        case 'PNT':
            mask = 'Pre Kinder'
            break;
        case '2NT':
            mask = 'Kinder'
            break;
    }
    const q = query(collection(db, 'basesFonoaudiologicas'), or(where('nivel', '==', mask), where('nivel', '==', 'Todos los niveles')));
    const querySnapshot = await getDocs(q);
    let basesArray = [];
    querySnapshot.forEach((doc) => {
        basesArray.push(doc.data())
    });
    return basesArray
}