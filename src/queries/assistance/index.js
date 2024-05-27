import React from 'react';
import {collection, doc, getDocs, query, setDoc, where, updateDoc, arrayUnion} from 'firebase/firestore';
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

export const updateAttendancesQuery = async (payload) => {
    
    // const payload = [
    //     {
    //       alumnos: [
    //         {
    //           presente: 1,
    //           run: "22068250-1",
    //         },
    //       ],
    //       curso: "XXX-2NTB",
    //       day: "14",
    //       month: "03",
    //       year: "2024",
    //     },
    //     {
    //       alumnos: [
    //         {
    //           presente: 0,
    //           run: "22068250-1",
    //         },
    //       ],
    //       curso: "XXX-2NTB",
    //       day: "19",
    //       month: "03",
    //       year: "2024",
    //     },
    //     {
    //       alumnos: [
    //         {
    //           presente: 1,
    //           run: "22068250-1",
    //         },
    //       ],
    //       curso: "XXX-2NTB",
    //       day: "20",
    //       month: "03",
    //       year: "2024",
    //     },
    //     {
    //       alumnos: [
    //         {
    //           presente: 1,
    //           run: "22068250-1",
    //         },
    //       ],
    //       curso: "XXX-2NTB",
    //       day: "21",
    //       month: "03",
    //       year: "2024",
    //     },
    //     {
    //       alumnos: [
    //         {
    //           presente: 0,
    //           run: "22068250-1",
    //         },
    //         {
    //           presente: 1,
    //           run: "26597926-2",
    //         },
    //         {
    //           presente: 0,
    //           run: "26373103-4",
    //         },
    //       ],
    //       curso: "XXX-2NTB",
    //       day: "22",
    //       month: "03",
    //       year: "2024",
    //     },
    //   ]

    for (const asistencia of payload) {
        const { day, month, year, curso, alumnos } = asistencia;
        const q = query(collection(db, 'asistencias'),
            where("day", "==", day),
            where("month", "==", month),
            where("year", "==", year),
            where("curso", "==", curso)
        );
        const querySnapshot = await getDocs(q);

        if(querySnapshot.empty) { // si es que no existe la asistencia se crea
            // var data = asistencia
            const itemToAppend = {
                user: asistencia?.run,
                otp: asistencia?.otp,
                date: `${year}-${month}-${day}`,
                comment: asistencia?.comment
            }
            // data.updated = [itemToAppend]
            await setDoc(doc(db, "asistencias", asistencia.id), { ...asistencia, updated: [itemToAppend] });
        }

        else { // si ya existe se actualiza
            querySnapshot.forEach(async (doc) => {
                await updateDoc(doc.ref, { alumnos });
                const itemToAppend = {
                    user: asistencia?.run,
                    otp: asistencia?.otp,
                    date: `${year}-${month}-${day}`
                }
                await updateDoc(doc.ref, { updated: arrayUnion(itemToAppend) });
            });
        }
    }
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