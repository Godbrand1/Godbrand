function exportData() {
  const dataStr = JSON.stringify(playerLists, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'playerLists.json';
  a.click();
  URL.revokeObjectURL(url);
}

function importData(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target.result);
        Object.keys(importedData).forEach(listName => {
          if (!playerLists[listName]) {
            playerLists[listName] = importedData[listName];
          } else {
            playerLists[listName] = [...playerLists[listName], ...importedData[listName]];
          }
        });
        localStorage.setItem('playerLists', JSON.stringify(playerLists));
        updateListSelector();
        filterPlayers();
      } catch (error) {
        alert('Failed to import data. Please ensure the file is in the correct format.');
      }
    };
    reader.readAsText(file);
  }
}