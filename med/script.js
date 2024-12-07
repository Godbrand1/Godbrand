document.addEventListener('DOMContentLoaded', () => {
    const addTimestampButton = document.getElementById('add-timestamp');
    const clearStorageButton = document.getElementById('clear-storage');
    const timestampList = document.getElementById('timestamp-list');
    const dosageAmountInput = document.getElementById('dosage-amount');
    const customDatetimeInput = document.getElementById('custom-datetime');
    const totalAmountElement = document.getElementById('total-amount');

    function saveTimestamp() {
        const now = customDatetimeInput.value ? new Date(customDatetimeInput.value) : new Date();
        const timestamp = now.toISOString();
        const formattedTimestamp = `${now.toLocaleDateString()} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
        const dosage = parseFloat(dosageAmountInput.value) || 0;
        let timestamps = JSON.parse(localStorage.getItem('timestamps')) || [];
        timestamps.push({ timestamp, formattedTimestamp, dosage });
        timestamps.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        localStorage.setItem('timestamps', JSON.stringify(timestamps));
        displayTimestamps();
        updateTotalAmount();
    }

    function displayTimestamps() {
        timestampList.innerHTML = '';
        const timestamps = JSON.parse(localStorage.getItem('timestamps')) || [];
        timestamps.forEach((entry, index) => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `${entry.formattedTimestamp} - ${entry.dosage} mg <button class="delete-item" data-index="${index}">Delete</button>`;
            timestampList.appendChild(listItem);
        });

        document.querySelectorAll('.delete-item').forEach(button => {
            button.addEventListener('click', deleteItem);
        });
    }

// In script.js, modify the deleteItem function:
function deleteItem(event) {
    const index = event.target.getAttribute('data-index');
    let timestamps = JSON.parse(localStorage.getItem('timestamps')) || [];
    timestamps.splice(index, 1);
    localStorage.setItem('timestamps', JSON.stringify(timestamps));
    displayTimestamps();
    updateTotalAmount();
    // Add this line to update medication effects
    updateAllEffects();  // This function needs to be accessible
}

// In script.js, modify the clearStorage function:
function clearStorage() {
    localStorage.removeItem('timestamps');
    displayTimestamps();
    updateTotalAmount();
    // Add these lines to reset medication effects displays
    const detailsContainer = document.getElementById('medication-details');
    const totalEffectsContainer = document.getElementById('total-medication-effects');
    if (detailsContainer) detailsContainer.innerHTML = '<h2>Individual Medication Effects</h2>';
    if (totalEffectsContainer) totalEffectsContainer.innerHTML = '<h2>Total Active Effects</h2>';
}

    function updateTotalAmount() {
        const timestamps = JSON.parse(localStorage.getItem('timestamps')) || [];
        const totalAmount = timestamps.reduce((total, entry) => total + entry.dosage, 0);
        totalAmountElement.textContent = totalAmount;
    }


    addTimestampButton.addEventListener('click', saveTimestamp);
    clearStorageButton.addEventListener('click', clearStorage);

    // Display timestamps and total amount on load
    displayTimestamps();
    updateTotalAmount();
});