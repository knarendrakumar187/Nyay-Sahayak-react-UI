// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDgsaAkfiOsCkDI1cj4mpTyI1jkNxGsX4o",
  authDomain: "nyay-sahayak12.firebaseapp.com",
  projectId: "nyay-sahayak12",
  storageBucket: "nyay-sahayak12.firebasestorage.app",
  messagingSenderId: "742045216501",
  appId: "1:742045216501:web:11c54ec33691771149dfbc",
  measurementId: "G-7HLZEPS1TD",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
