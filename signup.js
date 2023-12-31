const express = require("express");
const cors = require("cors");
const database = require("./config");
const e = require("express");
const {
  emailRegExp,
  passwordRegExp,
  Phonenumberregexp,
  CGIDRegexp,
} = require("./asset/regexp");

const app = express();
// postman 
 app.use(express.json());
// react 
app.use(cors());

// Signup endpoint
app.post("/signup", async (req, res) => {
  const { CG_ID, CG_Email_Address, Full_Name, Phone_Number, Password } =
    req.body;
    
  const docRef = database.collection("CG_SignUp_DB").doc(`${CG_ID}`);
  const docSnapshot = await docRef.get();
  if (!CG_ID && !CG_Email_Address && !Full_Name && !Phone_Number && !Password) {
    res.status(400).json({ message: "Please enter all the Data" });
  } else if (
    CG_ID == "" &&
    CG_Email_Address == "" &&
    Full_Name == "" &&
    Phone_Number == "" &&
    Password == ""
  ) {
    res.status(400).json({ message: "Please enter all the Data" });
  } else if (CGIDRegexp.test(CG_ID)) {
    res.status(400).json({ message: "Please enter CG ID in proper format" });
  } else if (Phonenumberregexp.test(Phone_Number)) {

    res.status(400)
      .json({ message: "Please enter phone number  in proper format" });
  } else if (emailRegExp.test(CG_Email_Address)) {
    res.status(400).json({ message: "Please enter email id in proper format" });
  } else if (passwordRegExp.test(Password)) {
    res.status(400).json({ messsage: "please enter password in required format" });
  } else if (docSnapshot.exists) {
    res.status(400).json({ message: "User Already Exists" });
  } else {
    await docRef
      .set({
        CG_ID: CG_ID,
        CG_Email_Address: CG_Email_Address,
        Full_Name: Full_Name,
        Phone_Number: Phone_Number,
        Password: Password,
      })
      .then((userRecord) => {
        // User created successfully
        console.log("Successfully created new user:", userRecord);
        res.status(200).json({ message: "User created successfully" });
      })
      .catch((error) => {
        // Error occurred during user creation
        console.log("Error creating new user:", error);
        res.status(500).json({ message: "Failed to create user" });
      });
  }
});

