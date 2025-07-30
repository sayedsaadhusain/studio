// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD9yy55SQbPGOKU5B7yvyv8Bw_7WBrYkNs",
  authDomain: "billbook-88271.firebaseapp.com",
  projectId: "billbook-88271",
  storageBucket: "billbook-88271.firebasestorage.app",
  messagingSenderId: "643459197202",
  appId: "1:643459197202:web:40a11ba4b8765912226bcb",
  measurementId: "G-L48LNN1C02"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { app, db };
