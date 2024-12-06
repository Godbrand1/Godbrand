function importSavedCodes(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const data = JSON.parse(e.target.result);
            if (data.customLists) {
                localStorage.setItem("customLists", JSON.stringify(data.customLists));
            }
            if (data.defaultList) {
                localStorage.setItem("connectCodes", JSON.stringify(data.defaultList));
            }
            displaySavedCodes();
            populateDropdown();
            Toastify({
                text: "Import successful!",
                duration: 3000,
                close: true,
                gravity: "top",
                position: "right",
                style: {
                    background: "#4CAF50",
                },
            }).showToast();
        } catch (error) {
            Toastify({
                text: "Import failed. Invalid file format.",
                duration: 3000,
                close: true,
                gravity: "top",
                position: "right",
                style: {
                    background: "#FF0000",
                },
            }).showToast();
        }
    };
    reader.readAsText(file);
}

document.getElementById("importInput").addEventListener("change", importSavedCodes);
document.getElementById("importButton").addEventListener("click", () => {
    document.getElementById("importInput").click();
});