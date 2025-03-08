function addToHistory(total) {
    const historyList = document.getElementById('history-list');
    const listItem = document.createElement('li');
    const now = new Date();

    // Get the day of the week
    const dayOfWeek = now.toLocaleString('en-US', { weekday: 'long' });

    // Get the formatted date (MM-DD format)
    const formattedDate = `${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

    // Manually format time in 12-hour format
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const amPm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12; // Convert 0 to 12-hour format

    const formattedTime = `${hours}:${minutes} ${amPm}`;

    // Calculate the amount difference and determine the color class
    const amountDifference = total - 50;
    const colorClass = amountDifference < 0 ? 'under' : 'over';
    const differenceText = amountDifference < 0 ? `under by $${Math.abs(amountDifference).toFixed(2)}` : `over by $${Math.abs(amountDifference).toFixed(2)}`;

    // Create the list item with structured data
    listItem.innerHTML = `
        <div class="history-date">${dayOfWeek}, ${formattedDate}</div>
        <div class="history-entry ${colorClass}">
            Total: $${total} at ${formattedTime} (${differenceText})
        </div>
    `;

    // Append the list item to the history list
    historyList.appendChild(listItem);

    // Save the history to localStorage
    saveHistoryToLocalStorage(total, dayOfWeek, formattedDate, formattedTime, differenceText, colorClass);
}

function saveHistoryToLocalStorage(total, dayOfWeek, formattedDate, formattedTime, differenceText, colorClass) {
    // Get existing history from localStorage
    let historyItems = JSON.parse(localStorage.getItem('history')) || [];

    // Add the new entry as an object
    historyItems.push({
        total,
        dayOfWeek,
        formattedDate,
        formattedTime,
        differenceText,
        colorClass
    });

    // Save the array back to localStorage
    localStorage.setItem('history', JSON.stringify(historyItems));
}

function loadHistoryFromLocalStorage() {
    const historyList = document.getElementById('history-list');

    // Get the history from localStorage
    const historyItems = JSON.parse(localStorage.getItem('history')) || [];

    // If there are saved history items, add them to the list
    historyItems.forEach(({ total, dayOfWeek, formattedDate, formattedTime, differenceText, colorClass }) => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <div class="history-date">${dayOfWeek}, ${formattedDate}</div>
            <div class="history-entry ${colorClass}">
                Total: $${total} at ${formattedTime} (${differenceText})
            </div>
        `;
        historyList.appendChild(listItem);
    });
}

function deleteMostRecent() {
    const historyList = document.getElementById('history-list');
    const historyItems = JSON.parse(localStorage.getItem('history')) || [];

    if (historyItems.length > 0) {
        // Remove the most recent item from the local storage array
        historyItems.pop();

        // Save the updated array back to localStorage
        localStorage.setItem('history', JSON.stringify(historyItems));

        // Remove the most recent item from the displayed list
        historyList.removeChild(historyList.lastChild);
    }
}

// Calculate the total amount and add to history
function calculateMoney() {
    let fifties = document.getElementById('fifty').value;
    let twenties = document.getElementById('twenty').value;
    let tens = document.getElementById('ten').value;
    let fives = document.getElementById('five').value;
    let ones = document.getElementById('one').value;
    let quarters = document.getElementById('quarter').value;
    let dimes = document.getElementById('dime').value;
    let nickels = document.getElementById('nickel').value;
    let pennies = document.getElementById('penny').value;
    let extra_money = document.getElementById('extra_moneyz').value;

    // Parse the values so they're numbers and not strings
    let extraMoneyValue = parseInt(extra_money) || 0;
    let fiftyValue = parseInt(fifties) || 0;
    let twentyValue = parseInt(twenties) || 0;
    let tenValue = parseInt(tens) || 0;
    let fiveValue = parseInt(fives) || 0;
    let oneValue = parseInt(ones) || 0;
    let quarterValue = parseInt(quarters) || 0;
    let dimeValue = parseInt(dimes) || 0;
    let nickelValue = parseInt(nickels) || 0;
    let pennyValue = parseInt(pennies) || 0;

    // Calculate the total amount
    let totalAmount1 = fiftyValue * 50;
    let totalAmount2 = twentyValue * 20;
    let totalAmount3 = tenValue * 10;
    let totalAmount4 = fiveValue * 5;
    let totalAmount5 = oneValue * 1;
    let totalAmount6 = quarterValue * 0.25;
    let totalAmount7 = dimeValue * 0.1;
    let totalAmount8 = nickelValue * 0.05;
    let totalAmount9 = pennyValue * 0.01;

    // Calculate the total amount
    let totalAmount = totalAmount1 + totalAmount2 + totalAmount3 + totalAmount4 + totalAmount5 + totalAmount6 + totalAmount7 + totalAmount8 + totalAmount9 + extraMoneyValue;
    let roundedToHundredth = Math.round(totalAmount * 100) / 100;

    // Grab the output1 value
    let out1 = document.getElementById('output1');

    // Clear any existing content because without this it would create a million boxes
    out1.textContent = '';

    // Create a new element to contain the result
    let resultDiv = document.createElement('div');
    resultDiv.textContent = roundedToHundredth;

    // Append the new element to the output container
    out1.appendChild(resultDiv);

    // Add the result to the history
    addToHistory(roundedToHundredth);
}

// Load history when the page is loaded
document.addEventListener('DOMContentLoaded', loadHistoryFromLocalStorage);