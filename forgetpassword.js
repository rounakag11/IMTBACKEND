const express = require('express');
const bodyParser = require('body-parser');
const database = require('./config'); 

const app = express();
app.use(bodyParser.json());


app.post('/forgetPassword', async (req, res) => {
  const { CG_Email_Address, password } = req.body;
  
  try {
    const docRef = database.collection("InventoryDb").doc(email);
    const docSnapshot = await docRef.get();

    if (docSnapshot.exists) {
      
      await docRef.update({ password });

      res.status(200).json({ message: 'Password updated successfully' });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.log('Error updating password:', error);
    res.status(500).json({ error: 'Failed to update password' });
  }
});

// Start the server
const port = 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
