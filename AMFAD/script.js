function startTasks() {
    var numTasks = parseInt(prompt('Enter the number of tasks:'));

    if (isNaN(numTasks) || numTasks <= 0) {
        alert('Please enter a valid number of tasks.');
        return;
    }

    var tasks = [];
    for (var i = 1; i <= numTasks; i++) {
        var taskName = prompt(`Enter the name for Task ${i}:`);
        var duration = parseInt(prompt(`Enter the duration (in seconds) for Task ${i}:`));

        if (isNaN(duration) || duration <= 0) {
            alert(`Please enter a valid duration for Task ${i}.`);
            return;
        }

        tasks.push({ taskName, duration });
    }

    runTasksSequentiallyWithDelay(tasks, 0);
}

function runTasksSequentiallyWithDelay(tasks, index) {
    if (index < tasks.length) {
        var task = tasks[index];
        runStopwatch(task.taskName, task.duration, function () {
            runTasksSequentiallyWithDelay(tasks, index + 1);
        });
    }
}

function runStopwatch(taskName, duration, callback) {
    var stopwatchElement = document.getElementById('stopwatch');
    stopwatchElement.innerHTML = `Task: ${taskName}`;

    responsiveVoice.speak(taskName, 'US English Female', {
        onend: function () {
            var start = new Date().getTime();
            var intervalId = setInterval(function () {
                var now = new Date().getTime();
                var elapsed = Math.floor((now - start) / 1000);

                var minutes = Math.floor(elapsed / 60);
                var seconds = elapsed % 60;

                stopwatchElement.innerHTML = `${taskName} - Time Elapsed: ${minutes}m ${seconds}s`;

                if (elapsed >= duration) {
                    clearInterval(intervalId);
                    stopwatchElement.innerHTML = `${taskName} - Task Completed!`;

                    var audioFile = document.getElementById('audioFile').files[0];
                    var audio = new Audio();

                    if (audioFile) {
                        var reader = new FileReader();
                        reader.onload = function (e) {
                            audio.src = e.target.result;
                            audio.onended = function () {
                                callback(); // Call the callback to start the next task
                            };
                            audio.play();
                        };
                        reader.readAsDataURL(audioFile);
                    } else {
                        callback(); // No audio file, proceed to the next task
                    }
                }
            }, 1000);
        }
    });
}