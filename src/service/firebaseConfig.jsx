// src/service/firebaseConfig.jsx
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDkUF0ePQrSFuOqZNv77DMXK-_gbVX4oTQ",
  authDomain: "tripsage-99f74.firebaseapp.com",
  projectId: "tripsage-99f74",
  storageBucket: "tripsage-99f74.firebasestorage.app",
  messagingSenderId: "1051034295661",
  appId: "1:1051034295661:web:a1bc58101f150804340e64",
  measurementId: "G-EBZKY56FP1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
// Initialize Firestore
const db = getFirestore(app);

// Correctly export GoogleAuthProvider and related functions
export { auth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, db, onAuthStateChanged };
