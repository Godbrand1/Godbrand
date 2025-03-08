// function to generate a unique identifier
function generateUUID() {
    return 'xxxx-xxxx-4xxx-yxxx-xxxx-xxxx-xxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0,
            v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

// function to calculate money
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

    // parse the values so they're numbers and not strings
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

    // calculate moneyz 
    let totalAmount1 = fiftyValue * 50;
    let totalAmount2 = twentyValue * 20;
    let totalAmount3 = tenValue * 10;
    let totalAmount4 = fiveValue * 5;
    let totalAmount5 = oneValue * 1;
    let totalAmount6 = quarterValue * 0.25;
    let totalAmount7 = dimeValue * 0.1;
    let totalAmount8 = nickelValue * 0.05;
    let totalAmount9 = pennyValue * 0.01;
    let totalAmount = totalAmount1 + totalAmount2 + totalAmount3 + totalAmount4 + totalAmount5 + totalAmount6 + totalAmount7 + totalAmount8 + totalAmount9 + extraMoneyValue;
    let roundedToHundredth = totalAmount.toFixed(2);

    // Display error message if total amount is zero or below
    let errorMessage = document.getElementById('error-message');
    if (roundedToHundredth <= 0 || roundedToHundredth <= 0) {
        errorMessage.textContent = 'Enter values greater than 0.';
        return;
    } else {
        errorMessage.textContent = '';
    }

    // calculate difference from $50.00
    let difference = roundedToHundredth - 50;
    let differenceText = difference > 0 ? `Over by $${difference.toFixed(2)}` : `Under by $${Math.abs(difference).toFixed(2)}`;
    let differenceAmountText = difference > 0 ? `+$${difference.toFixed(2)}` : `-$${Math.abs(difference).toFixed(2)}`;
    let differenceColor = difference > 0 ? 'green' : 'red';

    // grab the output1 value
    let out1 = document.getElementById('output1');

    // grab the difference value
    let diffElement = document.getElementById('difference');

    // Clear any existing content
    out1.textContent = '';
    diffElement.textContent = '';

    // Create new elements to contain the results
    let resultDiv = document.createElement('div');
    resultDiv.textContent = `$${roundedToHundredth} `;

    let diffAmountSpan = document.createElement('span');
    diffAmountSpan.classList.add('history-diff-amount'); // Add class for CSS targeting
    diffAmountSpan.textContent = differenceAmountText;
    diffAmountSpan.style.color = differenceColor;

    resultDiv.appendChild(diffAmountSpan);

    let diffDiv = document.createElement('div');
    diffDiv.textContent = differenceText;
    diffDiv.style.color = difference > 0 ? 'green' : 'orange';

    // Append the new elements to the output containers
    out1.appendChild(resultDiv);
    diffElement.appendChild(diffDiv);

    // Generate a unique identifier for the history item
    let uuid = generateUUID();

    // Update the history
    let historyList = document.getElementById('history-list');
    let historyItem = document.createElement('li');
    let historyItemContent = document.createElement('div');
    historyItemContent.classList.add('history-item');
    let historyText = document.createElement('span');
    historyText.textContent = `$${roundedToHundredth}`;
    let historyDiffAmount = document.createElement('span');
    historyDiffAmount.classList.add('history-diff-amount'); // Add class for CSS targeting
    historyDiffAmount.textContent = differenceAmountText;
    historyDiffAmount.style.color = differenceColor;
    let historyDiff = document.createElement('span');
    historyDiff.textContent = differenceText;
    historyDiff.classList.add('difference-text');
    historyItemContent.appendChild(historyText);
    historyItemContent.appendChild(historyDiffAmount);
    historyItemContent.appendChild(historyDiff);
    historyItem.appendChild(historyItemContent);
    historyItem.setAttribute('data-id', uuid);
    historyItem.ondblclick = () => {
        historyItem.remove();
        removeFromLocalStorage(uuid);
    }; // Double-click to remove
    historyList.appendChild(historyItem);

    // Save to local storage
    saveHistory({ id: uuid, value: roundedToHundredth, difference: differenceAmountText });
}

// function to reset values
function resetValues() {
    document.getElementById('fifty').value = 0;
    document.getElementById('twenty').value = 0;
    document.getElementById('ten').value = 0;
    document.getElementById('five').value = 0;
    document.getElementById('one').value = 0;
    document.getElementById('quarter').value = 0;
    document.getElementById('dime').value = 0;
    document.getElementById('nickel').value = 0;
    document.getElementById('penny').value = 0;
    document.getElementById('extra_moneyz').value = 0;
}

// function to increment value
function incrementValue(id) {
    let element = document.getElementById(id);
    element.value = parseInt(element.value) + 1;
}

// function to decrement value
function decrementValue(id) {
    let element = document.getElementById(id);
    if (parseInt(element.value) > 0) {
        element.value = parseInt(element.value) - 1;
    }
}

// function to save history to local storage
function saveHistory(entry) {
    let history = JSON.parse(localStorage.getItem('calculationHistory')) || [];
    history.push(entry);
    localStorage.setItem('calculationHistory', JSON.stringify(history));
}

// function to load history from local storage
function loadHistory() {
    let history = JSON.parse(localStorage.getItem('calculationHistory')) || [];
    let historyList = document.getElementById('history-list');
    history.forEach(entry => {
        let historyItem = document.createElement('li');
        let historyItemContent = document.createElement('div');
        historyItemContent.classList.add('history-item');
        let historyText = document.createElement('span');
        historyText.textContent = `$${entry.value}`;
        let historyDiffAmount = document.createElement('span');
        historyDiffAmount.classList.add('history-diff-amount'); // Add class for CSS targeting
        historyDiffAmount.textContent = entry.difference;
        historyDiffAmount.style.color = entry.difference.charAt(0) === '+' ? 'green' : 'red';
        let historyDiff = document.createElement('span');
        historyDiff.textContent = entry.differenceText;
        historyDiff.classList.add('difference-text');
        historyItemContent.appendChild(historyText);
        historyItemContent.appendChild(historyDiffAmount);
        historyItemContent.appendChild(historyDiff);
        historyItem.appendChild(historyItemContent);
        historyItem.setAttribute('data-id', entry.id);
        historyItem.ondblclick = () => {
            historyItem.remove();
            removeFromLocalStorage(entry.id);
        }; // Double-click to remove
        historyList.appendChild(historyItem);
    });
}

// function to remove item from local storage
function removeFromLocalStorage(id) {
    let history = JSON.parse(localStorage.getItem('calculationHistory')) || [];
    history = history.filter(entry => entry.id !== id);
    localStorage.setItem('calculationHistory', JSON.stringify(history));
}

// function to clear history
function clearHistory() {
    localStorage.removeItem('calculationHistory');
    let historyList = document.getElementById('history-list');
    historyList.innerHTML = '';
}

// function to initialize the page
function initializePage() {
    loadHistory();
    resetValues();
}