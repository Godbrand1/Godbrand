document.addEventListener("DOMContentLoaded", () => {
    const list = document.getElementById("savedUsersList");

    let draggedItem = null;

    list.addEventListener("dragstart", (e) => {
        if (e.target.tagName === "LI") {
            draggedItem = e.target;
            e.target.classList.add("dragging");
        }
    });

list.addEventListener("dragend", (e) => {
    if (e.target.tagName === "LI") {
        draggedItem = null;
        e.target.classList.remove("dragging");

        // Save the updated order to local storage
        saveListOrder();
    }
});

    list.addEventListener("dragover", (e) => {
        e.preventDefault();
        const afterElement = getDragAfterElement(list, e.clientY);
        if (afterElement == null) {
            list.appendChild(draggedItem);
        } else {
            list.insertBefore(draggedItem, afterElement);
        }
    });

function saveListOrder() {
    const customListName = document.getElementById("customListsDropdown").value;

    const listItems = [...list.children].map((item) => {
        // Extract the connect code from the anchor tag inside the list item
        const link = item.querySelector(".connect-code-link");
        return link ? link.textContent.trim() : "";
    });

    const customLists = JSON.parse(localStorage.getItem("customLists")) || {};

    if (customListName) {
        customLists[customListName] = listItems;
        localStorage.setItem("customLists", JSON.stringify(customLists));
    } else {
        localStorage.setItem("connectCodes", JSON.stringify(listItems));
    }
}


    function getDragAfterElement(container, y) {
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
});
