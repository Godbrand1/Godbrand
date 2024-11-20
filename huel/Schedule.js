// Get references to various elements in the DOM
const scheduleDiv = document.getElementById("schedule");
const dailySummaryDiv = document.getElementById("dailySummary");
const form = document.getElementById("scheduleForm");
const resetButton = document.getElementById("resetButton");
const notificationDiv = document.createElement("div");
notificationDiv.id = "notification";
document.body.appendChild(notificationDiv);

// Set the current date in the header
document.getElementById("currentDate").innerText = new Date().toDateString();

let totalCalories = 0;
let totalWater = 0; // in fl oz (includes Huel mix and additional water)

// Function to calculate times based on wake-up time, bedtime, and calorie goal
function generateSchedule(wakeUpTime, bedTime, dailyCalories) {
    const wakeUpDate = new Date();
    const [wakeHours, wakeMinutes] = wakeUpTime.split(":").map(Number);
    wakeUpDate.setHours(wakeHours, wakeMinutes, 0);

    const bedDate = new Date();
    const [bedHours, bedMinutes] = bedTime.split(":").map(Number);
    bedDate.setHours(bedHours, bedMinutes, 0);

    // If bedtime is earlier than wake-up time, assume it's the next day
    if (bedDate <= wakeUpDate) {
        bedDate.setDate(bedDate.getDate() + 1);
    }

    // Reset totals
    totalCalories = 0;
    totalWater = 0;

    // Suggested daily water intake based on weight (150 lbs / 2 = 75 oz)
    const suggestedWaterIntake = 75;

    // Calculating scoops needed for desired calorie intake
    const caloriesPerScoop = 200;
    const totalScoops = Math.ceil(dailyCalories / caloriesPerScoop);

    // Dividing scoops between meals
    const scoopsPerMeal = Math.floor(totalScoops / 3);
    const scoopsForSnack = totalScoops % 3; // Remaining scoops allocated for an optional snack

    const huelWaterPerMeal = 500 / 29.5735; // 500 ml in fl oz (approximately 16.9 fl oz)

    const tasks = [
        {
            huel: `Mix ${scoopsPerMeal} scoops of Huel Black with 500 ml (16.9 fl oz) of water.`,
            water: `Then, drink an additional 12 oz of plain water.`,
            huelWater: huelWaterPerMeal,
            additionalWater: 12,
            calories: scoopsPerMeal * caloriesPerScoop,
            time: wakeUpDate
        },
        {
            huel: `Mix ${scoopsPerMeal} scoops of Huel Black with 500 ml (16.9 fl oz) of water.`,
            water: `Then, drink an additional 12 oz of plain water.`,
            huelWater: huelWaterPerMeal,
            additionalWater: 12,
            calories: scoopsPerMeal * caloriesPerScoop
        },
        {
            huel: `Mix ${scoopsPerMeal} scoops of Huel Black with 500 ml (16.9 fl oz) of water.`,
            water: `Then, drink an additional 12 oz of plain water.`,
            huelWater: huelWaterPerMeal,
            additionalWater: 12,
            calories: scoopsPerMeal * caloriesPerScoop
        },
    ];

    // Adding evening snack if there are remaining scoops
    if (scoopsForSnack > 0) {
        tasks.push({
            huel: `Mix ${scoopsForSnack} scoops of Huel Black with 500 ml (16.9 fl oz) of water.`,
            water: `Then, drink an additional 8 oz of plain water.`,
            huelWater: huelWaterPerMeal,
            additionalWater: 8,
            calories: scoopsForSnack * caloriesPerScoop
        });
    }

    // Adding additional water intake to meet hydration needs
    tasks.push({
        huel: null,
        water: "Drink additional plain water throughout the day (~9 oz) to meet your hydration needs.",
        huelWater: 0,
        additionalWater: 9,
        calories: 0
    });

    // Calculate evenly spaced meal times
    const intervals = (bedDate - wakeUpDate) / (tasks.length - 1); // Divide waking hours among tasks
    tasks.forEach((task, index) => {
        if (index > 0) {
            task.time = new Date(wakeUpDate.getTime() + intervals * index);
        }

        // Update totals
        totalCalories += task.calories;
        totalWater += task.huelWater + task.additionalWater;
    });

    // Clear previous schedule and summary
    scheduleDiv.innerHTML = "";
    dailySummaryDiv.innerHTML = "";

    // Display schedule
    tasks.forEach(task => {
        const formattedTime = task.time ? task.time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "";
        const scheduleItem = document.createElement("div");
        scheduleItem.classList.add("schedule-item");
        scheduleItem.innerHTML = `
            <strong class="time">${formattedTime}:</strong>
            <p><strong>Huel:</strong> ${task.huel ? task.huel : "No Huel for this time."}</p>
            <p><strong>Water:</strong> ${task.water}</p>
        `;
        scheduleDiv.appendChild(scheduleItem);
    });

    // Display total calories and water in the summary section
    dailySummaryDiv.innerHTML = `
        <h2>Daily Summary</h2>
        <p><strong>Total Calories:</strong> ${totalCalories} kcal</p>
        <p><strong>Total Water Intake (including Huel mix and additional water):</strong> ${totalWater.toFixed(1)} fl oz</p>
        <p><strong>Suggested Daily Water Intake:</strong> ${suggestedWaterIntake} fl oz</p>
        <p><strong>Additional Water Needed:</strong> ${Math.max(0, suggestedWaterIntake - totalWater).toFixed(1)} fl oz</p>
    `;

    // Hide form and show reset button
    form.style.display = "none";
    resetButton.style.display = "block";

    // Save form data to localStorage
    localStorage.setItem('wakeUpTime', wakeUpTime);
    localStorage.setItem('bedTime', bedTime);
    localStorage.setItem('dailyCalories', dailyCalories);
    localStorage.setItem('scheduleGenerated', 'true');

    // Start notifications
    setNotifications(tasks);
}

// Function to display notifications
function showNotification(message) {
    notificationDiv.innerText = message;
    notificationDiv.classList.add("active");

    setTimeout(() => {
        notificationDiv.classList.remove("active");
        notificationDiv.innerText = "";
    }, 5000);
}

// Function to check time and trigger notifications
function setNotifications(schedule) {
    setInterval(() => {
        const now = new Date();
        const currentTime = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

        schedule.forEach(item => {
            if (item.time && item.time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) === currentTime) {
                showNotification(`It's time for: Huel: ${item.huel ? item.huel : "No Huel for this time."} | Water: ${item.water}`);
            }
        });
    }, 60000);
}

// Handle form submission
form.addEventListener("submit", event => {
    event.preventDefault(); // Prevent form default behavior
    const wakeUpTime = document.getElementById("wakeUpTime").value;
    const bedTime = document.getElementById("bedTime").value;
    const dailyCalories = parseInt(document.getElementById("dailyCalories").value);
    if (wakeUpTime && bedTime && dailyCalories) {
        generateSchedule(wakeUpTime, bedTime, dailyCalories);
    }
});

// Handle reset button click to clear localStorage
resetButton.addEventListener("click", () => {
    localStorage.clear(); // Clear saved data
    location.reload(); // Reload the page to reset everything
});

// Load saved data from localStorage when page loads
window.addEventListener('load', () => {
    const savedWakeUpTime = localStorage.getItem('wakeUpTime');
    const savedBedTime = localStorage.getItem('bedTime');
    const savedDailyCalories = localStorage.getItem('dailyCalories');
    const scheduleGenerated = localStorage.getItem('scheduleGenerated');

    if (scheduleGenerated && savedWakeUpTime && savedBedTime && savedDailyCalories) {
        generateSchedule(savedWakeUpTime, savedBedTime, parseInt(savedDailyCalories));
    }
});
