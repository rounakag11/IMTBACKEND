const express = require("express");
const cors = require("cors");
const database = require("./config");
const bodyParser = require("body-parser");
const nodemailer = require('nodemailer')
const {
  emailRegExp,
  passwordRegExp,
  Phonenumberregexp,
  CGIDRegexp,
} = require("./asset/regexp");

// const {
//   passwordRegExp,
//   CGIDRegexp,
//     } = require("./asset/regexp");

const app = express();
// postman 
app.use(express.json());
app.use(bodyParser.json());
// react 
app.use(cors());
const signUp = require('./signup')
require('./login')
require('./forgetPassword')
require('./resetPassword')




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

app.post("/login", async (req, res) => {
  const { CG_ID, Password } = req.body;
  if (!CG_ID || !Password) {
    res.status(400).json({ error: "Please provide CG_ID and Password" });

    return;
  }
  const docRef = database.collection("CG_SignUp_DB").doc(CG_ID);
  const docSnapshot = await docRef.get();
  if (docSnapshot.exists) {
    const userData = docSnapshot.data();
    if (userData.Password === Password) {
      res.status(200).json({ message: "Login successful!" });
    } else {
      res.status(401).json({ error: "Invalid Password" });
    }
  } else {
    res.status(404).json({ error: "User not found" });
  }
});
// Serve the index.html file
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

const otpStorage = {}; // Store OTP and its creation timestamp

function generateOTP() {
  return ("" + Math.random()).substring(2, 6);
}

function isOTPValid(CG_Email_Address) {
  if (otpStorage[CG_Email_Address]) {
    const currentTime = Date.now();

    const { timestamp, validFor } = otpStorage[CG_Email_Address];

    return currentTime <= timestamp + validFor;
  }

  return false;
}

app.post("/forgetPassword", async (req, res) => {
  const { CG_Email_Address } = req.body;

  const collectionRef = database.collection("CG_SignUp_DB");

  const querySnapshot = await collectionRef
    .where("CG_Email_Address", "==", CG_Email_Address)
    .get();

  if (!querySnapshot.empty) {
    const otp = generateOTP();

    const timestamp = Date.now(); // Get the current timestamp in milliseconds

    const validFor = 10 * 60 * 1000; // Validity period in milliseconds (10 minutes)

    otpStorage[CG_Email_Address] = { otp, timestamp, validFor }; // Store the OTP, its timestamp, and validity period

    // Clear the OTP data after the validity period

    setTimeout(() => {
      delete otpStorage[CG_Email_Address];
    }, validFor);

    res.status(200).json({
      message: "User Exist",

      verficationOtp: otp,

      validFor: validFor, // Send the validity period in milliseconds (10 minutes)
    });
  } else {
    res
      .status(404)
      .json({ error: "User does not exist. Please register first." });
  }
});


app.post("/verifyOTP", async (req, res) => {
  const { CG_Email_Address, otp } = req.body;

  if (isOTPValid(CG_Email_Address)) {
    if (otpStorage[CG_Email_Address].otp === otp) {
      res.status(200).json({ message: "OTP verified successfully!" });
    } else {
      res.status(400).json({ error: "Invalid OTP, please try again." });
    }
  } else {
    // OTP has expired

    delete otpStorage[CG_Email_Address];

    res.status(400).json({ error: "OTP expired, please request a new one." });
  }
});
app.post("/resetPassword", async (req, res) => {
  const { CG_ID,New_Password, Confirm_New_Password } = req.body;


  const docRef = database.collection("CG_SignUp_DB").doc(`${CG_ID}`);
  if(New_Password !== Confirm_New_Password){
      res.status(400).json({ error: "New Password And confirm New Password Are not Same" });
  }
  else{
      await docRef
      .update({
        Password: New_Password
      })
      .then((userRecord) => {
        res.status(200).json({ message: "New Password Has Set SuccessFully" });
      })
      .catch((error) => {
        res.status(500).json({ error: "Failed to create user" });
      });
}

})


app.post("/addNewInventory", async (req, res) => {
  const {
    Allocation_date,
    Inventory_Name,
    type,
    Sl_No,
    User_Name,
    Invoice,
    Tag_name,
    Working_status,
    User_Role,
  } = req.body;
  const newInventory_DocRef = database.collection("Inventory").doc(`${User_Name}-${Sl_No}`);
  const docSnapshot = await newInventory_DocRef.get();
  const transporter = nodemailer.createTransport({
    service : 'Gmail',
    auth:{
        user: 'invetorytools@gmail.com',
        pass:'Admin@123'
    }
  })
  const mailOption = {
    from: 'invetorytools@gmail.com',
    to: 'agrawalrounak008@gmail.com',
    subject: 'Email releted Inventory acceptance',
    text : `invetory request releted ${User_Name}`
  }
  // check if mandtory field are undefined
  if (!Allocation_date && !Inventory_Name && !type && !Sl_No && !User_Name && !User_Role) {
    res.status(404).json({ message: "Please Enter Mandatory Fields" });
  }
  // check if mandotory field is null or blank
  else if (
    Allocation_date == "" &&
    Inventory_Name == "" &&
    type == "" &&
    Sl_No == "" &&
    User_Name == ""
    && User_Role == ""
  ) {
    res
      .status(404)
      .json({ message: "Please Do Not enter Mandatory Fields Data Blank" });
  }
  // Allocation data is blank or undefined
  else if (Allocation_date == "" && !Allocation_date) {
    res.status(404).json({ message: "Allocation Date is required" });
  }
  // inventory name is blank or undefined
  else if (Inventory_Name == "" && !Inventory_Name) {
    res.status(404).json({ message: "Inventory Name is required" });
  }
  // Checking if type is blank or undefined
  else if (type == "" && !type) {
    res.status(404).json({ message: "Type is required" });
  }
  // serial number is  blank or undefined
  else if (Sl_No == "" && !Sl_No) {
    res.status(404).json({ message: "Serial No  is required" });
  }
  // user name is not blank or undefined
  else if (User_Name == "" && !User_Name) {
    res.status(404).json({ message: "User Name is required" });
  }
  // Here we are checking if duplicacy is there in data base through unique key
  else if (docSnapshot.exists) {
    res
      .status(400)
      .json({ message: " Inventory Is already added In Database" });
  }
  // adding new inventory to database
  else {
    await newInventory_DocRef
      .set({
        User_Name: User_Name,
        Sl_No: Sl_No,
        type: type,
        Allocation_date: Allocation_date,
        Inventory_Name: Inventory_Name,
        Invoice: Invoice ? Invoice : "",
        Tag_name: Tag_name ? Tag_name : "",
        Working_status: Working_status ? Working_status : "",
      })
      .then(async (userRecord) => {
        console.log("Successfully created new user:", userRecord);
        res.status(200).json({ message: "New Inventory added successfully" });
        if (User_Role != "Admin"){
              try{
                const info = await transporter.sendMail(mailOption)
                console.log('email sent', info.response)
              }
              catch(error){
                console.error('error', error)
              }
        }
        
      })
      .catch((error) => {
        // Error occurred during user creation
        console.log("Error creating new user:", error);
        res.status(500).json({ message: "Failed to add new Inventory " });
      });
  }
});

const port = 5000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});