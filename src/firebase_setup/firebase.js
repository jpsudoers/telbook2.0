import {initializeApp} from "firebase/app";
import {getFirestore} from "firebase/firestore";
import {getAuth} from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAjkpQhof_IxmPERltZqvd6xYJHDzNRiME",
    authDomain: "telbook2024.firebaseapp.com",
    projectId: "telbook2024",
    storageBucket: "telbook2024.appspot.com",
    messagingSenderId: "80170424653",
    appId: "1:80170424653:web:a998ad346753b4b31dbf04",
    measurementId: "G-NJMYY29W0T"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
