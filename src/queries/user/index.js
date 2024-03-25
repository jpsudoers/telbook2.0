import React from 'react';
import {collection, getDocs, query, where, FieldPath} from 'firebase/firestore';
import {db} from '@/firebase_setup/firebase';

export const getUserQuery = async (uid) => {
    const q = query(collection(db, 'users'), where('__name__', '==', uid));
    const querySnapshot = await getDocs(q);
    let userArray = [];
    querySnapshot.forEach((doc) => {
        userArray.push(doc.data())
    });
    return userArray[0]
}