const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(express.json());

app.post('/saveFile', (req, res) => {
  const content = req.body.content;

  // You can modify the file path and name as per your server's file structure
  const filePath = 'path/to/your/server/directory/combined_data.txt';

  fs.writeFile(filePath, content, (err) => {
    if (err) {
      console.error('Error occurred while saving file:', err);
      res.status(500).send('Error occurred while saving file.');
    } else {
      console.log('File saved successfully!');
      res.sendStatus(200);
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});