const express = require("express");
const bodyParser = require("body-parser");
const database = require("./config");

const app = express();
app.use(bodyParser.json());


app.post("/newPassword", async (req, res) => {
    const { CG_ID, Current_Password , New_Password } = req.body;
  
    const docRef = database.collection("CG_SignUp_DB").doc(`${CG_ID}`);
    if(Current_Password == New_Password){
        res.status(400).json({ error: "New Password And Current Password Are Same" });
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

// Start the server
const port = 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});