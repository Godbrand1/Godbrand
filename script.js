let pauseFlag = false;

function pauseStopwatch(button) {
    pauseFlag = !pauseFlag;
    button.textContent = pauseFlag ? "Resume" : "Pause";
}
window.toggleTheme = function () {
    const body = document.body;
    body.classList.toggle('light-theme');
    console.log("Theme toggled. Current classes:", body.className);
};
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

async function startTasks() {
    const numTasks = parseInt(document.getElementById('numTasks').value);
    const stopwatchContainer = document.getElementById('stopwatchContainer');
    stopwatchContainer.innerHTML = '';

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
        stopwatchDiv.textContent = `Task ${i} Time Remaining: 0m 0s`;
        stopwatchContainer.appendChild(stopwatchDiv);

        console.log(`Created stopwatch for task ${i}`);

        await startStopwatch(i, taskNameInput.value, durationInput.value);
    }
}

function startStopwatch(taskNumber, taskName, duration) {
    return new Promise(resolve => {
        if (!responsiveVoice) {
            alert("Text-to-speech functionality is unavailable.");
            resolve();
            return;
        }

        responsiveVoice.speak(`Task ${taskNumber} starting: ${taskName}`, 'UK English Male', {
            onend: () => {
                let remainingTime = parseInt(duration);
                const totalTime = parseInt(duration);
                let intervalId;

                function updateStopwatch() {
                    if (!pauseFlag) {
                        remainingTime--;

                        const stopwatchDiv = document.getElementById('stopwatch' + taskNumber);
                        if (remainingTime >= 0) {
                            const minutes = Math.floor(remainingTime / 60);
                            const seconds = remainingTime % 60;

                            // Update the timer text
                            stopwatchDiv.textContent = `Task ${taskNumber} Time Remaining: ${minutes}m ${seconds}s`;

                            // Update the background to simulate progress
                            const progress = ((totalTime - remainingTime) / totalTime) * 100;
                            stopwatchDiv.style.background = `linear-gradient(to right, #ff9800 ${progress}%, #f0f0f0 ${progress}%)`;
                        } else {
                            clearInterval(intervalId);

                            // Mark task as completed
                            stopwatchDiv.textContent = `Task ${taskNumber} Completed!`;
                            resolve();
                        }
                    }
                }

                updateStopwatch();
                intervalId = setInterval(updateStopwatch, 1000);
            }
        });
    });
}
