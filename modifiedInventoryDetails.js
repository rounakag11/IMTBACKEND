const express = require("express");
const bodyParser = require("body-parser");
const database = require("./config");
const nodemailer = require('nodemailer')
const app = express();
app.use(bodyParser.json());

app.post("/modifiedInventoryDetails", async (req, res) => {
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
  const newInventory_DocRef = database
    .collection("AddNewInventory")
    .doc(`${User_Name}-${Sl_No}`);
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
    User_Name == ""&&
     User_Role == ""
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
      .update({
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
