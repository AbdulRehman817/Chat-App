// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // ✅ Import Firestore

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAVQNb9e2onVkGVCXPd-Tlau64lepPYoSQ",
  authDomain: "chat-app-151f6.firebaseapp.com",
  projectId: "chat-app-151f6",
  storageBucket: "chat-app-151f6.appspot.com", // ✅ fixed typo from .app to .com
  messagingSenderId: "273124562957",
  appId: "1:273124562957:web:dd2301014e6cff7a4c5d44",
  measurementId: "G-SJSEM31VG5",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Auth setup
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Firestore setup
const db = getFirestore(app); // ✅ Add this line

// Export
export { auth, googleProvider, db }; // ✅ Now db is available
