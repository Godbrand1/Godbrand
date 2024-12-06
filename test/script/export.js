function exportSavedCodes() {
    const customLists = JSON.parse(localStorage.getItem("customLists")) || {};
    const defaultList = JSON.parse(localStorage.getItem("connectCodes")) || [];
    const data = { customLists, defaultList };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "savedCodes.json";
    a.click();
    URL.revokeObjectURL(url);
}

document.getElementById("exportButton").addEventListener("click", exportSavedCodes);