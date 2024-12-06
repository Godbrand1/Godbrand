function saveRating() {
    const rating = document.getElementById('ratingInput').value;
    const saveToggle = document.getElementById('saveToggle').checked;
    if (saveToggle) {
        localStorage.setItem('savedRating', rating);
        displaySavedRating();
    }
}

function displaySavedRating() {
    const savedRating = localStorage.getItem('savedRating');
    if (savedRating !== null) {
        document.getElementById('savedRating').innerText = savedRating;
    }
}

// Display the saved rating when the page loads
window.onload = displaySavedRating;