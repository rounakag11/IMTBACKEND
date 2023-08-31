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
app.get("/InventoryList", async (req, res) => {

const docRef = database.collection("Inventory")
res.send(200).json({ data: docRef });


});

