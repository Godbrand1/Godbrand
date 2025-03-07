let pauseFlag = false;
let totalRemainingTime = 0; // Total time for all tasks
let currentTaskRemainingTime = 0; // Remaining time for the current task
const volumeSlider = document.getElementById('volumeSlider');

function generateForms() {
    const numTasks = parseInt(document.getElementById('numTasks').value);

    if (isNaN(numTasks) || numTasks <= 0) {
        alert('Please enter a valid number of tasks.');
        return;
    }

    const formContainer = document.getElementById('formContainer');
    formContainer.innerHTML = ''; // Clear previous forms

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
    const body = document.body;
    body.classList.toggle('light-theme');
    console.log("Theme toggled. Current classes:", body.className);
};


// Schedule Alerts Integration
function integrateScheduleAlerts() {
    const savedWakeUpTime = localStorage.getItem('wakeUpTime');
    const savedBedTime = localStorage.getItem('bedTime');
    const scheduleGenerated = localStorage.getItem('scheduleGenerated');

    if (scheduleGenerated && savedWakeUpTime && savedBedTime) {
        // Check and alert during schedule times
        setInterval(() => {
            const now = new Date();
            const currentTime = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

            const schedule = JSON.parse(localStorage.getItem('scheduleTasks'));
            if (schedule) {
                schedule.forEach(task => {
                    if (task.time && task.time === currentTime) {
                        responsiveVoice.speak(`It's time for: ${task.huel ? task.huel : "No Huel for this time."}`, 'UK English Male');
                    }
                });
            }
        }, 60000); // Check every minute
    }
}

window.addEventListener('load', () => {
    integrateScheduleAlerts();
});
// Schedule alerts Integration end


async function startTasks() {
    const numTasks = parseInt(document.getElementById('numTasks').value);
    const stopwatchContainer = document.getElementById('stopwatchContainer');
    const clockDiv = document.getElementById('clock');
    stopwatchContainer.innerHTML = '';
    clockDiv.style.display = 'block'; // Show the clock when tasks start

    totalRemainingTime = 0;

    // Calculate total time for all tasks upfront
    for (let i = 1; i <= numTasks; i++) {
        const durationInput = document.getElementById('duration' + i);
        if (durationInput) {
            totalRemainingTime += parseInt(durationInput.value) || 0;
        }
    }

    // Create stopwatch elements for each task
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

    clockDiv.style.display = 'none'; // Hide the clock when all tasks are completed
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
    pauseFlag = true; // Pause timers
    totalRemainingTime = 0;
    currentTaskRemainingTime = 0;

    document.getElementById('formContainer').innerHTML = ''; // Clear forms
    document.getElementById('stopwatchContainer').innerHTML = ''; // Clear stopwatches
    document.getElementById('clock').style.display = 'none'; // Hide clock

    console.log("Tasks reset.");
}
