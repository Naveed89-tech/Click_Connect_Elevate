// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAF8WEDnLiu7_b3G3br8CMsBFAPxPz1DI8",
  authDomain: "clickconnectelevate.firebaseapp.com",
  projectId: "clickconnectelevate",
  storageBucket: "clickconnectelevate.firebasestorage.app",
  messagingSenderId: "394779325425",
  appId: "1:394779325425:web:727c5156956f2c63c7ca50",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
