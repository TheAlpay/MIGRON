import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyB1fJKRXyJ1S1Lw0ezVq3eQxeawQXlbZrY",
    authDomain: "migron-32348.firebaseapp.com",
    projectId: "migron-32348",
    storageBucket: "migron-32348.firebasestorage.app",
    messagingSenderId: "482819244513",
    appId: "1:482819244513:web:7a4f8324c8227c760052a0",
    measurementId: "G-EDH8YQ70PQ"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export default app;
