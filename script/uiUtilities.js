// uiUtilities.js

window.toggleTheme = function () {
    const body = document.body;
    body.classList.toggle('light-theme');
    console.log("Theme toggled. Current classes:", body.className);
};

function toggleSaveFilesVisibility() {
    const savedFilesContent = document.getElementById('savedFilesContent');
    const toggleButton = document.querySelector('#saveFilesList button');

    // Ensure the saved files content and button are available
    if (!savedFilesContent || !toggleButton) {
        console.error("Saved files content or toggle button not found.");
        return;
    }

    // Toggle the visibility of the saved files content
    if (savedFilesContent.style.display === 'none' || savedFilesContent.style.display === '') {
        savedFilesContent.style.display = 'block';
        toggleButton.textContent = 'Hide Saved Files';
    } else {
        savedFilesContent.style.display = 'none';
        toggleButton.textContent = 'Show Saved Files';
    }
}

// Ensure the saved files list is properly initialized on page load
window.addEventListener('load', () => {
    const savedFilesContent = document.getElementById('savedFilesContent');
    const toggleButton = document.querySelector('#saveFilesList button');
    if (savedFilesContent && toggleButton) {
        toggleButton.style.display = 'block';
        savedFilesContent.style.display = 'none';
        toggleButton.textContent = 'Show Saved Files';
        listSaveFiles(); // Initialize the saved files list on page load
    }
});

// save file list
window.addEventListener('load', () => {
    const saveFilesList = document.getElementById('saveFilesList');
    
    if (saveFilesList) {
        // Ensure the save files list is positioned correctly
        saveFilesList.style.top = '60px'; // Adjust to avoid overlap
        saveFilesList.style.right = '10px';
        saveFilesList.style.position = 'fixed';
    }
});


