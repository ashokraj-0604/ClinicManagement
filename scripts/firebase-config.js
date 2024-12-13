const admin = require('firebase-admin');
const functions = require('firebase-functions');

// Initialize Firebase Admin SDK
admin.initializeApp();

// Cloud Function to set admin role
exports.setAdminRole = functions.https.onCall((data, context) => {
  // Ensure the function is called by an authenticated user with an 'admin' claim
  if (!context.auth || !context.auth.token.admin) {
    throw new functions.https.HttpsError('permission-denied', 'Only an admin can assign roles');
  }

  // Get user UID and assign 'admin' role
  const uid = data.uid;
  const customClaims = { admin: true };

  // Set the custom claims (admin role)
  return admin.auth().setCustomUserClaims(uid, customClaims)
    .then(() => {
      return { message: `Admin role assigned to user with UID: ${uid}` };
    })
    .catch(error => {
      throw new functions.https.HttpsError('internal', error.message);
    });
});
