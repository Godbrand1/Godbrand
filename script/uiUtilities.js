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
    const saveFilesContainer = document.getElementById('saveFilesContainer');
    if (!saveFilesContainer) {
        console.error("Save files container not found.");
        return;
    }
    saveFilesContainer.innerHTML = ''; // Clear existing entries

    const EXCLUDED_KEYS = RESERVED_NAMES;
    let hasSavedFiles = false;

    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (EXCLUDED_KEYS.includes(key)) {
            continue;
        }

        hasSavedFiles = true;

        const saveFileDiv = document.createElement('div');
        saveFileDiv.className = 'save-file-div';

        const saveFileButton = document.createElement('button');
        saveFileButton.className = 'save-file-button';
        saveFileButton.textContent = key;
        saveFileButton.onclick = () => loadTasksFromLocalStorageByName(key);

        const deleteButton = document.createElement('span');
        deleteButton.className = 'delete-save-file';
        deleteButton.textContent = 'X';
        deleteButton.setAttribute('aria-label', `Delete ${key}`);
        deleteButton.onclick = (e) => {
            e.stopPropagation();
            deleteSaveFile(key);
        };

        saveFileDiv.appendChild(saveFileButton);
        saveFileDiv.appendChild(deleteButton);
        saveFilesContainer.appendChild(saveFileDiv);
    }

    const savedFilesContent = document.getElementById('savedFilesContent');
    savedFilesContent.style.display = hasSavedFiles ? 'block' : 'none';
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




