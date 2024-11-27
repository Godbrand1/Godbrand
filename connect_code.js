// Initialize the page when DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
    populateDropdown();
    displaySavedCodes();
    setupKeyListeners();
    bindIframeButtons();
document.getElementById("minimizeButton").addEventListener("click", minimizeIframe);
document.getElementById("closeButton").addEventListener("click", closeIframe);

});
// Function to create a new custom list
function createCustomList() {
    const customLists = JSON.parse(localStorage.getItem("customLists")) || {};
    const newListName = prompt("Enter a name for the new custom list:");

    if (!newListName || newListName.trim() === "") {
        alert("List name cannot be empty.");
        return;
    }

    if (customLists[newListName]) {
        alert(`The list "${newListName}" already exists.`);
        return;
    }

    customLists[newListName] = []; // Initialize the new list as empty
    localStorage.setItem("customLists", JSON.stringify(customLists));

    // Update the dropdown with the new list
    populateDropdown();
    alert(`Custom list "${newListName}" has been created.`);
}


// **Dropdown and List Management**
function populateDropdown() {
    const dropdown = document.getElementById("customListsDropdown");
    dropdown.innerHTML = '<option value="">Default List</option>'; // Reset with default option

    const customLists = JSON.parse(localStorage.getItem("customLists")) || {};
    for (const listName in customLists) {
        const option = document.createElement("option");
        option.value = listName;
        option.textContent = listName;
        dropdown.appendChild(option);
    }
}

function deleteCustomList() {
    const customListName = document.getElementById("customListsDropdown").value;

    if (!customListName) {
        alert("You cannot delete the default list.");
        return;
    }

    const confirmation = confirm(`Are you sure you want to delete the list "${customListName}"?`);
    if (!confirmation) return;

    const customLists = JSON.parse(localStorage.getItem("customLists")) || {};
    delete customLists[customListName];
    localStorage.setItem("customLists", JSON.stringify(customLists));

    populateDropdown();
    displaySavedCodes();
}

// **Saved Codes Management**
function displaySavedCodes() {
    const savedUsersList = document.getElementById("savedUsersList");
    const customListName = document.getElementById("customListsDropdown").value;

    savedUsersList.innerHTML = ""; // Clear list

    const savedCodes = customListName
        ? (JSON.parse(localStorage.getItem("customLists")) || {})[customListName] || []
        : JSON.parse(localStorage.getItem("connectCodes")) || [];

    // Render the saved codes in the correct order
    savedCodes.forEach((code) => {
        const listItem = createListItem(code);
        savedUsersList.appendChild(listItem);
    });

    enableDragAndDrop();
}

function saveConnectCode(code) {
    const customListName = document.getElementById("customListsDropdown").value;
    const customLists = JSON.parse(localStorage.getItem("customLists")) || {};

    if (customListName) {
        customLists[customListName] = customLists[customListName] || [];
        if (!customLists[customListName].includes(code)) {
            customLists[customListName].push(code);
            localStorage.setItem("customLists", JSON.stringify(customLists));
        }
    } else {
        const savedCodes = JSON.parse(localStorage.getItem("connectCodes")) || [];
        if (!savedCodes.includes(code)) {
            savedCodes.push(code);
            localStorage.setItem("connectCodes", JSON.stringify(savedCodes));
        }
    }

    displaySavedCodes();
}

function deleteSavedCode(code) {
    const customListName = document.getElementById("customListsDropdown").value;
    const customLists = JSON.parse(localStorage.getItem("customLists")) || {};

    if (customListName) {
        customLists[customListName] = customLists[customListName].filter((savedCode) => savedCode !== code);
        localStorage.setItem("customLists", JSON.stringify(customLists));
    } else {
        let savedCodes = JSON.parse(localStorage.getItem("connectCodes")) || [];
        savedCodes = savedCodes.filter((savedCode) => savedCode !== code);
        localStorage.setItem("connectCodes", JSON.stringify(savedCodes));
    }

    displaySavedCodes();
}

// **List Item Creation**
function createListItem(code) {
    const listItem = document.createElement("li");

    // Create the clickable connect code link
    const link = document.createElement("a");
    link.textContent = code;
    link.href = "#";
    link.classList.add("connect-code-link");
    link.addEventListener("click", (e) => {
        e.preventDefault();
        openIframeWithCode(code);
    });

    // Append the link to the list item
    listItem.appendChild(link);

    // Create and append the delete button
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.className = "delete-button";
    deleteButton.addEventListener("click", (e) => {
        e.stopPropagation();
        deleteSavedCode(code);
    });

    listItem.appendChild(deleteButton);
    listItem.draggable = true;

    return listItem;
}


// **Iframe Controls**
function openIframeWithCode(connectCode) {
    const iframe = document.getElementById("slippiFrame");
    const iframeContainer = document.getElementById("iframe-container");

    iframe.src = `https://slippi.gg/user/${encodeURIComponent(connectCode)}`;
    iframeContainer.style.display = "flex";
    iframeContainer.style.height = "100%"; // Ensure full height
    iframeContainer.style.width = "100%"; // Ensure full width
    iframe.style.width = "100%"; // Match container width
    iframe.style.height = "calc(100% - 50px)"; // Subtract controls' height
}


function minimizeIframe() {
    const iframeContainer = document.getElementById("iframe-container");

    if (!iframeContainer) {
        console.error("Iframe container not found.");
        return;
    }

    // Get the computed dimensions (fallback for initial state)
    const currentHeight = iframeContainer.style.height || window.getComputedStyle(iframeContainer).height;
    const currentWidth = iframeContainer.style.width || window.getComputedStyle(iframeContainer).width;

    // Normalize dimensions for comparison
    const isMinimized = currentHeight === "10%" && currentWidth === "10%";

    if (isMinimized) {
        // Restore to full size
        iframeContainer.style.height = "100%";
        iframeContainer.style.width = "100%";
        iframeContainer.style.overflow = "visible"; // Ensure content is visible
        console.log("Iframe maximized: Full height and width restored.");
    } else {
        // Minimize to 10% of screen size
        iframeContainer.style.height = "10%";
        iframeContainer.style.width = "10%";
        iframeContainer.style.overflow = "hidden"; // Hide overflow content
        console.log("Iframe minimized: Height and width set to 10%.");
    }
}



function maximizeIframe() {
    const iframeContainer = document.getElementById("iframe-container");

    if (!iframeContainer) {
        console.error("Iframe container not found.");
        return;
    }

    // Get the computed dimensions (fallback for initial state)
    const currentHeight = iframeContainer.style.height || window.getComputedStyle(iframeContainer).height;
    const currentWidth = iframeContainer.style.width || window.getComputedStyle(iframeContainer).width;

    // Normalize dimensions for comparison
    const isMinimized = currentHeight === "10%" && currentWidth === "10%";

    if (isMinimized) {
        // Restore to full size
        iframeContainer.style.height = "100%";
        iframeContainer.style.width = "100%";
        iframeContainer.style.overflow = "visible"; // Ensure content is visible
        console.log("Iframe maximized: Full height and width restored.");
    } else {
        // Minimize to 10% of screen size
        iframeContainer.style.height = "10%";
        iframeContainer.style.width = "10%";
        iframeContainer.style.overflow = "hidden"; // Hide overflow content
        console.log("Iframe minimized: Height and width set to 10%.");
    }
}




function closeIframe() {
    const iframeContainer = document.getElementById("iframe-container");
    const iframe = document.getElementById("slippiFrame");
    iframe.src = ""; // Clear iframe content
    iframeContainer.style.display = "none"; // Hide the container
    console.log("Close button clicked");
}


// Function to enforce formatting with a maximum of 3 numbers
function formatConnectCode() {
    const input = document.getElementById("connectCode");
    let value = input.value.toUpperCase(); // Convert to uppercase
    value = value.replace(/[^A-Z0-9]/g, ""); // Remove non-alphanumeric characters

    // Separate letters and numbers
    const letters = value.match(/[A-Z]/g) || [];
    const numbers = value.match(/[0-9]/g) || [];

    // Enforce limits: max 5 letters, max 3 numbers
    const formattedLetters = letters.slice(0, 6).join("");
    const formattedNumbers = numbers.slice(0, 3).join("");

    // Combine with a hyphen
    input.value = formattedLetters + (formattedNumbers ? `-${formattedNumbers}` : "");
}


function openSlippiPage() {
    const connectCode = document.getElementById("connectCode").value.trim();
    const validFormat = /^[A-Z]{1,6}-\d{1,3}$/; // Change to 6

    if (!validFormat.test(connectCode)) {
        alert("Invalid format. Use ABCDE-123.");
        return;
    }

    if (document.getElementById("saveToggle").checked) {
        saveConnectCode(connectCode);
    }

    openIframeWithCode(connectCode);
}

function filterSavedCodes() {
    const searchTerm = document.getElementById("searchConnectCode").value.toLowerCase();
    document.querySelectorAll("#savedUsersList li").forEach((item) => {
        const code = item.textContent.toLowerCase();
        item.style.display = code.includes(searchTerm) ? "flex" : "none";
    });
}

function enableDragAndDrop() {
    // Add drag-and-drop functionality
}

function setupKeyListeners() {
    const connectCodeInput = document.getElementById("connectCode");
    connectCodeInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            openSlippiPage();
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    populateDropdown();
    displaySavedCodes();
    setupKeyListeners();
    bindIframeButtons();

    const minimizeButton = document.getElementById("minimizeButton");
    const closeButton = document.getElementById("closeButton");

    if (minimizeButton) {
        minimizeButton.addEventListener("click", minimizeIframe);
    } else {
        console.error("minimizeButton not found in the DOM.");
    }

    if (closeButton) {
        closeButton.addEventListener("click", closeIframe);
    } else {
        console.error("closeButton not found in the DOM.");
    }
});
