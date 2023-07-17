const admin = require('firebase-admin');
const serviceAccount = require('./path/to/serviceAccountKey.json');


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://console.firebase.google.com/u/0/project/inventory-management-t/overview'
});


async function updatePassword(CG_ID, currentPassword, newPassword) {
  try {
    
    const userSnapshot = await admin.database("CG_SignUp_DB").ref(`users/${CG_ID}`).once('value');
    const userData = userSnapshot.val();

    if (userData.password !== currentPassword) {
      throw new Error('Current password is incorrect');
    }

    
    await admin.database("CG_SignUp_DB").ref(`users/${CG_ID}`).update({
      password: newPassword
    });

    console.log(`Password updated successfully for user: ${CG_ID}`);
  } catch (error) {
    console.error('Error updating password:', error);
  }
}


const CG_ID = 'CG_ID'; 
const currentPassword = 'current-password'; 
const newPassword = 'new-password'; 

updatePassword(CG_ID, currentPassword, newPassword);

// Start the server
const port = 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});