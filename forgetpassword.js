const express = require("express");
const bodyParser = require("body-parser");
const database = require("./config");



const app = express();
app.use(bodyParser.json());

app.post("/forgetPassword", async (req, res) => {
  const { CG_ID } = req.body;
  const docRef = database.collection("CG_SignUp_DB").doc(`${CG_ID}`);
  const docSnapshot = await docRef.get();
  if (docSnapshot.exists) {
    res
      .status(200)
      .json({
        message: "User Exist",
        verficationOtp: ("" + Math.random()).substring(2, 6)
      });
  } else {
    res.status(404).json({ error: "User not exsist please do register first" });
  }
});

// Start the server we use the server port I.E 5000 
const port = 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
