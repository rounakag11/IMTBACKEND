const express = require("express");
const database = require("./config");

const app = express();



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

// Start the server on port 5000











// rounak code 
// function generateOTP() {
//   return ("" + Math.random()).substring(2, 6);
// }

// app.post("/forgetPassword", async (req, res) => {
//   const { CG_ID } = req.body;
//   const docRef = database.collection("CG_SignUp_DB").doc(`${CG_ID}`);
//   const docSnapshot = await docRef.get();
//   if (docSnapshot.exists) {
//     res
//       .status(200)
//       .json({
//         message: "User Exist",
//         verficationOtp: ("" + Math.random()).substring(2, 6)
//       });
//   } else {
//     res.status(404).json({ error: "User not exsist please do register first" });
//   }
// });

// // Start the server we use the server port I.E 5000 
// const port = 5000;
// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });
