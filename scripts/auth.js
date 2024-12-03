// // DOM elements
// const loginForm = document.getElementById('loginForm');
// const errorMessage = document.getElementById('errorMessage');

// // Simulated login function (replace this with actual API call)
// async function loginUser(email, password) {
//     // Simulate a server delay
//     return new Promise((resolve, reject) => {
//         setTimeout(() => {
//             // Dummy validation for multiple roles
//             if (email === "doctor@example.com" && password === "doctor123") {
//                 resolve({ success: true, role: "doctor" });
//             } else if (email === "receptionist@example.com" && password === "receptionist123") {
//                 resolve({ success: true, role: "receptionist" });
//             } else {
//                 reject({ success: false, message: "Invalid email or password" });
//             }
//         }, 1000);
//     });
// }

// // Handle form submission
// loginForm.addEventListener('submit', async (event) => {
//     event.preventDefault(); // Prevent default form submission
//     const email = document.getElementById('email').value;
//     const password = document.getElementById('password').value;

//     // Disable the button and show loading state
//     const submitButton = loginForm.querySelector('button');
//     submitButton.disabled = true;
//     submitButton.textContent = "Logging in...";

//     try {
//         // Attempt login
//         const response = await loginUser(email, password);

//         if (response.success) {
//             // Navigate to the respective dashboard
//             if (response.role === "doctor") {
//                 window.location.href = "/dashboard.html";
//             } else if (response.role === "receptionist") {
//                 window.location.href = "/receptionist.html";
//             }
//         }
//     } catch (error) {
//         // Show error message
//         errorMessage.textContent = error.message || "An error occurred. Please try again.";
//         errorMessage.style.color = "red";
//     } finally {
//         // Reset button state
//         submitButton.disabled = false;
//         submitButton.textContent = "Login";
//     }
// });

import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { app, db } from "./firebase-config.js";

const auth = getAuth(app);

// Logging Function
function log(message, level = "info") {
    console[level](`[${new Date().toISOString()}] ${message}`);
}

// Redirect Based on Role
async function redirectBasedOnRole(userId) {
    try {
        log(`Fetching role for user: ${userId}`);
        const userDoc = await getDoc(doc(db, "users", userId));
        if (userDoc.exists()) {
            const role = userDoc.data().role;
            log(`Role identified: ${role}`);
            if (role === "doctor") {
                window.location.href = "/doctor-dashboard.html";
            } else if (role === "receptionist") {
                window.location.href = "/receptionist-dashboard.html";
            } else {
                throw new Error("Invalid role");
            }
        } else {
            throw new Error("User document not found in Firestore");
        }
    } catch (error) {
        log(`Error during role-based redirection: ${error.message}`, "error");
        document.getElementById("errorMessage").textContent =
            "Error identifying role. Please contact support.";
    }
}

// // Login Event Listener
// const loginForm = document.getElementById("loginForm");
// loginForm.addEventListener("submit", async (e) => {
//     e.preventDefault();
//     const email = document.getElementById("email").value;
//     const password = document.getElementById("password").value;

//     try {
//         log(`Attempting login for user: ${email}`);
//         const userCredential = await signInWithEmailAndPassword(auth, email, password);
//         const userId = userCredential.user.uid;

//         log(`Login successful for user: ${email}`);
//         await redirectBasedOnRole(userId); // Redirect based on role
//     } catch (error) {
//         log(`Login failed: ${error.message}`, "error");
//         document.getElementById("errorMessage").textContent = "Invalid credentials. Please try again.";
//     }
// });
