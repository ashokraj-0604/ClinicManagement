function showTab(tabId) {
    document.querySelectorAll('.form-container').forEach((form) => {
        form.classList.add('hidden');
    });
    
    const selectedForm = document.getElementById(`${tabId}-form`);
    if (selectedForm) {
        selectedForm.classList.remove('hidden');
    }

    document.querySelectorAll('.tab-button').forEach((button) => {
        button.classList.remove('active');
    });

    const selectedButton = document.querySelector(`[onclick="showTab('${tabId}')"]`);
    if (selectedButton) {
        selectedButton.classList.add('active');
    }
}

// Ensure the 'login' tab is shown initially
document.addEventListener("DOMContentLoaded", function () {
    showTab('login');
});

// Login process
document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            // Fetch user role from Firestore
            db.collection('users').doc(user.uid).get()
                .then((doc) => {
                    if (doc.exists) {
                        const role = doc.data().role;
                        if (role === 'doctor') {
                            window.location.href = '/doctor.html'; // Redirect to doctor dashboard
                        } else if (role === 'receptionist') {
                            window.location.href = '/receptionist.html'; // Redirect to receptionist dashboard
                        } else {
                            console.log('Unknown role:', role);
                            alert('Unknown role!');
                        }
                    } else {
                        console.log('No role found!');
                        alert('No role assigned to this user.');
                    }
                })
                .catch((error) => {
                    console.error('Error fetching user role:', error);
                    alert('Error retrieving user role.');
                });
        })
        .catch((error) => {
            console.error('Error logging in:', error.message);
            alert(`Login failed: ${error.message}`);
        });
});

// Registration process
document.getElementById('registerForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const role = document.getElementById('role').value;  // Get the selected role

    // Check if the role is already taken in Firestore
    db.collection('roles').doc(role).get()
        .then((doc) => {
            if (doc.exists && doc.data().taken) {
                alert(`${role.charAt(0).toUpperCase() + role.slice(1)} role is already taken!`);
            } else {
                // If the role is not taken, proceed with registration
                auth.createUserWithEmailAndPassword(email, password)
                    .then((userCredential) => {
                        const user = userCredential.user;
                        
                        // Store role in Firestore under the user document
                        db.collection('users').doc(user.uid).set({
                            role: role
                        }).then(() => {
                            // Mark the role as taken in Firestore (automatically creates the document if it doesn't exist)
                            db.collection('roles').doc(role).set({
                                taken: true
                            }, { merge: true }).then(() => {
                                alert('Account created successfully!');
                                console.log('New user:', user);
                                showTab('login');  // Switch to login tab
                            });
                        });
                    })
                    .catch((error) => {
                        console.error('Error creating account:', error.message);
                        alert(`Registration failed: ${error.message}`);
                    });
            }
        })
        .catch((error) => {
            console.error('Error checking role availability:', error);
            alert('Error checking role availability.');
        });
});