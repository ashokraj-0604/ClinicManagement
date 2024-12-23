import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js';
import { getFirestore, onSnapshot, query, deleteDoc, where, collection, addDoc, getDocs, orderBy } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js';

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyDbUGT0C8pZPYyn9G61DlBSDVOob2Qzxxc",
  authDomain: "clinicmanager-72e37.firebaseapp.com",
  projectId: "clinicmanager-72e37",
  storageBucket: "clinicmanager-72e37.firebasestorage.app",
  messagingSenderId: "438961594747",
  appId: "1:438961594747:web:a7666784f034ff247addde",
  measurementId: "G-WMXJS6JTG8",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


document.addEventListener('DOMContentLoaded', () => {
  const navButtons = document.querySelectorAll('.nav-btn');
  const sections = document.querySelectorAll('.section');
  
  // Function to show the correct section
  function showSection(sectionId) {
    sections.forEach(section => {
      section.classList.toggle('active', section.id === sectionId);
    });
  }

  // Navigation button event listeners
  navButtons.forEach(button => {
    button.addEventListener('click', () => {
      showSection(button.dataset.section);
    });
  });
  showSection('add-patient');
});

// Selectors
const navButtons = document.querySelectorAll('.nav-btn');
const sections = document.querySelectorAll('.section');
const addPatientForm = document.getElementById('add-patient-form');
const generateTokenForm = document.getElementById('generate-token-form');
const billingForm = document.getElementById('billing-form');
const patientTableBody = document.querySelector('#patient-table tbody');
const searchBar = document.getElementById('search-bar');
const tokenList = document.getElementById('token-list-ul');
const billingHistory = document.getElementById('billing-history-ul');
const logoutBtn = document.getElementById('logout-btn');

// Helper function to switch sections
function showSection(sectionId) {
  sections.forEach((section) => {
    section.classList.toggle('hidden', section.id !== sectionId);
  });
}

// Navigation button functionality
navButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const sectionId = button.dataset.section;
    showSection(sectionId);
  });
});

// Add Patient
addPatientForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const patientName = document.getElementById('patient-name').value;
  const patientAge = document.getElementById('patient-age').value;
  const patientContact = document.getElementById('patient-contact').value;
  const patientGender = document.getElementById('patient-gender').value;

  const newPatient = {
    name: patientName,
    age: patientAge,
    contact: patientContact,
    gender: patientGender,
  };

  try {
    const docRef = await addDoc(collection(db, "patients"), newPatient);
    newPatient.id = docRef.id; // Assign Firestore ID
    addPatientToTable(newPatient, patientTableBody);
    alert(`Patient ${patientName} added successfully!`);
    addPatientForm.reset();
  } catch (e) {
    console.error("Error adding patient: ", e);
    alert("Error adding patient, please try again.");
  }
});

// Add Patient to Table
function addPatientToTable(patient, historyTableBody) {
  const row = document.createElement('tr');
  row.innerHTML = `
    <td>${patient.name}</td>
    <td>${patient.age}</td>
    <td>${patient.contact}</td>
    <td>${patient.gender}</td>
    <td>
      <button class="btn-delete" data-id="${patient.id}">Delete</button>
    </td>
  `;
  historyTableBody.appendChild(row);

  // Attach actions to the delete and edit buttons
  const deleteButton = row.querySelector('.btn-delete');
  deleteButton.addEventListener('click', async () => {
    await deletePatientFromFirestore(patient.id);
    row.remove();
  });
}


// Delete Patient from Firestore
async function deletePatientFromFirestore(patientId) {
  try {
    const patientDocRef = doc(db, "patients", patientId);
    await deleteDoc(patientDocRef);
    alert(`Patient with ID ${patientId} deleted successfully.`);
  } catch (error) {
    console.error("Error deleting patient:", error);
  }
}

// Load Patient Details
async function loadPatientDetails(historyTableBody) {
  try {
    const querySnapshot = await getDocs(collection(db, "patients"));
    historyTableBody.innerHTML = '';

    querySnapshot.forEach((doc) => {
      const patient = doc.data();
      patient.id = doc.id; // Assign Firestore document ID
      addPatientToTable(patient, historyTableBody);
    });
  } catch (error) {
    console.error("Error loading patient details:", error);
  }
}

// Search functionality
searchBar.addEventListener('input', () => {
  const searchTerm = searchBar.value.trim().toLowerCase();
  const rows = patientTableBody.querySelectorAll('tr');
  rows.forEach((row) => {
    const patientName = row.children[0]?.textContent.trim().toLowerCase();
    row.style.display = patientName?.includes(searchTerm) ? '' : 'none';
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const historyTableBody = document.getElementById('historyTableBody');

  if (!historyTableBody) {
    console.error('Error: historyTableBody element is missing.');
    return;
  }

  // Call the function to load patient details
  loadPatientDetails(historyTableBody);
});

// Generate Token
generateTokenForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const patientName = document.getElementById('patient-token-name').value;
  const tokenNumber = document.getElementById('token-number').value;

  const newToken = {
    patientName: patientName,
    tokenNumber: tokenNumber,
    createdAt: new Date(),
  };

  try {
    const docRef = await addDoc(collection(db, "tokens"), newToken);
    console.log("Token generated with ID: ", docRef.id);
    addTokenToList(newToken);
    alert(`Token for ${patientName} generated successfully!`);
    generateTokenForm.reset();
  } catch (e) {
    console.error("Error generating token: ", e);
    alert("Error generating token, please try again.");
  }
});

function addTokenToList(token) {
  const listItem = document.createElement('li');
  listItem.textContent = `Patient: ${token.patientName}, Token: ${token.tokenNumber}`;
  tokenList.appendChild(listItem);
}

async function loadTokens() {
  const querySnapshot = await getDocs(collection(db, "tokens"));
  tokenList.innerHTML = '';
  querySnapshot.forEach((doc) => {
    const token = doc.data();
    addTokenToList(token);
  });
}

window.addEventListener('load', loadTokens);


// Function to generate a bill
document.getElementById('billing-form').addEventListener('submit', async (event) => {
  event.preventDefault();

  // Get the values from the form
  const patientName = document.getElementById('bill-patient-name').value;
  const service = document.getElementById('service').value;
  const amount = parseFloat(document.getElementById('amount').value);

  if (isNaN(amount) || amount <= 0) {
    alert('Please enter a valid amount.');
    return;
  }

  // Create a new bill object
  const bill = {
    patientName,
    service,
    amount,
    date: new Date().toISOString(), // Store the current date
  };

  // Add the bill to Firebase (you can modify this to your desired Firestore collection)
  try {
    const docRef = await addDoc(collection(db, 'billingHistory'), bill);
    console.log("Bill generated with ID: ", docRef.id);

    // Add the generated bill to the billing history section in UI
    addToBillingHistory(bill);

    // Reset the form after submission
    document.getElementById('billing-form').reset();
    alert('Bill generated successfully!');
  } catch (error) {
    console.error('Error generating bill:', error);
    alert('Failed to generate bill. Please try again.');
  }
});

// Function to add a generated bill to the billing history section
function addToBillingHistory(bill) {
  const billingHistoryList = document.querySelector('#billing-history ul');
  const listItem = document.createElement('li');
  listItem.classList.add('billing-item');
  listItem.innerHTML = `
    <span><strong>Patient:</strong> ${bill.patientName}</span> | 
    <span><strong>Service:</strong> ${bill.service}</span> | 
    <span><strong>Amount:</strong> ${bill.amount}</span> | 
    <span><strong>Date:</strong> ${new Date(bill.date).toLocaleDateString()}</span>
  `;

  billingHistoryList.appendChild(listItem);
}

// Function to load billing history from Firestore
async function loadBillingHistory() {
  try {
    const billingHistoryQuery = query(collection(db, 'billingHistory'), orderBy('date', 'desc'));
    const querySnapshot = await getDocs(billingHistoryQuery);

    const billingHistoryList = document.getElementById('billing-history').querySelector('ul');
    billingHistoryList.innerHTML = ''; // Clear any existing content

    if (querySnapshot.empty) {
      console.log('No bills found in the database.');
      return; // If no bills are found, exit the function
    }

    // Loop through each bill document from Firestore and display it
    querySnapshot.forEach((doc) => {
      const bill = doc.data();
      const listItem = document.createElement('li');
      listItem.classList.add('billing-item');
      listItem.innerHTML = `
        <span><strong>Patient:</strong> ${bill.patientName}</span> | 
        <span><strong>Service:</strong> ${bill.service}</span> | 
        <span><strong>Amount:</strong> ${bill.amount}</span> | 
        <span><strong>Date:</strong> ${new Date(bill.date).toLocaleDateString()}</span>
      `;
      billingHistoryList.appendChild(listItem);
    });
  } catch (error) {
    console.error('Error loading billing history:', error);
  }
}

// Call the function to load billing history when the page is loaded
document.addEventListener('DOMContentLoaded', () => {
  loadBillingHistory();  // Ensure it's being called when the page is loaded
});


// Function to load prescriptions from Firebase and display in the billing section
async function loadPrescriptionsForBilling() {
  try {
    // Query to fetch prescriptions, ordered by creation date (or any other order)
    const prescriptionsQuery = query(collection(db, 'prescriptions'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(prescriptionsQuery);

    // Clear any existing content in the prescription list before adding new ones
    const prescriptionList = document.getElementById('prescription-list');
    prescriptionList.innerHTML = '';

    // Loop through each document in the Firestore query snapshot
    querySnapshot.forEach((doc) => {
      const prescription = doc.data();

      // Create an HTML list item to display the prescription details in one line
      const listItem = document.createElement('li');
      listItem.classList.add('prescription-item');
      listItem.innerHTML = `
        <span><strong>Patient:</strong> ${prescription.patientName}</span> | 
        <span><strong>Medicine:</strong> ${prescription.medicine}</span> | 
        <span><strong>Dosage:</strong> ${prescription.dosage}</span> | 
        <span><strong>Date:</strong> ${new Date(prescription.createdAt).toLocaleDateString()}</span>
      `;

      // Append the list item to the prescription list
      prescriptionList.appendChild(listItem);
    });

  } catch (error) {
    console.error('Error loading prescriptions for billing:', error);
    alert('Error loading prescriptions. Please try again later.');
  }
}

// Call the function to load prescriptions when the page is loaded
document.addEventListener('DOMContentLoaded', loadPrescriptionsForBilling);

// Logout functionality
logoutBtn.addEventListener('click', () => {
  alert('Logged out');
  window.location.href = 'login.html';
});
