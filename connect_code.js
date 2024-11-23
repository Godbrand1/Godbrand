// Function to open the iframe with the specified connect code
function openIframeWithCode(connectCode) {
    const iframe = document.getElementById("slippiFrame");
    const iframeContainer = document.getElementById("iframe-container");
    const iframeControls = document.getElementById("iframe-controls");

    // Set the iframe source
    iframe.src = `https://slippi.gg/user/${encodeURIComponent(connectCode)}`;

    // Configure the iframe container
    iframeContainer.style.display = "flex"; // Use Flexbox layout
    iframeContainer.style.position = "relative"; // Allow absolute positioning inside
    iframeContainer.style.height = "100%"; // Ensure full height
    iframeContainer.style.width = "100%"; // Ensure full width

    // Position the controls at the top-right corner
    iframeControls.style.position = "absolute";
    iframeControls.style.top = "10px"; // Offset from the top
    iframeControls.style.right = "10px"; // Offset from the right
    iframeControls.style.display = "flex"; // Arrange buttons horizontally
    iframeControls.style.gap = "5px"; // Space between buttons
    iframeControls.style.zIndex = "10"; // Ensure controls are above the iframe

    // Ensure the iframe fills the container
    iframe.style.height = "100%";
    iframe.style.width = "100%";

    console.log(`Iframe opened for code: ${connectCode}`);
}

// Function to minimize the iframe
function minimizeIframe() {
    const iframeContainer = document.getElementById("iframe-container");
    const iframe = document.getElementById("slippiFrame");

    if (!iframeContainer || !iframe) {
        console.error("Iframe or container not found");
        return;
    }

    // Toggle between minimized and full height
    if (iframeContainer.style.height === "50px") {
        iframeContainer.style.height = "100%"; // Restore full height
        iframe.style.height = "100%"; // Ensure iframe fills container
    } else {
        iframeContainer.style.height = "50px"; // Minimize container height
        iframe.style.height = "50px"; // Match iframe height to container
    }
}

// Function to close the iframe
function closeIframe() {
    const iframe = document.getElementById("slippiFrame");
    const iframeContainer = document.getElementById("iframe-container");

    if (!iframe || !iframeContainer) {
        console.error("Iframe or container not found");
        return;
    }

    iframe.src = ""; // Clear iframe content
    iframeContainer.style.display = "none"; // Hide iframe container
    iframeContainer.style.height = "100%"; // Reset height for reopening
}

// Function to format the connect code input
function formatConnectCode() {
    const input = document.getElementById("connectCode");
    let value = input.value.toUpperCase().replace(/[^A-Z0-9]/g, ""); // Clean input

    // Extract letters (up to 5) and numbers (up to 4)
    const letters = value.match(/[A-Z]{0,5}/)?.[0] || "";
    const numbers = value.slice(letters.length).match(/\d{0,4}/)?.[0] || "";

    // Update input value in the format "LETTERS-NUMBERS"
    input.value = letters + (numbers ? `-${numbers}` : "");
}

// Function to open the Slippi page in the iframe
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
    openIframeWithCode(connectCode);
}

// Function to save a connect code
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

// Function to create a list item for a saved connect code
function createListItem(code) {
    const listItem = document.createElement("li");

    const link = document.createElement("a");
    link.textContent = code;
    link.href = "#";
    link.style.color = "inherit";
    link.style.textDecoration = "none";

    // Add event listener to open iframe with the correct connect code
    link.addEventListener("click", (e) => {
        e.preventDefault(); // Prevent default anchor behavior
        openIframeWithCode(code); // Open iframe with the connect code
    });

    listItem.appendChild(link);

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.className = "delete-button";
    deleteButton.addEventListener("click", (e) => {
        e.stopPropagation(); // Prevent triggering link click
        deleteSavedCode(code); // Delete the connect code
    });

    listItem.appendChild(deleteButton);
    listItem.draggable = true;
    return listItem;
}

// Function to display saved connect codes
function displaySavedCodes() {
    const savedUsersList = document.getElementById("savedUsersList");
    const customListName = document.getElementById("customListsDropdown").value;

    savedUsersList.innerHTML = ""; // Clear list

    if (customListName) {
        const customLists = JSON.parse(localStorage.getItem("customLists")) || {};
        const savedCodes = customLists[customListName] || [];

        savedCodes.forEach((code) => {
            const listItem = createListItem(code);
            savedUsersList.appendChild(listItem);
        });
    } else {
        const savedCodes = JSON.parse(localStorage.getItem("connectCodes")) || [];

        savedCodes.forEach((code) => {
            const listItem = createListItem(code);
            savedUsersList.appendChild(listItem);
        });
    }

    // Ensure scrollability
    const savedUsersContainer = document.querySelector(".saved-users-container");
    savedUsersContainer.style.overflowY = "auto";
}
