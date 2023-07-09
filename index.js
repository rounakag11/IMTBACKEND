const express = require('express');
const collectionName = require('./config');


const app = express();
app.use(express.json());

// Signup endpoint
app.post('/signup', (req, res) => {
  const { email, password } = req.body;

  collectionName
    .auth()
    .createUser({
      email: email,
      password: password,
    })
    .then((userRecord) => {
      // User created successfully
      console.log('Successfully created new user:', userRecord.uid);
      res.status(200).json({ message: 'User created successfully' });
    })
    .catch((error) => {
      // Error occurred during user creation
      console.log('Error creating new user:', error);
      res.status(500).json({ error: 'Failed to create user' });
    });
});

// Start the server
const port = 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});