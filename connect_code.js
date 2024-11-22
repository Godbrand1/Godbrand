document.addEventListener("DOMContentLoaded", () => {
    // Function to toggle iframe height
    function minimizeIframe() {
        console.log("minimizeIframe called"); // Debug log
        const iframe = document.getElementById("slippiFrame");
        iframe.style.height = iframe.style.height === "50px" ? "500px" : "50px"; // Toggle height
    }

    // Function to close the iframe
    function closeIframe() {
        const iframe = document.getElementById("slippiFrame");
        iframe.src = ""; // Clear iframe content
        const iframeContainer = document.getElementById("iframe-container");
        iframeContainer.style.display = "none"; // Hide iframe
    }

    // Function to open the Slippi page in the iframe
    function openIframeWithCode(connectCode) {
        console.log(`Opening iframe for code: ${connectCode}`); // Debug log
        const iframe = document.getElementById("slippiFrame");
        iframe.src = `https://slippi.gg/user/${encodeURIComponent(connectCode)}`;
        const iframeContainer = document.getElementById("iframe-container");
        iframeContainer.style.display = "block"; // Show iframe
        iframe.style.height = "500px"; // Reset height if minimized
    }

    // Bind buttons to functions (if needed dynamically)
    document.getElementById("minimizeButton").addEventListener("click", minimizeIframe);
    document.getElementById("closeButton").addEventListener("click", closeIframe);

    // Other function definitions or event bindings go here...
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
        saveConnectCode(connectCode);
    }

    // Update the iframe's src and show it
    const iframe = document.getElementById("slippiFrame");
    iframe.src = `https://slippi.gg/user/${encodeURIComponent(connectCode)}`;

    const iframeContainer = document.getElementById("iframe-container");
    iframeContainer.style.display = "block"; // Show iframe
    iframe.style.height = "500px"; // Restore full height if minimized
}

function closeIframe() {
    const iframe = document.getElementById("slippiFrame");
    iframe.src = ""; // Clear iframe content
    const iframeContainer = document.getElementById("iframe-container");
    iframeContainer.style.display = "none"; // Hide iframe
}

function minimizeIframe() {
    console.log("Minimize button clicked");
    const container = document.getElementById("iframe-container");
    if (!container) {
        console.error("Iframe container not found");
        return;
    }
    // Toggle the height of the entire container
    container.style.height = container.style.height === "50px" ? "500px" : "50px";
    console.log("Iframe container height is now:", container.style.height);
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
        }
    } else {
        // Save to the default list if no custom list is selected
        let savedCodes = JSON.parse(localStorage.getItem("connectCodes")) || [];
        
        if (!savedCodes.includes(code)) {
            savedCodes.push(code);
            localStorage.setItem("connectCodes", JSON.stringify(savedCodes));
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
    link.href = "#"; // Prevent default link behavior
    link.style.color = 'inherit'; // Inherit text color for consistent design
    link.style.textDecoration = 'none'; // Remove underline by default
    link.addEventListener("click", (e) => {
        e.preventDefault(); // Prevent navigation
        openIframeWithCode(code); // Open the link in the iframe
    });

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

function openIframeWithCode(connectCode) {
    const iframe = document.getElementById("slippiFrame");
    iframe.src = `https://slippi.gg/user/${encodeURIComponent(connectCode)}`;

    const iframeContainer = document.getElementById("iframe-container");
    iframeContainer.style.display = "block"; // Show iframe
    iframe.style.height = "500px"; // Restore full height if minimized
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

