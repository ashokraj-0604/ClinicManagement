const firebaseConfig = {
    apiKey: "AIzaSyDbUGT0C8pZPYyn9G61DlBSDVOob2Qzxxc",
    authDomain: "clinicmanager-72e37.firebaseapp.com",
    projectId: "clinicmanager-72e37",
    storageBucket: "clinicmanager-72e37.appspot.com",
    messagingSenderId: "438961594747",
    appId: "1:438961594747:web:a7666784f034ff247addde",
    measurementId: "G-WMXJS6JTG8"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();