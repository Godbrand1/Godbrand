let pauseFlag = false;
let totalRemainingTime = 0;
let currentTaskRemainingTime = 0;
// Retrieve the volumeSlider element
const volumeSlider = document.getElementById('volumeSlider');

if (volumeSlider) {
    // Parse the slider's value as a float
    const volumeValue = parseFloat(volumeSlider.value) / 100;

    // Check if the value is a number and within the range 0 to 1
    if (!isNaN(volumeValue) && volumeValue >= 0 && volumeValue <= 1) {
        console.log('Volume Slider Value:', volumeValue);
        // Proceed with using volumeValue
    } else {
        console.error('Volume slider value is out of range. Please set a value between 0 and 1.');
        // Set a default volume value or handle the error as needed
    }
} else {
    console.error('Volume slider element not found.');
    // Handle the absence of the volume slider element as needed
}


function generateForms() {
    const numTasks = parseInt(document.getElementById('numTasks').value);

    if (isNaN(numTasks) || numTasks <= 0) {
        alert('Please enter a valid number of tasks.');
        return;
    }

    const formContainer = document.getElementById('formContainer');
    formContainer.innerHTML = '';

    for (let i = 1; i <= numTasks; i++) {
        const taskForm = document.createElement('div');
        taskForm.className = 'task-form';
        taskForm.innerHTML = `
            <label for="taskName${i}">Task ${i} Name:</label>
            <input type="text" id="taskName${i}" placeholder="Enter task name">
            <label for="duration${i}">Duration (seconds):</label>
            <input type="number" id="duration${i}" min="1" placeholder="Enter duration">
        `;
        formContainer.appendChild(taskForm);
    }
}

window.toggleTheme = function () {
    document.body.classList.toggle('light-theme');
    console.log("Theme toggled. Current classes:", document.body.className);
};

async function startTasks() {
    const numTasks = parseInt(document.getElementById('numTasks').value);
    const stopwatchContainer = document.getElementById('stopwatchContainer');
    const clockDiv = document.getElementById('clock');
    stopwatchContainer.innerHTML = '';
    clockDiv.style.display = 'block';

    totalRemainingTime = 0;

    for (let i = 1; i <= numTasks; i++) {
        const durationInput = document.getElementById('duration' + i);
        if (durationInput) {
            totalRemainingTime += parseInt(durationInput.value) || 0;
        }
    }

    for (let i = 1; i <= numTasks; i++) {
        const taskNameInput = document.getElementById('taskName' + i);
        const durationInput = document.getElementById('duration' + i);

        if (!taskNameInput.value || isNaN(durationInput.value) || durationInput.value <= 0) {
            alert(`Please enter a valid name and duration for Task ${i}.`);
            return;
        }

        const stopwatchDiv = document.createElement('div');
        stopwatchDiv.className = 'stopwatch';
        stopwatchDiv.id = 'stopwatch' + i;

        const progressOverlay = document.createElement('div');
        progressOverlay.className = 'progress-overlay';
        stopwatchDiv.appendChild(progressOverlay);

        const stopwatchText = document.createElement('div');
        stopwatchText.className = 'stopwatch-text';
        stopwatchText.textContent = `Task ${i} Time Remaining: 0m 0s`;
        stopwatchDiv.appendChild(stopwatchText);

        stopwatchContainer.appendChild(stopwatchDiv);

        console.log(`Created stopwatch for task ${i}`);

        await startStopwatch(i, taskNameInput.value, durationInput.value);
    }

    clockDiv.style.display = 'none';
}

function startStopwatch(taskNumber, taskName, duration) {
    return new Promise(resolve => {
        let remainingTime = parseInt(duration);
        const totalTime = parseInt(duration);
        let intervalId;

        const stopwatchDiv = document.getElementById('stopwatch' + taskNumber);
        const progressOverlay = stopwatchDiv.querySelector('.progress-overlay');
        const stopwatchText = stopwatchDiv.querySelector('.stopwatch-text');
        const currentTaskClock = document.getElementById('current-task-time');
        const totalClock = document.getElementById('total-time');

        if (!stopwatchDiv || !progressOverlay || !stopwatchText) {
            console.error(`Stopwatch or elements missing for Task ${taskNumber}`);
            resolve();
            return;
        }

        if (typeof responsiveVoice === 'undefined') {
            alert("Text-to-speech functionality is unavailable.");
            resolve();
            return;
        }

        currentTaskRemainingTime = totalTime;

        // Retrieve the current volume value from the slider
        const volumeValue = parseFloat(volumeSlider.value) / 100;

        // Start the speech concurrently
        responsiveVoice.speak(`Task ${taskNumber} starting: ${taskName}`, 'UK English Male', {
            volume: volumeValue,
            onend: () => {
                intervalId = setInterval(() => {
                    if (!pauseFlag) {
                        remainingTime--;
                        currentTaskRemainingTime = Math.max(remainingTime, 0);
                        totalRemainingTime = Math.max(totalRemainingTime - 1, 0);

                        if (remainingTime >= 0) {
                            const minutes = Math.floor(remainingTime / 60);
                            const seconds = remainingTime % 60;

                            stopwatchText.textContent = `Task ${taskNumber} Time Remaining: ${minutes}m ${seconds}s`;
                            progressOverlay.style.width = `${((totalTime - remainingTime) / totalTime) * 100}%`;

                            currentTaskClock.textContent = `Current Task: ${minutes}m ${seconds}s`;
                            const totalMinutes = Math.floor(totalRemainingTime / 60);
                            const totalSeconds = totalRemainingTime % 60;
                            totalClock.textContent = `Total Remaining: ${totalMinutes}m ${totalSeconds}s`;
                        } else {
                            clearInterval(intervalId);
                            stopwatchText.textContent = `Task ${taskNumber} Completed!`;
                            resolve();
                        }
                    }
                }, 1000);
            }
        });
    });
}


function pauseStopwatch(button) {
    pauseFlag = !pauseFlag;
    button.textContent = pauseFlag ? "Resume" : "Pause";
    console.log(pauseFlag ? "Timers paused." : "Timers resumed.");
}

function resetTasks() {
    pauseFlag = true;
    totalRemainingTime = 0;
    currentTaskRemainingTime = 0;

    document.getElementById('formContainer').innerHTML = '';
    document.getElementById('stopwatchContainer').innerHTML = '';
    document.getElementById('clock').style.display = 'none';

    console.log("Tasks reset.");
}
