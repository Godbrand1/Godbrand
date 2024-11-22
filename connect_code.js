document.addEventListener("DOMContentLoaded", () => {
    const connectCodeInput = document.getElementById("connectCode");
    const goButton = document.getElementById("goButton");

    // Load saved connect codes on page load
    displaySavedCodes();

    // Trigger Go button click on Enter key press
    connectCodeInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            goButton.click();
        }
    });
});

function formatConnectCode() {
    const input = document.getElementById("connectCode");
    let value = input.value.toUpperCase().replace(/[^A-Z0-9]/g, ""); // Clean input

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

    // Check if the save toggle is enabled
    const saveToggle = document.getElementById("saveToggle").checked;

    if (saveToggle) {
        // Save the connect code and flash it blue
        saveConnectCode(connectCode);
        flashSavedCode(connectCode); // Flash the code
        return;
    }

    // Open the Slippi user page if not saving
    window.open(`https://slippi.gg/user/${encodeURIComponent(connectCode)}`, "_blank");
}



function saveConnectCode(code) {
    const customListName = document.getElementById("customListsDropdown").value;

    // Retrieve all custom lists or create an empty object if none exist
    const customLists = JSON.parse(localStorage.getItem("customLists")) || {};

    if (customListName) {
        // Save to the selected custom list
        if (!customLists[customListName]) {
            customLists[customListName] = [];
        }

        // Avoid duplicate codes
        if (!customLists[customListName].includes(code)) {
            customLists[customListName].push(code);
            localStorage.setItem("customLists", JSON.stringify(customLists));
            flashSavedCode(code); // Provide feedback by flashing the saved code
        }
    } else {
        // Save to the default list if no custom list is selected
        let savedCodes = JSON.parse(localStorage.getItem("connectCodes")) || [];
        
        if (!savedCodes.includes(code)) {
            savedCodes.push(code);
            localStorage.setItem("connectCodes", JSON.stringify(savedCodes));
            flashSavedCode(code); // Provide feedback by flashing the saved code
        }
    }

    // Update the displayed list after saving
    displaySavedCodes();
}



function flashSavedCode(connectCode) {
    const savedUsersList = document.getElementById("savedUsersList");
    const items = savedUsersList.querySelectorAll("li");

    items.forEach((item) => {
        const itemText = item.childNodes[0].nodeValue?.trim() || item.textContent.trim();

        if (itemText.startsWith(connectCode)) {
            item.classList.add("flash-blue");
            setTimeout(() => item.classList.remove("flash-blue"), 1000); // Keep flash effect for 1 second
        }
    });
}





function displaySavedCodes() {
    const savedUsersList = document.getElementById("savedUsersList");
    const customListName = document.getElementById("customListsDropdown").value;

    savedUsersList.innerHTML = "";

    if (customListName) {
        // Show codes from the selected custom list
        const customLists = JSON.parse(localStorage.getItem("customLists")) || {};
        const savedCodes = customLists[customListName] || [];

        if (savedCodes.length === 0) {
            savedUsersList.innerHTML = "<li>No saved connect codes in this list.</li>";
        } else {
            savedCodes.forEach((code) => {
                const listItem = createListItem(code);
                savedUsersList.appendChild(listItem);
            });
        }
    } else {
        // Show codes from the default list
        const savedCodes = JSON.parse(localStorage.getItem("connectCodes")) || [];

        if (savedCodes.length === 0) {
            savedUsersList.innerHTML = "<li>No saved connect codes.</li>";
        } else {
            savedCodes.forEach((code) => {
                const listItem = createListItem(code);
                savedUsersList.appendChild(listItem);
            });
        }
    }

    // Enable drag-and-drop after rendering the new list
    enableDragAndDrop();
}


function deleteSavedCode(code) {
    const customListName = document.getElementById("customListsDropdown").value;

    if (customListName) {
        // Delete from the selected custom list
        const customLists = JSON.parse(localStorage.getItem("customLists")) || {};
        customLists[customListName] = customLists[customListName].filter((savedCode) => savedCode !== code);
        localStorage.setItem("customLists", JSON.stringify(customLists));
    } else {
        // Delete from the default list
        let savedCodes = JSON.parse(localStorage.getItem("connectCodes")) || [];
        savedCodes = savedCodes.filter((savedCode) => savedCode !== code);
        localStorage.setItem("connectCodes", JSON.stringify(savedCodes));
    }

    displaySavedCodes();
}





function createListItem(code) {
    // Create the list item
    const listItem = document.createElement("li");

    // Add the link to open the user page
    const link = document.createElement("a");
    link.textContent = code;
    link.href = `https://slippi.gg/user/${encodeURIComponent(code)}`;
    link.target = "_blank"; // Opens the link in a new tab
    link.style.color = 'inherit'; // Inherit text color for consistent design
    link.style.textDecoration = 'none'; // Remove underline by default

    // Append the link to the list item
    listItem.appendChild(link);

    // Add delete button
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.className = "delete-button";
    deleteButton.addEventListener("click", (e) => {
        e.stopPropagation(); // Prevent the link click when clicking delete
        deleteSavedCode(code);
    });

    listItem.appendChild(deleteButton);
    listItem.draggable = true; // Enable drag-and-drop functionality
    listItem.addEventListener("dragstart", (event) => {
        event.dataTransfer.setData("text/plain", code);
        listItem.classList.add("dragging");
    });

    listItem.addEventListener("dragend", () => {
        listItem.classList.remove("dragging");
    });

    return listItem;
}



function deleteCustomList() {
    const customListName = document.getElementById("customListsDropdown").value;

    // Prevent deleting the default list
    if (!customListName) {
        alert("You cannot delete the default list.");
        return;
    }

    // Confirm if the user really wants to delete the list
    const confirmation = confirm(`Are you sure you want to delete the list "${customListName}" and all its codes?`);
    if (!confirmation) return;

    // Retrieve all custom lists
    const customLists = JSON.parse(localStorage.getItem("customLists")) || {};

    // Delete the selected list
    if (customLists[customListName]) {
        delete customLists[customListName];
        localStorage.setItem("customLists", JSON.stringify(customLists));
    }

    // Update the dropdown and display default list
    updateCustomListsDropdown();
    displaySavedCodes();
}

