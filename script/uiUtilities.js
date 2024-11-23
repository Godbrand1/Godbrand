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


function listSaveFiles() {
    console.log("Initializing saved files list...");
    const saveFilesContainer = document.getElementById('saveFilesContainer');
    if (!saveFilesContainer) {
        console.error("Save files container not found.");
        return;
    }

    // Dummy example for debugging
    saveFilesContainer.innerHTML = '<p>Example Saved File 1</p>';
    console.log("Saved files list populated.");
}


// Ensure the saved files list is properly initialized on page load
window.addEventListener('load', () => {
    const savedFilesContent = document.getElementById('savedFilesContent');
    const toggleButton = document.querySelector('#saveFilesList button');
    if (savedFilesContent && toggleButton) {
        toggleButton.style.display = 'block';
        savedFilesContent.style.display = 'none';
        toggleButton.textContent = 'Show Saved Files';
        listSaveFiles(); // Populate saved files list
    }
});




