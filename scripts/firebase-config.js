// firebase-config.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCubhQRka_IMahsXQs7FCDuKXcRZH35KQU",
  authDomain: "clinicmanagementsys.firebaseapp.com",
  projectId: "clinicmanagementsys",
  storageBucket: "clinicmanagementsys.firebasestorage.app",
  messagingSenderId: "182742574619",
  appId: "1:182742574619:web:fd759ba586dacf4637babe",
  measurementId: "G-WYF5BTTBFD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getDatabase(app);

export { db }; // Export `db` for reuse


