const express = require("express");
const database = require("./config");

const app = express();

const otpStorage = {}; //Store OTP and its creation timestamp

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
app.post("/EditProfile", async (req, res) => {
  const { CG_ID, CG_Email_Address, Password, Phone_Number } = req.body;

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

app.post("/verifyOTPEditProfile", async (req, res) => {
  const { CG_ID, Password, Phone_Number, otp } = req.body;

  if (isOTPValid(CG_Email_Address)) {
    if (otpStorage[CG_Email_Address].otp === otp) {
      const docRef = database.collection("CG_SignUp_DB").doc(`${CG_ID}`);
      await docRef
        .update({
          Password: Password,
          Phone_Number: Phone_Number,
        })
        .then((userRecord) => {
          res.status(200).json({ message: "Profile Updated Sucessfully " });
        })
        .catch((error) => {
          res.status(500).json({ error: "Failed to create user" });
        });
    } else {
      res.status(400).json({ error: "Invalid OTP, please try again." });
    }
  } else {
    // OTP has expired

    delete otpStorage[CG_Email_Address];

    res.status(400).json({ error: "OTP expired, please request a new one." });
  }
});



  