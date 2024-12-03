// document.addEventListener('DOMContentLoaded', () => {
//     const navButtons = document.querySelectorAll('.nav-btn');
//     const sections = document.querySelectorAll('.section');
  
//     // Handle navigation
//     navButtons.forEach((btn) => {
//       btn.addEventListener('click', () => {
//         const sectionId = btn.getAttribute('data-section');
//         sections.forEach((section) => {
//           section.classList.toggle('hidden', section.id !== sectionId);
//         });
//       });
//     });
  
//     // Populate patient records
//     const patientList = [
//       { name: "Alice Smith", age: 30, contact: "123-456-7890", lastVisit: "2024-11-28" },
//       { name: "Bob Jones", age: 45, contact: "234-567-8901", lastVisit: "2024-11-20" },
//       { name: "Charlie Davis", age: 52, contact: "345-678-9012", lastVisit: "2024-11-15" },
//     ];
  
//     const tableBody = document.getElementById('patient-list');
//     patientList.forEach((patient) => {
//       const row = document.createElement('tr');
//       row.innerHTML = `
//         <td>${patient.name}</td>
//         <td>${patient.age}</td>
//         <td>${patient.contact}</td>
//         <td>${patient.lastVisit}</td>
//       `;
//       tableBody.appendChild(row);
//     });
//   });
  

import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { app, db } from "./firebase-config.js";

const auth = getAuth(app);

onAuthStateChanged(auth, async (user) => {
    if (user) {
        const userId = user.uid;
        const userDoc = await getDoc(doc(db, "users", userId));
        if (userDoc.exists() && userDoc.data().role === "doctor") {
            console.log("Welcome to the doctor dashboard!");
        } else {
            alert("Access denied!");
            window.location.href = "/login.html";
        }
    } else {
        alert("Please log in!");
        window.location.href = "/login.html";
    }
});




document.addEventListener('DOMContentLoaded', () => {
    const navButtons = document.querySelectorAll('.nav-btn');
    const sections = document.querySelectorAll('.section');
  
    // Handle navigation
    navButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const sectionId = btn.getAttribute('data-section');
        sections.forEach((section) => {
          section.classList.toggle('hidden', section.id !== sectionId);
        });
      });
    });
  
    // Sample data for patient tokens, history, and prescriptions
    const tokens = [
      { patient: "Alice Smith", token: 101 },
      { patient: "Bob Jones", token: 102 },
      { patient: "Charlie Davis", token: 103 },
    ];
  
    const patientHistory = [
      { name: "Alice Smith", lastVisit: "2024-11-28", conditions: "Flu", treatment: "Antibiotics" },
      { name: "Bob Jones", lastVisit: "2024-11-20", conditions: "Cold", treatment: "Rest and fluids" },
      { name: "Charlie Davis", lastVisit: "2024-11-15", conditions: "High Blood Pressure", treatment: "Medication" },
    ];
  
    const prescriptions = [
      { patient: "Alice Smith", prescription: "Antibiotics for 5 days" },
      { patient: "Bob Jones", prescription: "Cough syrup" },
    ];
  
    // Display Patient Tokens
    const tokenList = document.getElementById('token-list');
    tokens.forEach((token) => {
      const listItem = document.createElement('li');
      listItem.textContent = `Token #${token.token} - ${token.patient}`;
      tokenList.appendChild(listItem);
    });
  
    // Display Patient History
    const historyList = document.getElementById('history-list');
    patientHistory.forEach((history) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${history.name}</td>
        <td>${history.lastVisit}</td>
        <td>${history.conditions}</td>
        <td>${history.treatment}</td>
      `;
      historyList.appendChild(row);
    });
  
    // Display Prescriptions
    const prescriptionsList = document.getElementById('prescriptions-list');
    prescriptions.forEach((prescription) => {
      const listItem = document.createElement('li');
      listItem.textContent = `${prescription.patient}: ${prescription.prescription}`;
      prescriptionsList.appendChild(listItem);
    });
  
    // Handle Update Patient Records form
    const updateRecordsForm = document.getElementById('update-records-form');
    updateRecordsForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('patient-name').value;
      const condition = document.getElementById('patient-condition').value;
      const treatment = document.getElementById('treatment').value;
  
      // Assuming you'd handle sending this to a server
      alert(`Updated record for ${name}`);
      updateRecordsForm.reset();
    });
  });
//   import { auth, db } from "./firebase-config.js";
// import { signOut } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
// import { collection, getDocs } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";

// document.getElementById("logoutBtn").addEventListener("click", () => {
//   signOut(auth).then(() => {
//     window.location.href = "index.html";
//   });
// });

// const patientRecords = document.getElementById("patientRecords");

// getDocs(collection(db, "patients")).then((querySnapshot) => {
//   querySnapshot.forEach((doc) => {
//     const li = document.createElement("li");
//     li.innerText = `${doc.data().name} - ${doc.data().history}`;
//     patientRecords.appendChild(li);
//   });
// });
