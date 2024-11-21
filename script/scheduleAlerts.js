// scheduleAlerts.js

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
