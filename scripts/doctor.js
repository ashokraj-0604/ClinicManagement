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
  
  // Logout functionality
  function logout() {
    alert('You have been logged out.');
    window.location.href = '/login.html'; // Adjust the redirect path as needed
  }

  // Attach logout function to the button
  document.querySelector('.logout-btn').addEventListener('click', logout);
});

import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js';
import { getFirestore,onSnapshot, collection, addDoc, getDocs, deleteDoc, doc,where,updateDoc, query, orderBy } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js';

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

// Selectors
const tokenList = document.getElementById('token-list');
const navButtons = document.querySelectorAll('.nav-btn');
const sections = document.querySelectorAll('.section');

// Helper Function: Show Sections
function showSection(sectionId) {
  sections.forEach((section) => {
    section.classList.toggle('hidden', section.id !== sectionId);
  });
}

// Navigation Buttons Logic
navButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const sectionId = button.dataset.section;
    showSection(sectionId);

    if (sectionId === 'tokens') {
      loadTokens(); // Load tokens when navigating to the "Patient Tokens" section
    }
  });
});


// Selectors
const appointmentsForm = document.getElementById('add-appointment-form');
const appointmentsList = document.getElementById('appointments-ul');
const appointmentsCount = document.getElementById('appointments-count');

// Add Appointment
appointmentsForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const patientName = document.getElementById('appointment-patient-name').value;
  const appointmentDate = document.getElementById('appointment-date').value;
  const notes = document.getElementById('appointment-notes').value;

  const newAppointment = {
    patientName: patientName,
    appointmentDate: appointmentDate,
    notes: notes,
    createdAt: new Date(),
  };

  try {
    // Store appointment in Firestore
    await addDoc(collection(db, 'appointments'), newAppointment);
    alert('Appointment added successfully!');
    appointmentsForm.reset();
    loadAppointments(); // Reload the appointments list
    updateAppointmentCount(); // Update the appointment count
  } catch (error) {
    console.error('Error adding appointment: ', error);
    alert('Error adding appointment.');
  }
});

// Load Appointments and Display Count
async function loadAppointments() {
  try {
    const querySnapshot = await getDocs(collection(db, 'appointments'));
    appointmentsList.innerHTML = ''; // Clear the list before populating

    querySnapshot.forEach((doc) => {
      const appointment = doc.data();
      const listItem = document.createElement('li');
      listItem.textContent = `${appointment.patientName} - ${appointment.appointmentDate}`;
      appointmentsList.appendChild(listItem);
    });
  } catch (error) {
    console.error('Error loading appointments: ', error);
  }
}

// Update Appointment Count
async function updateAppointmentCount() {
  try {
    const querySnapshot = await getDocs(collection(db, 'appointments'));
    appointmentsCount.textContent = querySnapshot.size; // Set the appointment count
  } catch (error) {
    console.error('Error fetching appointment count: ', error);
  }
}

// Load appointments and count on page load
window.addEventListener('load', () => {
  loadAppointments(); // Load the appointments
  updateAppointmentCount(); // Update the appointment count
});

// Function to Load Tokens
async function loadTokens() {
  try {
    const tokensQuery = query(collection(db, 'tokens'), orderBy('createdAt', 'asc'));
    const querySnapshot = await getDocs(tokensQuery);

    tokenList.innerHTML = ''; // Clear the list before populating

    querySnapshot.forEach((doc) => {
      const token = doc.data();
      const listItem = document.createElement('li');
      listItem.textContent = `Token: ${token.tokenNumber}, Patient: ${token.patientName}`;

      // Create 'Call' button
      const callButton = document.createElement('button');
      callButton.textContent = 'Call';
      callButton.classList.add('call-btn');
      callButton.addEventListener('click', () => {
        alert(`Calling Token Number: ${token.tokenNumber}`);
      });

      // Create 'Delete' button
      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Delete';
      deleteButton.classList.add('delete-btn');
      deleteButton.addEventListener('click', () => {
        deleteToken(doc.id);
      });

      // Append buttons to the list item
      listItem.appendChild(callButton);
      listItem.appendChild(deleteButton);

      tokenList.appendChild(listItem);
    });
  } catch (error) {
    console.error('Error fetching tokens: ', error);
  }
}

// Function to Load and Display Token Count
async function updateTokenCount() {
  try {
    const tokensQuery = collection(db, 'tokens');
    const querySnapshot = await getDocs(tokensQuery);

    const tokenCount = querySnapshot.size; // Count the total tokens
    const tokenCountElement = document.getElementById('current-token-count');
    tokenCountElement.textContent = tokenCount; // Update the token count in the dashboard
  } catch (error) {
    console.error('Error fetching token count: ', error);
  }
}

// Call the function to update token count on page load
window.addEventListener('load', updateTokenCount);

// Function to Delete Token
async function deleteToken(tokenId) {
  try {
    await deleteDoc(doc(db, 'tokens', tokenId));
    alert('Token deleted successfully!');
    loadTokens(); // Refresh the token list
  } catch (error) {
    console.error('Error deleting token: ', error);
    alert('Error deleting token, please try again.');
  }
}

// Selectors
const searchBar = document.getElementById('search-bar');
const updateRecordsForm = document.getElementById('update-records-form');
const historyTableBody = document.getElementById('history-list');

// Function to filter patient history
searchBar.addEventListener('input', () => {
  const searchText = searchBar.value.toLowerCase();
  const rows = historyTableBody.querySelectorAll('tr');

  rows.forEach((row) => {
    const patientName = row.querySelector('td').textContent.toLowerCase(); // Get the patient name from the first cell
    if (patientName.includes(searchText)) {
      row.style.display = ''; // Show matching rows
    } else {
      row.style.display = 'none'; // Hide non-matching rows
    }
  });
});


// Add updated record to patient history
updateRecordsForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const patientName = document.getElementById('patient-name').value;
  const patientCondition = document.getElementById('patient-condition').value;
  const treatment = document.getElementById('treatment').value;

  const updatedRecord = {
    name: patientName,
    condition: patientCondition,
    treatment: treatment,
    lastVisit: new Date().toISOString(), // Current date as ISO string
  };

  try {
    // Store updated record in Firestore
    const docRef = await addDoc(collection(db, 'patientHistory'), updatedRecord);
    console.log("Patient record updated with ID: ", docRef.id);

    // Add record to history table in UI
    addToHistoryTable(updatedRecord);

    alert(`Patient record for ${patientName} updated successfully!`);
    updateRecordsForm.reset();
  } catch (error) {
    console.error("Error updating patient record: ", error);
    alert("Failed to update patient record. Please try again.");
  }
});

// Add row to history table
function addToHistoryTable(record) {
  const row = document.createElement('tr');
  row.innerHTML = `
    <td>${record.name}</td>
    <td>${new Date(record.lastVisit).toLocaleDateString()}</td>
    <td>${record.condition}</td>
    <td>${record.treatment}</td>
  `;
  historyTableBody.appendChild(row);
}

// Load patient history on page load
async function loadPatientHistory() {
  try {
    const historyQuery = query(collection(db, 'patientHistory'), orderBy('lastVisit', 'desc'));
    const querySnapshot = await getDocs(historyQuery);

    historyTableBody.innerHTML = ''; // Clear table before populating
    querySnapshot.forEach((doc) => {
      const record = doc.data();
      addToHistoryTable(record);
    });
  } catch (error) {
    console.error("Error loading patient history: ", error);
  }
}

// Call load function when the page loads
document.addEventListener('DOMContentLoaded', loadPatientHistory);

// Selectors
const prescriptionForm = document.getElementById('prescription-form');
const prescriptionList = document.getElementById('prescription-list');

// Function to add prescription to Firebase
async function addPrescription(prescription) {
  try {
    await addDoc(collection(db, 'prescriptions'), {
      ...prescription,
      createdAt: new Date().toISOString(),
    });
    alert('Prescription added successfully!');
    loadPrescriptions(); // Refresh the list
  } catch (error) {
    console.error('Error adding prescription:', error);
  }
}

// Function to load prescriptions from Firebase
async function loadPrescriptions() {
  try {
    const prescriptionsQuery = query(collection(db, 'prescriptions'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(prescriptionsQuery);

    prescriptionList.innerHTML = ''; // Clear list before populating
    querySnapshot.forEach((doc) => {
      const prescription = doc.data();
      addToPrescriptionList(doc.id, prescription);
    });
  } catch (error) {
    console.error('Error loading prescriptions:', error);
  }
}

// Function to add prescription to the list
function addToPrescriptionList(id, prescription) {
  const listItem = document.createElement('li');
  listItem.classList.add('prescription-item');
  listItem.innerHTML = `
    <span><strong>Patient:</strong> ${prescription.patientName}</span> | 
    <span><strong>Medicine:</strong> ${prescription.medicine}</span> | 
    <span><strong>Dosage:</strong> ${prescription.dosage}</span> | 
    <span><strong>Date:</strong> ${new Date(prescription.createdAt).toLocaleDateString()}</span>
  `;
  prescriptionList.appendChild(listItem);
}

// Form Submission Event
prescriptionForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const prescription = {
    patientName: document.getElementById('patient-name').value,
    medicine: document.getElementById('medicine').value,
    dosage: document.getElementById('dosage').value,
    notes: document.getElementById('notes').value,
  };

  addPrescription(prescription); // Save to Firebase
  prescriptionForm.reset(); // Clear form
});

// Load prescriptions on page load
document.addEventListener('DOMContentLoaded', loadPrescriptions);





async function callToken(tokenId) {
  const tokenRef = doc(db, "tokens", tokenId);
  try {
    await updateDoc(tokenRef, {
      status: "called",
      calledAt: new Date(), // Add timestamp
    });
    alert("Token called successfully!");
  } catch (error) {
    console.error("Error calling token: ", error);
  }
}