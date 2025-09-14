// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyANrqYmFr4BhnPEnYu_rnPNK8bT-J3q5k4",
    authDomain: "skillforge-90d9d.firebaseapp.com",
    projectId: "skillforge-90d9d",
    storageBucket: "skillforge-90d9d.firebasestorage.app",
    messagingSenderId: "702826436758",
    appId: "1:702826436758:web:d42ba4d0568617a9468ab7",
    measurementId: "G-0KSJGSP14F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);