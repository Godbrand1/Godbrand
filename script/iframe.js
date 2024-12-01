document.addEventListener('DOMContentLoaded', () => {
    const iframeContainer = document.getElementById('iframe-container');
    const handles = document.querySelectorAll('.resize-handle');
    
    let isResizing = false;
    let currentHandle = null;
    let startX, startY, startWidth, startHeight;

    // Get viewport dimensions
    const maxWidth = Math.min(window.innerWidth * 0.95, 2000); // 95% of viewport width or 2000px
    const maxHeight = Math.min(window.innerHeight * 0.9, 1200); // 90% of viewport height or 1200px
    const minWidth = 500;
    const minHeight = 100;

    const parentContainer = iframeContainer.parentElement;
    const parentMaxWidth = parentContainer.offsetWidth; // Use parent container's width as the max width

    handles.forEach(handle => {
        handle.addEventListener('mousedown', initResize);
    });

    function initResize(e) {
        isResizing = true;
        currentHandle = e.target;
        
        startX = e.clientX;
        startY = e.clientY;
        startWidth = iframeContainer.offsetWidth;
        startHeight = iframeContainer.offsetHeight;

        document.addEventListener('mousemove', resize);
        document.addEventListener('mouseup', stopResize);
        
        // Prevent text selection while resizing
        e.preventDefault();
    }

    function resize(e) {
        if (!isResizing) return;

        let newWidth = startWidth;
        let newHeight = startHeight;

        // Calculate new dimensions based on which handle is being dragged
        if (currentHandle.classList.contains('right')) {
            newWidth = startWidth + (e.clientX - startX);
        } else if (currentHandle.classList.contains('left')) {
            newWidth = startWidth - (e.clientX - startX);
        }
        
        if (currentHandle.classList.contains('bottom')) {
            newHeight = startHeight + (e.clientY - startY);
        } else if (currentHandle.classList.contains('top')) {
            newHeight = startHeight - (e.clientY - startY);
        }

        // Apply size limits
        newWidth = Math.min(newWidth, parentMaxWidth);
        newWidth = Math.min(newWidth, maxWidth);
        newHeight = Math.min(newHeight, maxHeight);

        iframeContainer.style.width = `${newWidth}px`;
        iframeContainer.style.height = `${newHeight}px`;

        // Save dimensions to localStorage
        const dimensions = { width: newWidth, height: newHeight };
        localStorage.setItem("iframeDimensions", JSON.stringify(dimensions));
    }

    function stopResize() {
        isResizing = false;
        document.removeEventListener('mousemove', resize);
        document.removeEventListener('mouseup', stopResize);
    }

    // Restore dimensions on page load
    const savedDimensions = JSON.parse(localStorage.getItem("iframeDimensions"));
    if (savedDimensions) {
        iframeContainer.style.width = `${Math.min(Math.max(savedDimensions.width, minWidth), parentMaxWidth)}px`;
        iframeContainer.style.height = `${Math.min(Math.max(savedDimensions.height, minHeight), maxHeight)}px`;
    }
});