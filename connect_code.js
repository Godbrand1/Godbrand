// Attach the keydown listener only after the DOM is fully loaded
document.addEventListener("DOMContentLoaded", function () {
    const connectCodeInput = document.getElementById("connectCode");
    const goButton = document.getElementById("goButton");

    // Add an event listener to the input field for the Enter key
    connectCodeInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            // Trigger the button click
            goButton.click();
        }
    });
});

function formatConnectCode() {
    const input = document.getElementById("connectCode");
    let value = input.value.toUpperCase(); // Convert to uppercase
    value = value.replace(/[^A-Z0-9]/g, ""); // Remove non-alphanumeric characters

    // Split letters and numbers based on their position
    let letters = value.slice(0, 4).replace(/[^A-Z]/g, ""); // First up to 4 letters
    let numbers = value.slice(letters.length).replace(/[^0-9]/g, ""); // Remaining up to 4 numbers

    // Construct the formatted value
    if (letters.length > 0) {
        input.value = letters + (numbers.length > 0 ? "-" + numbers.slice(0, 4) : "");
    } else {
        input.value = numbers.slice(0, 4); // If no letters, show numbers only
    }
}

function openSlippiPage() {
    const connectCode = document.g
