

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBOZf7JKBn4gv3ONORkjtlDn1-pSar_LKc",
  authDomain: "clinicmanagementsystem-72d34.firebaseapp.com",
  projectId: "clinicmanagementsystem-72d34",
  storageBucket: "clinicmanagementsystem-72d34.firebasestorage.app",
  messagingSenderId: "282804166043",
  appId: "1:282804166043:web:b227e1301e84784395953e",
  measurementId: "G-FP7R1ZB656"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);