function enableDragAndDrop() {
    const list = document.getElementById("savedUsersList");
    let draggedItem = null;

    list.addEventListener("dragstart", (event) => {
        draggedItem = event.target;
        draggedItem.classList.add("dragging");
    });

    list.addEventListener("dragend", (event) => {
        event.target.classList.remove("dragging");
        draggedItem = null;

        // Save the new order in localStorage
        saveReorderedCodes();
    });

    list.addEventListener("dragover", (event) => {
        event.preventDefault();
        const draggingItem = document.querySelector(".dragging");
        const closestItem = getClosestDraggable(list, event.clientY);

        if (closestItem && closestItem !== draggingItem) {
            list.insertBefore(draggingItem, closestItem);
        }
    });
}

function getClosestDraggable(container, y) {
    const draggableElements = [...container.querySelectorAll("li:not(.dragging)")];
    return draggableElements.reduce(
        (closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;

            if (offset < 0 && offset > closest.offset) {
                return { offset, element: child };
            } else {
                return closest;
            }
        },
        { offset: Number.NEGATIVE_INFINITY }
    ).element;
}

function saveReorderedCodes() {
    const customListName = document.getElementById("customListsDropdown").value;
    const list = document.getElementById("savedUsersList");
    const codes = [...list.querySelectorAll("li a")].map((link) =>
        link.textContent.trim()
    );

    if (customListName) {
        const customLists = JSON.parse(localStorage.getItem("customLists")) || {};
        if (customLists[customListName]) {
            customLists[customListName] = codes;
            localStorage.setItem("customLists", JSON.stringify(customLists));
        }
    } else {
        localStorage.setItem("connectCodes", JSON.stringify(codes));
    }

    displaySavedCodes();
}






function saveToCustomList(listName, code) {
    const lists = JSON.parse(localStorage.getItem("customLists")) || {};
    if (!lists[listName]) {
        alert("List does not exist.");
        return;
    }

    if (!lists[listName].includes(code)) {
        lists[listName].push(code);
        localStorage.setItem("customLists", JSON.stringify(lists));
    }
    displaySavedCodes(); // Refresh the display
}

function loadCustomList(listName) {
    const lists = JSON.parse(localStorage.getItem("customLists")) || {};
    const savedCodes = lists[listName] || [];

    localStorage.setItem("connectCodes", JSON.stringify(savedCodes));
    displaySavedCodes();
}

function createCustomList() {
    const listName = prompt("Enter the name of the new list:");
    if (!listName) return;

    const lists = JSON.parse(localStorage.getItem("customLists")) || {};
    if (lists[listName]) {
        alert("A list with this name already exists.");
        return;
    }

    lists[listName] = [];
    localStorage.setItem("customLists", JSON.stringify(lists));
    updateCustomListsDropdown();
}

function updateCustomListsDropdown() {
    const dropdown = document.getElementById("customListsDropdown");
    const customLists = JSON.parse(localStorage.getItem("customLists")) || {};
    dropdown.innerHTML = "";

    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "Default List";
    dropdown.appendChild(defaultOption);

    Object.keys(customLists).forEach((listName) => {
        const option = document.createElement("option");
        option.value = listName;
        option.textContent = listName;
        dropdown.appendChild(option);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    updateCustomListsDropdown(); // Load the dropdown options
    displaySavedCodes();         // Display saved connect codes after the dropdown is populated
    enableDragAndDrop();         // Enable drag-and-drop functionality
});



