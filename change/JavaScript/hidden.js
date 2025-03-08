let lastScrollTop = 0; // Store the last scroll position
let scrollDirection = 0; // To track if the user has scrolled up enough
const image = document.querySelector('.corner-image'); // Select the image
const threshold = 100; // The number of pixels the user must scroll up before the image reappears

window.addEventListener('scroll', function() {
    let currentScroll = window.pageYOffset || document.documentElement.scrollTop;

    // If the user is scrolling down
    if (currentScroll > lastScrollTop) {
        image.classList.add('hidden'); // Hide the image
        scrollDirection = 0; // Reset scroll direction
    } else if (currentScroll <= threshold) {
        // If the user scrolls up enough to the top
        if (currentScroll === 0 || scrollDirection === 0) {
            image.classList.remove('hidden'); // Show the image
        }
        scrollDirection = currentScroll; // Update scroll direction
    }

    lastScrollTop = currentScroll <= 0 ? 0 : currentScroll; // Update last scroll position
});
