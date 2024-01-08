const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

app.post('/save', (req, res) => {
  const { name, message } = req.body;

  // Format the data to be written in the file
  const dataToWrite = `Name: ${name}\nMessage: ${message}\n\n`;

  // Write data to a file named "userData.txt"
  fs.appendFile('userData.txt', dataToWrite, (err) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error saving data.');
    } else {
      console.log('Data saved successfully!');
      res.status(200).send('Data saved successfully!');
    }
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});