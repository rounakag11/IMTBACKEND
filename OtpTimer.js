const express = require("express");
const bodyParser = require("body-parser");
const database = require("./config");

const app = express();
app.use(bodyParser.json());
const otpStorage = {}; // Store OTP and its creation timestamp

function generateOTP() {

  return ("" + Math.random()).substring(2, 6);

}

function isOTPValid(CG_ID) {
 if (otpStorage[CG_ID]) {
 const currentTime = Date.now();
const { timestamp, validFor } = otpStorage[CG_ID];
return currentTime <= timestamp + validFor;
}
return false;

}
app.post("/OtpTimer", async (req, res) => {
const { CG_ID } = req.body;
 const docRef = database.collection("CG_SignUp_DB").doc(`${CG_ID}`);
const docSnapshot = await docRef.get();
if (docSnapshot.exists) {
 const otp = generateOTP();
 const timestamp = Date.now(); // Get the current timestamp in milliseconds
const validFor = 2 * 60 * 1000; // Validity period in milliseconds (2 minutes)
otpStorage[CG_ID] = { otp, timestamp, validFor }; // Store the OTP, its timestamp, and validity period

 // Clear the OTP data after the validity period
setTimeout(() => {
 delete otpStorage[CG_ID];
}, validFor);
 res.status(200).json({
message: "User Exist",
verficationOtp: otp,
validFor: validFor // Send the validity period in milliseconds (2 minutes)
});

  } else {
res.status(404).json({ error: "User does not exist. Please register first." });
}
});
app.post("/verifyOTP", async (req, res) => {
const { CG_ID, otp } = req.body;
if (isOTPValid(CG_ID)) {
if (otpStorage[CG_ID].otp === otp) {
res.status(200).json({ message: "OTP verified successfully!" });
} else {
res.status(400).json({ error: "Invalid OTP, please try again." });
}
 } else {
// OTP has expired
delete otpStorage[CG_ID];
res.status(400).json({ error: "OTP expired, please request a new one." });
}
});
// Start the server on port 5000
const port = 5000;
app.listen(port, () => {
console.log(`Server is running on port ${port}`);

});