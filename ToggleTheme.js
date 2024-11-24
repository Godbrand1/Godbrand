// List of themes
const themes = ["default-theme", "light-theme", "dark-theme", "blue-theme", "purple-theme", "green-theme", "orange-theme"];

// Default theme
const defaultTheme = "default-theme";

// Apply the saved theme or default theme on page load
window.addEventListener("DOMContentLoaded", () => {
    const savedTheme = localStorage.getItem("selectedTheme") || defaultTheme;
    applyTheme(savedTheme);
});

// Function to toggle through themes
function toggleTheme() {
    const currentTheme = document.body.className || defaultTheme;
    const currentIndex = themes.indexOf(currentTheme);
    const nextTheme = themes[(currentIndex + 1) % themes.length];

    applyTheme(nextTheme);
    localStorage.setItem("selectedTheme", nextTheme); // Save the selected theme
    console.log(`Theme toggled to: ${nextTheme}`);
}

// Function to clear theme and reset to default
function clearTheme() {
    localStorage.removeItem("selectedTheme"); // Remove saved theme from local storage
    applyTheme(defaultTheme); // Apply default theme
    console.log("Theme cleared. Reset to default theme.");
}

// Function to apply a theme
function applyTheme(theme) {
    document.body.className = theme;
    console.log(`Applied theme: ${theme}`);
}
