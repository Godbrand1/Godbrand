// localStorageManagement.js

function saveTasksWithName() {
    const saveFileName = document.getElementById('saveFileName').value.trim();
    if (!saveFileName) {
        alert("Please enter a name for the save file.");
        return;
    }

    // Reserved names that cannot be used
    const reservedNames = ['wakeUpTime', 'customLists', 'connectCodes', 'bedTime', 'scheduleTasks', 'scheduleGenerated', 'Huel', 'dailyCalories'];

    // Check if the entered name is a reserved name
    if (reservedNames.includes(saveFileName)) {
        alert(`"${saveFileName}" is a reserved name and cannot be used.`);
        return;
    }

    const numTasks = parseInt(document.getElementById('numTasks').value);
    if (isNaN(numTasks) || numTasks <= 0) {
        alert("Please enter a valid number of tasks.");
        return;
    }

    let tasks = [];
    for (let i = 1; i <= numTasks; i++) {
        const taskName = document.getElementById('taskName' + i)?.value;
        const duration = document.getElementById('duration' + i)?.value;

        if (taskName && duration) {
            tasks.push({
                name: taskName,
                duration: parseInt(duration),
            });
        }
    }

    localStorage.setItem(saveFileName, JSON.stringify(tasks));
    console.log(`Tasks saved to localStorage under name: ${saveFileName}`);
    listSaveFiles(); // Refresh the list of saved files

    // Show saved files section if not empty
    const savedFilesContent = document.getElementById('savedFilesContent');
    savedFilesContent.style.display = 'block';
}


function listSaveFiles() {
    const saveFilesContainer = document.getElementById('saveFilesContainer');
    saveFilesContainer.innerHTML = '';

    // Define the list of keys to exclude
    const excludedKeys = ['wakeUpTime', 'customLists', 'connectCodes', 'bedTime', 'scheduleTasks', 'scheduleGenerated', 'Huel', 'dailyCalories'];


    let hasSavedFiles = false;

    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);

        // Check if the key is in the excludedKeys array
        if (excludedKeys.includes(key)) {
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
        deleteButton.setAttribute('aria-label', 'Delete ' + key);
        deleteButton.onclick = (e) => {
            e.stopPropagation(); // Prevent triggering the load function
            deleteSaveFile(key);
        };

        saveFileDiv.appendChild(saveFileButton);
        saveFileDiv.appendChild(deleteButton);
        saveFilesContainer.appendChild(saveFileDiv);
    }

    // If there are no saved files, keep the content hidden
    const savedFilesContent = document.getElementById('savedFilesContent');
    if (hasSavedFiles) {
        savedFilesContent.style.display = 'block';
    } else {
        savedFilesContent.style.display = 'none'; // Keep hidden, user can show it with the button
    }
}

function deleteSaveFile(saveFileName) {
    if (confirm(`Are you sure you want to delete the save file "${saveFileName}"?`)) {
        localStorage.removeItem(saveFileName);
        console.log(`Save file "${saveFileName}" deleted.`);
        listSaveFiles(); // Refresh the list of saved files

        // Hide saved files section if no save files remain
        const savedFilesContent = document.getElementById('savedFilesContent');
        let hasSavedFiles = false;
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (!['wakeUpTime', 'bedTime', 'scheduleTasks', 'scheduleGenerated', 'Huel', 'dailyCalories'].includes(key)) {
                hasSavedFiles = true;
                break;
            }
        }

        if (!hasSavedFiles) {
            savedFilesContent.style.display = 'none';
        }
    }
}

function loadTasksFromLocalStorageByName(saveFileName) {
    const tasks = JSON.parse(localStorage.getItem(saveFileName));
    if (tasks) {
        const formContainer = document.getElementById('formContainer');
        formContainer.innerHTML = ''; // Clear previous task forms
        document.getElementById('numTasks').value = tasks.length;

        tasks.forEach((task, index) => {
            const taskForm = document.createElement('div');
            taskForm.className = 'task-form';
            taskForm.innerHTML = `
                <label for="taskName${index + 1}">Task ${index + 1} Name:</label>
                <input type="text" id="taskName${index + 1}" placeholder="Enter task name" value="${task.name}">
                <label for="duration${index + 1}">Duration (seconds):</label>
                <input type="number" id="duration${index + 1}" min="1" placeholder="Enter duration" value="${task.duration}">
            `;
            formContainer.appendChild(taskForm);
        });

        console.log(`Loaded tasks from save file: ${saveFileName}`);
    }
}


function clearLocalStorage() {
    localStorage.removeItem('tasks');
    alert("Saved tasks have been cleared.");
    console.log("LocalStorage cleared for tasks.");
}
