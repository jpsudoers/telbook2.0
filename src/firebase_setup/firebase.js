import {initializeApp} from "firebase/app";
import {getFirestore} from "firebase/firestore";
import {getAuth} from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyB9qZCBlD2PugpwUoqvpGPiWkYMEoly924",
    authDomain: "telbookproductivo.firebaseapp.com",
    databaseURL: "https://telbookproductivo-default-rtdb.firebaseio.com",
    projectId: "telbookproductivo",
    storageBucket: "telbookproductivo.appspot.com",
    messagingSenderId: "825343753624",
    appId: "1:825343753624:web:ce38332ee4d85ca11dffed",
    measurementId: "G-NN0LRED7TE"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
