
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
    const connectCode = document.getElementById("connectCode").value.trim();
    if (!connectCode || !/^[A-Z]{1,4}-\d{1,4}$/.test(connectCode)) {
        alert("Please enter a valid connect code in the format AAAA-1111.");
        return;
    }

    // Replace "#" with "%23" for URL encoding
    const encodedCode = encodeURIComponent(connectCode);
    const slippiUrl = `https://slippi.gg/user/${encodedCode}`;

    // Open the Slippi user page in a new tab
    window.open(slippiUrl, "_blank");
}

// Add an event listener to the input field for the Enter key
document.getElementById("connectCode").addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        // Trigger the button click
        document.getElementById("goButton").click();
    }
});
