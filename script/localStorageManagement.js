const RESERVED_NAMES = [
    'wakeUpTime',
    'connectCodes',
    'bedTime',
    'scheduleTasks',
    'scheduleGenerated',
    'Huel',
    'customLists',
    'dailyCalories'
];

function saveTasksWithName() {
    const saveFileNameInput = document.getElementById('saveFileName');
    const saveFileName = saveFileNameInput.value.trim();

    if (!saveFileName) {
        alert("Please enter a name for the save file.");
        return;
    }

    if (RESERVED_NAMES.includes(saveFileName)) {
        alert(`"${saveFileName}" is a reserved name and cannot be used.`);
        return;
    }

    try {
        const numTasks = parseInt(document.getElementById('numTasks').value);
        if (isNaN(numTasks) || numTasks <= 0) {
            throw new Error("Invalid number of tasks.");
        }

        const tasks = [];
        for (let i = 1; i <= numTasks; i++) {
            const taskName = document.getElementById(`taskName${i}`)?.value;
            const duration = parseInt(document.getElementById(`duration${i}`)?.value || 0);
            if (!taskName || isNaN(duration) || duration <= 0) {
                throw new Error("Invalid task data.");
            }
            tasks.push({ name: taskName, duration });
        }

        // Save tasks to localStorage
        localStorage.setItem(saveFileName, JSON.stringify(tasks));
        console.log(`Tasks saved as "${saveFileName}".`);

        // Refresh the list of saved files
        listSaveFiles();

        // Clear the save file name input
        saveFileNameInput.value = '';
    } catch (error) {
        console.error("Error saving tasks:", error);
        alert("Error saving tasks. Please check the input data.");
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
            continue; // Skip excluded keys
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
    savedFilesContent.style.display = hasSavedFiles ? 'block' : 'none'; // Toggle visibility
}

function deleteSaveFile(saveFileName) {
    if (confirm(`Are you sure you want to delete the save file "${saveFileName}"?`)) {
        localStorage.removeItem(saveFileName);
        console.log(`Save file "${saveFileName}" deleted.`);
        listSaveFiles(); // Refresh the list of saved files
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

        console.log(`Loaded tasks from save file: "${saveFileName}"`);
    }
}

function clearLocalStorage() {
    localStorage.clear();
    alert("All saved tasks have been cleared.");
    console.log("LocalStorage cleared.");
    listSaveFiles();
}
