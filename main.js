const express = require("express");
const cors = require("cors");

const app = express();
// postman 
app.use(express.json());
// react 
app.use(cors());
const signUp = require('./signup')
require('./login')
require('./forgetPassword')
require('./newPassword')

signUp

const port = 5000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});