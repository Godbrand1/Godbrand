document.getElementById("iframe-container").addEventListener("mouseup", () => {
    const iframeContainer = document.getElementById("iframe-container");
    const dimensions = {
        width: iframeContainer.offsetWidth,
        height: iframeContainer.offsetHeight
    };
    localStorage.setItem("iframeDimensions", JSON.stringify(dimensions));
    console.log("Iframe dimensions saved:", dimensions);
});

// Restore dimensions on page load
window.addEventListener("load", () => {
    const savedDimensions = JSON.parse(localStorage.getItem("iframeDimensions"));
    const iframeContainer = document.getElementById("iframe-container");

    // Check if the iframe is not minimized before restoring dimensions
    if (savedDimensions && iframeContainer.style.height !== "10%") {
        iframeContainer.style.width = `${savedDimensions.width}px`;
        iframeContainer.style.height = `${savedDimensions.height}px`;
        console.log("Iframe dimensions restored:", savedDimensions);
    }
});
