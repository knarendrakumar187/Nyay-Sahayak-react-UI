// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth"; // 👈 Ye line check kar, honi chahiye
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyAkzSoh1gcDbveNawu8v03YiPmtfV1O9Bg",
  authDomain: "nyaysahayak-auth.firebaseapp.com",
  projectId: "nyaysahayak-auth",
  storageBucket: "nyaysahayak-auth.appspot.com",
  messagingSenderId: "838850495506",
  appId: "1:838850495506:web:378ff24c04cb89c86dc4cb"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);