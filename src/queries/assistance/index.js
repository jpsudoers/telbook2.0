import React from 'react';
import {collection, doc, getDocs, query, setDoc, where} from 'firebase/firestore';
import {db} from '@/firebase_setup/firebase';
import {getAllDaysInMonth} from "@/utils/date";

export const setAttendanceQuery = async (data) => {
    return await setDoc(doc(db, "asistencias", data.id), data);
}

export const getAttendanceByDateQuery = async (grade) => {
    let day = new Date()
    const q = query(collection(db, 'asistencias'),
        where("day", "==", day.toISOString().split('T')[0].split('-')[2]),
        where("month", "==", day.toISOString().split('T')[0].split('-')[1]),
        where("year", "==", day.toISOString().split('T')[0].split('-')[0]),
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

    const q = query(collection(db, 'asistencias'),
        where("month", "==", month < 9 ? "0" + (month + 1) : (month + 1).toString()),
        where("year", "==", year.toString()),
        where("curso", "==", grade)
    );
    const querySnapshot = await getDocs(q);
    let attendancesArray = [];
    querySnapshot.forEach((doc) => {
        attendancesArray.push(doc.data())
    });

    return attendancesArray
}