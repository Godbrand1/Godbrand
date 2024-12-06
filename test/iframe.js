document.addEventListener('DOMContentLoaded', () => {
    const iframeContainer = document.getElementById('iframe-container');

    // Get viewport dimensions
    const maxWidth = Math.min(window.innerWidth * 0.95, 2000); // 95% of viewport width or 2000px
    const maxHeight = Math.min(window.innerHeight * 0.9, 1200); // 90% of viewport height or 1200px
    const minWidth = 500;
    const minHeight = 100;

    const parentContainer = iframeContainer.parentElement;
    const parentMaxWidth = parentContainer.offsetWidth; // Use parent container's width as the max width

});