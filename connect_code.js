// Attach the keydown listener when the DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
    const connectCodeInput = document.getElementById("connectCode");
    const goButton = document.getElementById("goButton");

    connectCodeInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") goButton.click();
    });
});

function formatConnectCode() {
    const input = document.getElementById("connectCode");
    const value = input.value.toUpperCase().replace(/[^A-Z0-9]/g, ""); // Clean input

    // Extract letters (up to 5) and numbers (up to 4)
    const letters = value.match(/[A-Z]{0,5}/)?.[0] || ""; 
    const numbers = value.slice(letters.length).match(/\d{0,4}/)?.[0] || "";

    // Update input value in the format "LETTERS-NUMBERS"
    input.value = letters + (numbers ? `-${numbers}` : "");
}

function openSlippiPage() {
    const connectCode = document.getElementById("connectCode").value.trim();
    const validFormat = /^[A-Z]{1,5}-\d{1,4}$/;

    if (!validFormat.test(connectCode)) {
        alert("Please enter a valid connect code in the format AAAAA-1111.");
        return;
    }

    // Open Slippi user page
    window.open(`https://slippi.gg/user/${encodeURIComponent(connectCode)}`, "_blank");
}
