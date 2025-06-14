// Utility: Generate a simple unique id for history items
function generateId() {
    return Date.now().toString() + Math.floor(Math.random() * 1000);
}

// Main calculation function
function calculateMoney() {
    // Read input values as integers or 0
    const getVal = id => parseInt(document.getElementById(id).value, 10) || 0;
    const fifties = getVal('fifty'), twenties = getVal('twenty'), tens = getVal('ten'),
          fives = getVal('five'), ones = getVal('one'), quarters = getVal('quarter'),
          dimes = getVal('dime'), nickels = getVal('nickel'), pennies = getVal('penny'),
          extra = getVal('extra_moneyz');
    
    // Calculate total
    const total = (
        fifties * 50 + twenties * 20 + tens * 10 + fives * 5 + ones +
        quarters * 0.25 + dimes * 0.10 + nickels * 0.05 + pennies * 0.01 +
        extra
    );
    const rounded = total.toFixed(2);

    // Elements for output
    const errorEl = document.getElementById('error-message');
    const outputEl = document.getElementById('output1');
    const diffEl = document.getElementById('difference');

    // Reset outputs
    errorEl.textContent = '';
    outputEl.textContent = '';
    diffEl.textContent = '';
    outputEl.style.color = 'black';
    diffEl.style.color = 'black';

    // Validate input
    if (total <= 0) {
        errorEl.textContent = 'Enter values greater than 0.';
        return;
    }

function getCurrentTimestamp() {
    const now = new Date();

    const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    const monthsShort = [
        "Jan","Feb","Mar","Apr","May","Jun",
        "Jul","Aug","Sep","Oct","Nov","Dec"
    ];

    const day = now.getDate();
    const getDaySuffix = n => {
        if (n >= 11 && n <= 13) return "th";
        switch (n % 10) {
            case 1: return "st";
            case 2: return "nd";
            case 3: return "rd";
            default: return "th";
        }
    };

    let hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;
    const minStr = minutes < 10 ? `0${minutes}` : minutes;

    // ↓↓↓ THIS IS THE LINE TO CHANGE ↓↓↓
    return `${days[now.getDay()]} @ ${hours}:${minStr}\u202f${ampm} | ${monthsShort[now.getMonth()]} ${day}${getDaySuffix(day)}`;
}
    // Calculate difference from 50
    const diff = total - 50;
    let msg = '', diffMsg = '', diffSpan = null;

    if (diff === 0) {
        msg = `Total: $${rounded}`;
        diffMsg = 'You have exactly $50.00!';
        outputEl.style.color = 'green';
        diffEl.style.color = 'green';
        outputEl.textContent = msg;
        diffEl.textContent = diffMsg;
    } else {
        msg = `Total: $${rounded}`;
        // Create the red difference span
        diffSpan = document.createElement('span');
        diffSpan.style.color = 'red';
        if (diff > 0) {
            diffSpan.textContent = ` (Over by $${diff.toFixed(2)})`;
        } else {
            diffSpan.textContent = ` (Under by $${Math.abs(diff).toFixed(2)})`;
        }
        outputEl.textContent = msg;
        outputEl.appendChild(diffSpan);

        // Difference message, red, text black
        diffMsg = diff > 0 
            ? `Over by $${diff.toFixed(2)}`
            : `Under by $${Math.abs(diff).toFixed(2)}`;
        diffEl.textContent = diffMsg;
        // Only the difference text is red, rest remains black
        diffEl.style.color = 'red';
    }

    // Add to history
    addHistory({ 
    id: generateId(), 
    total: rounded, 
    diff: diff.toFixed(2), 
    diffMsg,
    timestamp: getCurrentTimestamp()    // <-- add this!
});
}

// History: add item
function addHistory(entry, shouldSave = true) {
    const list = document.getElementById('history-list');
    const li = document.createElement('li');
    li.className = 'history-item';

    // Container for main content (total and diff)
    const contentDiv = document.createElement('div');
    contentDiv.className = 'history-content';

    // Total
    const totalSpan = document.createElement('span');
    totalSpan.className = 'history-total';
    totalSpan.textContent = `Total: $${entry.total}`;

    // Spacer
    // const spacer = document.createElement('span');
    // spacer.className = 'history-spacer';
    // spacer.innerHTML = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'; // Add more as needed

    // Over/Under
    const diffSpan = document.createElement('span');
    diffSpan.className = 'history-diff';
    diffSpan.style.color = 'red';
    if (entry.diff === "0.00") {
        diffSpan.textContent = "Exactly $50.00!";
        diffSpan.style.color = "green";
        totalSpan.style.color = "green";
    } else if (parseFloat(entry.diff) > 0) {
        diffSpan.textContent = `Over by $${parseFloat(entry.diff).toFixed(2)}`;
    } else {
        diffSpan.textContent = `Under by $${Math.abs(parseFloat(entry.diff)).toFixed(2)}`;
    }

    // Timestamp
    const timestampSpan = document.createElement('span');
    timestampSpan.className = 'history-timestamp';
    timestampSpan.textContent = entry.timestamp || "";

    // X remove box
    const removeBtn = document.createElement('button');
    removeBtn.className = 'history-remove-btn';
    removeBtn.innerHTML = '&times;';
    removeBtn.title = 'Remove this entry';
    removeBtn.onclick = () => {
        li.remove();
        removeFromLocalStorage(entry.id);
    };

    // Build structure
    contentDiv.appendChild(totalSpan);
    // contentDiv.appendChild(spacer);
    contentDiv.appendChild(diffSpan);
    contentDiv.appendChild(timestampSpan);

    li.appendChild(contentDiv);
    li.appendChild(removeBtn);

    list.appendChild(li);

    // Only save to localStorage if shouldSave is true
    if (shouldSave) {
        saveToLocalStorage(entry);
    }
}

// History: save/load/clear
function saveToLocalStorage(entry) {
    const hist = JSON.parse(localStorage.getItem('calculationHistory') || '[]');
    hist.push(entry);
    localStorage.setItem('calculationHistory', JSON.stringify(hist));
}
function loadHistory() {
    const hist = JSON.parse(localStorage.getItem('calculationHistory') || '[]');
    const list = document.getElementById('history-list');
    list.innerHTML = '';
    hist.forEach(entry => addHistory(entry, false)); // Pass 'false' so entries are NOT re-saved
}
function removeFromLocalStorage(id) {
    let hist = JSON.parse(localStorage.getItem('calculationHistory') || '[]');
    hist = hist.filter(entry => entry.id !== id);
    localStorage.setItem('calculationHistory', JSON.stringify(hist));
}
function clearHistory() {
    localStorage.removeItem('calculationHistory');
    document.getElementById('history-list').innerHTML = '';
}

// Reset all counters
function resetValues() {
    ['fifty','twenty','ten','five','one','quarter','dime','nickel','penny','extra_moneyz']
      .forEach(id => document.getElementById(id).value = 0);
    document.getElementById('error-message').textContent = '';
    document.getElementById('output1').textContent = '';
    document.getElementById('difference').textContent = '';
    document.getElementById('output1').style.color = 'black';
    document.getElementById('difference').style.color = 'black';
}


// Increment/Decrement helpers
function incrementValue(id) {
    const el = document.getElementById(id);
    el.value = parseInt(el.value, 10) + 1;
}
function decrementValue(id) {
    const el = document.getElementById(id);
    el.value = Math.max(0, parseInt(el.value, 10) - 1);
}


function toggleAdvanced() {
    var adv = document.getElementById('advanced-section');
    var btn = document.getElementById('toggle-advanced-btn');
    if (adv.style.display === "none" || adv.style.display === "") {
        adv.style.display = "block";
        btn.textContent = "Hide Advanced";
    } else {
        adv.style.display = "none";
        btn.textContent = "Show Advanced";
        // Optionally reset fifties when hiding
        document.getElementById('fifty').value = 0;
    }
}

window.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('input[type="number"]').forEach(function(input) {
        input.addEventListener('focus', function() {
            if (input.value === "0") {
                input.select();
            }
        });
    });
});

// Page initialization
function initializePage() {
    loadHistory();
    resetValues();
}
