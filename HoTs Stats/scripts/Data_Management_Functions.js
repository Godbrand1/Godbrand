// Ensure playerLists is defined
if (typeof playerLists === 'undefined') {
  const playerLists = JSON.parse(localStorage.getItem('playerLists')) || {};
}

function exportData() {
  if (Object.keys(playerLists).length === 0) {
    alert('No player lists to export.');
    return;
  }

  const dataStr = JSON.stringify(playerLists, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'playerLists.json';
  a.click();
  URL.revokeObjectURL(url);

  alert('Data exported successfully.');
}

function importData(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target.result);

        // Validate imported JSON structure
        if (typeof importedData !== 'object' || importedData === null) {
          throw new Error('Invalid JSON structure.');
        }

        Object.keys(importedData).forEach(listName => {
          if (!playerLists[listName]) {
            playerLists[listName] = importedData[listName];
          } else {
            importedData[listName].forEach(importedPlayer => {
              const existingPlayer = playerLists[listName].find(player => player.name === importedPlayer.name);
              if (!existingPlayer) {
                playerLists[listName].push(importedPlayer);
              }
            });
          }
        });

        localStorage.setItem('playerLists', JSON.stringify(playerLists));
        updateListSelector();
        filterPlayers();

        alert('Data imported successfully.');
      } catch (error) {
        alert('Failed to import data. Please ensure the file is in the correct format.');
      }
    };

    reader.readAsText(file);
  } else {
    alert('No file selected.');
  }
}

// Ensure importData is connected to an input element
document.addEventListener('DOMContentLoaded', () => {
  const importInput = document.getElementById('import-json-input');
  if (importInput) {
    importInput.addEventListener('change', importData);
  } else {
    console.error('Element with ID "import-json-input" not found.');
  }

  const exportButton = document.getElementById('export-data-button');
  if (exportButton) {
    exportButton.addEventListener('click', exportData);
  } else {
    console.error('Element with ID "export-data-button" not found.');
  }
});

// Ensure updateListSelector and filterPlayers functions are defined
function updateListSelector() {
  // ...existing code...
}

function filterPlayers() {
  // ...existing code...
}
