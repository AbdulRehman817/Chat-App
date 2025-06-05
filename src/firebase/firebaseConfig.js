// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // ✅ Import storage
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAVQNb9e2onVkGVCXPd-Tlau64lepPYoSQ",
  authDomain: "chat-app-151f6.firebaseapp.com",
  projectId: "chat-app-151f6",
  storageBucket: "chat-app-151f6.appspot.com",
  messagingSenderId: "273124562957",
  appId: "1:273124562957:web:dd2301014e6cff7a4c5d44",
  measurementId: "G-SJSEM31VG5",
  databaseURL: "https://chat-app-151f6-default-rtdb.firebaseio.com",
};

// Initialize yFirebase
const app = initializeApp(firebaseConfig);
const rtdb = getDatabase(app);
// Auth
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Firestore
const db = getFirestore(app);

// Storage
const storage = getStorage(app); // ✅ Initialize storage

// Export everything
export { auth, googleProvider, db, storage, rtdb }; // ✅ Export storage
