function importSavedCodes(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const data = JSON.parse(e.target.result);

            if (data.version === 1) {
                // Handle new format
                if (data.customLists) {
                    localStorage.setItem("customLists", JSON.stringify(data.customLists));
                }
                if (data.defaultList) {
                    localStorage.setItem("connectCodes", JSON.stringify(data.defaultList));
                }
            } else {
                // Handle old format
                const newData = {
                    customLists: {},
                    defaultList: data.defaultList.map(code => ({
                        code,
                        rating: "0"
                    }))
                };

                for (const listName in data.customLists) {
                    newData.customLists[listName] = data.customLists[listName].map(code => ({
                        code,
                        rating: "0"
                    }));
                }

                localStorage.setItem("customLists", JSON.stringify(newData.customLists));
                localStorage.setItem("connectCodes", JSON.stringify(newData.defaultList));
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