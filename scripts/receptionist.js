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
  
    // Add Patient Form
    const addPatientForm = document.getElementById('add-patient-form');
    addPatientForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('patient-name').value;
      const age = document.getElementById('patient-age').value;
      const contact = document.getElementById('patient-contact').value;
      const gender = document.getElementById('patient-gender').value;
  
      alert(`Patient ${name} added successfully!`);
  
      addPatientForm.reset();
    });
  
    // Generate Token Form
    const generateTokenForm = document.getElementById('generate-token-form');
    const tokenList = document.querySelector('#token-list ul');
    generateTokenForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const patientName = document.getElementById('patient-token-name').value;
      const tokenNumber = document.getElementById('token-number').value;
  
      const listItem = document.createElement('li');
      listItem.textContent = `Token #${tokenNumber} - ${patientName}`;
      tokenList.appendChild(listItem);
  
      generateTokenForm.reset();
    });
  
    // Manage Billing Form
    const billingForm = document.getElementById('billing-form');
    const billingHistory = document.querySelector('#billing-history ul');
    billingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const patientName = document.getElementById('bill-patient-name').value;
      const service = document.getElementById('service').value;
      const amount = document.getElementById('amount').value;
  
      const listItem = document.createElement('li');
      listItem.textContent = `Bill for ${patientName} - ${service}: $${amount}`;
      billingHistory.appendChild(listItem);
  
      billingForm.reset();
    });
  });
  



//   import { auth, db } from "./firebase-config.js";
//   import { signOut } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
//   import { collection, addDoc } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";
  
//   document.getElementById("logoutBtn").addEventListener("click", () => {
//     signOut(auth).then(() => {
//       window.location.href = "index.html";
//     });
//   });
  
//   document.getElementById("addPatientForm").addEventListener("submit", (e) => {
//     e.preventDefault();
//     const patientName = document.getElementById("patientName").value;
  
//     addDoc(collection(db, "tokens"), { name: patientName, timestamp: new Date() })
//       .then(() => {
//         alert("Token generated!");
//       })
//       .catch((error) => {
//         console.error("Error adding document: ", error);
//       });
//   });
  