import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";

// Firebase configuration
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
const auth = getAuth(app);
const db = getFirestore(app);

// Login logic
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('errorMessage');

    try {
        // Authenticate user
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Retrieve user role from Firestore
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
            const userData = userDoc.data();
            const userRole = userData.role;

            // Redirect based on role
            if (userRole === "doctor") {
                window.location.href = "/dashboard.html";
            } else if (userRole === "receptionist") {
                window.location.href = "/receptionist.html";
            } else {
                errorMessage.textContent = "Unauthorized role.";
                errorMessage.style.color = "red";
            }
        } else {
            errorMessage.textContent = "User role not found.";
            errorMessage.style.color = "red";
        }
    } catch (error) {
        // Display error messages
        console.error("Login failed:", error);
        errorMessage.textContent = `Error: ${error.message}`;
        errorMessage.style.color = "red";
    }
});


