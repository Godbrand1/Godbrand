// Initialize the page when DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
    populateDropdown();
    displaySavedCodes();
    setupKeyListeners();
   // bindIframeButtons();
//document.getElementById("minimizeButton").addEventListener("click", minimizeIframe);
//document.getElementById("closeButton").addEventListener("click", closeIframe);

});

// Function to create a new custom list
function createCustomList() {
    const customLists = JSON.parse(localStorage.getItem("customLists")) || {};
    const modal = document.getElementById("customInputModal");
    const modalInput = document.getElementById("modalInput");
    const modalSubmit = document.getElementById("modalSubmit");

    modal.style.display = "block";
    modalInput.value = "";

    const closeModal = () => {
        modal.style.display = "none";
    };

    const handleSubmit = () => {
        const newListName = modalInput.value.trim();
        if (!newListName) {
            Toastify({
                text: "List name cannot be empty.",
                duration: 3000,
                close: true,
                gravity: "top",
                position: "right",
                backgroundColor: "#FF0000",
            }).showToast();
            return;
        }

        if (customLists[newListName]) {
            Toastify({
                text: `The list "${newListName}" already exists.`,
                duration: 3000,
                close: true,
                gravity: "top",
                position: "right",
                backgroundColor: "#FFA500",
            }).showToast();
            return;
        }

        customLists[newListName] = [];
        localStorage.setItem("customLists", JSON.stringify(customLists));
        populateDropdown();

        Toastify({
            text: `Custom list "${newListName}" has been created.`,
            duration: 3000,
            close: true,
            gravity: "top",
            position: "right",
            // backgroundColor: "#9B59B6",
        }).showToast();

        closeModal();
    };

    document.querySelector(".close").onclick = closeModal;
    modalSubmit.onclick = handleSubmit;
    window.onclick = (event) => {
        if (event.target === modal) {
            closeModal();
        }
    };
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
        Toastify({
            text: "You cannot delete the default list.",
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            backgroundColor: "#FF0000", // Red background for error
        }).showToast();
        return;
    }

    const showToastWithConfirmation = () => {
        Toastify({
            text: `Are you sure you want to delete the list "${customListName}"?`,
            duration: 5000,
            close: true,
            gravity: "top",
            position: "right",
            backgroundColor: "#FFA500",
            onClick: () => {
                const customLists = JSON.parse(localStorage.getItem("customLists")) || {};
                delete customLists[customListName];
                localStorage.setItem("customLists", JSON.stringify(customLists));

                populateDropdown();
                displaySavedCodes();

                Toastify({
                    text: `The list "${customListName}" has been deleted.`,
                    duration: 3000,
                    close: true,
                    gravity: "top",
                    position: "right",
                    // backgroundColor: "#9B59B6",
                }).showToast();
            }
        }).showToast();
    };

    showToastWithConfirmation();
}



// **Saved Codes Management**
// Ensure displaySavedCodes function displays ratings
function displaySavedCodes() {
    const savedUsersList = document.getElementById("savedUsersList");
    const customListName = document.getElementById("customListsDropdown").value;

    savedUsersList.innerHTML = ""; // Clear list

    const savedCodes = customListName
        ? (JSON.parse(localStorage.getItem("customLists")) || {})[customListName] || []
        : JSON.parse(localStorage.getItem("connectCodes")) || [];

    // Render the saved codes in the correct order
    savedCodes.forEach((item) => {
        const listItem = createListItem(item);
        savedUsersList.appendChild(listItem);
    });

    enableDragAndDrop();
}


function saveConnectCode(code) {
    const customListName = document.getElementById("customListsDropdown").value;
    const customLists = JSON.parse(localStorage.getItem("customLists")) || {};
    const saveRatingToggle = document.getElementById('ratingToggle').checked;

    let item = { code };

    if (saveRatingToggle) {
        const rating = document.getElementById('ratingInput').value;
        item.rating = rating;
    } else {
        const existingItem = customLists[customListName]?.find(savedItem => savedItem.code === code) 
                             || JSON.parse(localStorage.getItem("connectCodes"))?.find(savedItem => savedItem.code === code);
        if (existingItem) {
            item.rating = existingItem.rating;
        }
    }

    if (customListName) {
        customLists[customListName] = customLists[customListName] || [];
        const index = customLists[customListName].findIndex(savedItem => savedItem.code === code);
        if (index !== -1) {
            customLists[customListName][index] = item; // Update existing item
        } else {
            customLists[customListName].push(item); // Add new item
        }
        localStorage.setItem("customLists", JSON.stringify(customLists));
    } else {
        const savedCodes = JSON.parse(localStorage.getItem("connectCodes")) || [];
        const index = savedCodes.findIndex(savedItem => savedItem.code === code);
        if (index !== -1) {
            savedCodes[index] = item; // Update existing item
        } else {
            savedCodes.push(item); // Add new item
        }
        localStorage.setItem("connectCodes", JSON.stringify(savedCodes));
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
function createListItem(item) {
    const listItem = document.createElement("li");

    // Create the clickable connect code link
    const link = document.createElement("a");
    link.innerHTML = `${item.code} (<strong>Rating:</strong> ${item.rating})`;
    link.href = "#";
    link.classList.add("connect-code-link");
    link.addEventListener("click", (e) => {
        e.preventDefault();
        openIframeWithCode(item.code);
    });

    // Append the link to the list item
    listItem.appendChild(link);

    // Create and append the delete button
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.className = "delete-button";
    deleteButton.addEventListener("click", (e) => {
        e.stopPropagation();
        deleteSavedCode(item.code);
    });

    listItem.appendChild(deleteButton);
    listItem.draggable = true;

    return listItem;
}
function deleteSavedCode(code) {
    const customListName = document.getElementById("customListsDropdown").value;
    const customLists = JSON.parse(localStorage.getItem("customLists")) || {};

    if (customListName) {
        customLists[customListName] = customLists[customListName].filter((savedItem) => savedItem.code !== code);
        localStorage.setItem("customLists", JSON.stringify(customLists));
    } else {
        let savedCodes = JSON.parse(localStorage.getItem("connectCodes")) || [];
        savedCodes = savedCodes.filter((savedItem) => savedItem.code !== code);
        localStorage.setItem("connectCodes", JSON.stringify(savedCodes));
    }

    displaySavedCodes();
}

// **Iframe Controls**
function openIframeWithCode(connectCode) {
    const iframe = document.getElementById("slippiFrame");
    const iframeContainer = document.getElementById("iframe-container");
    const connectCodeInput = document.getElementById("connectCode");

    // Set the input value to the connect code
    connectCodeInput.value = connectCode;

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
    const formattedNumbers = numbers.slice(0, 5).join("");

    // Combine with a hyphen
    input.value = formattedLetters + (formattedNumbers ? `-${formattedNumbers}` : "");
}


function openSlippiPage() {
    const connectCode = document.getElementById("connectCode").value.trim();
//    const validFormat = /^[A-Z]{1,6}-\d{1,6}$/; // Change to 6

////// old format to validate not needed    
//    if (!validFormat.test(connectCode)) {
//        alert("Invalid format. Use ABCDE-1234.");
//        return;
//    }
        if (!connectCode) {
        alert("Please enter a connect code.");
        return;
    }

    if (document.getElementById("saveToggle").checked) {
        if (document.getElementById("ratingToggle").checked) {
            const rating = document.getElementById('ratingInput').value;
            saveConnectCode(connectCode, rating);
        } else {
            saveConnectCode(connectCode);
        }
    }

    openIframeWithCode(connectCode);
}

function filterSavedCodes() {
    const searchTerm = document.getElementById("searchConnectCode").value.toLowerCase().trim();
    document.querySelectorAll("#savedUsersList li").forEach((item) => {
        const code = item.querySelector(".connect-code-link").textContent.toLowerCase().trim(); // Ensure we are only searching the connect code
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
    //bindIframeButtons();

    const minimizeButton = document.getElementById("minimizeButton");
    const closeButton = document.getElementById("closeButton");

    //if (minimizeButton) {
   //     minimizeButton.addEventListener("click", minimizeIframe);
   // } else {
   //     console.error("minimizeButton not found in the DOM.");
   // }

    if (closeButton) {
        closeButton.addEventListener("click", closeIframe);
    } else {
        console.error("closeButton not found in the DOM.");
    }
});
