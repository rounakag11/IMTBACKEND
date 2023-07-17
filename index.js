const express = require("express");
const database = require("./config");
const e = require("express");

const app = express();
app.use(express.json());

// Signup endpoint
app.post("/signup", async (req, res) => {
  const { CG_ID, CG_Email_Address, Full_Name, Phone_Number, Password } = req.body;
  // const snapshot = await database.collection('users').get();
  // console.log('snapshot',snapshot)

  const docRef = database.collection("CG_SignUp_DB").doc(`${CG_ID}`);
  const docSnapshot = await docRef.get();

  if (docSnapshot.exists) {
    res.status(400).json({ error: "User Already Exists" });
  } else {
    await docRef
      .set({
        CG_ID: CG_ID,
        CG_Email_Address: CG_Email_Address,
        Full_Name: Full_Name,
        Phone_Number: Phone_Number,
        Password: Password
      })
      .then((userRecord) => {
        // User created successfully
        console.log("Successfully created new user:", userRecord);
        res.status(200).json({ message: "User created successfully" });
      })
      .catch((error) => {
        // Error occurred during user creation
        console.log("Error creating new user:", error);
        res.status(500).json({ error: "Failed to create user" });
      });
  }
});

// Start the server
const port = 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
