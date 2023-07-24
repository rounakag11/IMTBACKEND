var admin = require("firebase-admin");

var serviceAccount = require("./inventory-management-t-firebase-adminsdk-fb3uu-54a2b65d9e.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const database = admin.firestore()

module.exports = database 