const express = require("express");
const cors = require("cors");
const database = require("./config");
const e = require("express");
const {
passwordRegExp,
CGIDRegexp,
  } = require("./asset/regexp");
  
  const app = express();
  // postman 
   app.use(express.json());
  // react 
  app.use(cors());

// Login endpoint
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

