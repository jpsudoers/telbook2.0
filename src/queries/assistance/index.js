import React from 'react';
import {collection, doc, getDocs, query, setDoc, where} from 'firebase/firestore';
import {db} from '@/firebase_setup/firebase';
import {getAllDaysInMonth} from "@/utils/date";

export const setAttendanceQuery = async (data) => {
    return await setDoc(doc(db, "asistencias", data.id), data);
}

export const getAttendanceByDateQuery = async (grade) => {
    let prev = new Date(),
        post = new Date();

    prev.setHours(0, 0, 0, 0)
    post.setHours(23, 59, 59, 0)

    const q = query(collection(db, 'asistencias'),
        where("publishedAt", "<", post),
        where("publishedAt", ">=", prev),
        where("curso", "==", grade)
    );
    const querySnapshot = await getDocs(q);
    let attendancesArray = [];
    querySnapshot.forEach((doc) => {
        attendancesArray.push(doc.data())
    });

    return attendancesArray
}

export const getAttendanceByMonthQuery = async (grade, month, year) => {
    const daysInMonth = getAllDaysInMonth(month + 1, year);

    let prev = new Date(year, month, 1),
        post = new Date(year, month, daysInMonth.length);

    prev.setHours(0, 0, 0, 0)
    post.setHours(23, 59, 59, 0)

    const q = query(collection(db, 'asistencias'),
        where("publishedAt", "<", post),
        where("publishedAt", ">", prev),
        where("curso", "==", grade)
    );
    const querySnapshot = await getDocs(q);
    let attendancesArray = [];
    querySnapshot.forEach((doc) => {
        attendancesArray.push(doc.data())
    });

    return attendancesArray
}