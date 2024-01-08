function saveTextToFile() {
  const timeInput = document.getElementById('timeInput').value;
  const nameInput = document.getElementById('nameInput').value;

  const combinedText = `Time: ${timeInput}\nName: ${nameInput}`;

  fetch('/saveFile', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ content: combinedText }),
  })
  .then(response => {
    if (response.ok) {
      console.log('File saved on the server!');
    } else {
      console.error('Failed to save file on the server.');
    }
  })
  .catch(error => {
    console.error('Error occurred while saving file:', error);
  });
}