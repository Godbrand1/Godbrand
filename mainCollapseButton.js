document.addEventListener('DOMContentLoaded', () => {
    const section = document.getElementById('connectCodeSection');
    const button = document.getElementById('mainCollapseButton');

    if (section && button) {
        // Button click listener
        button.addEventListener('click', toggleSection);

        // ✅ Escape key toggles section open/closed
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                toggleSection(); // No condition — just toggle
            }
        });
    } else {
        console.error('Section or button not found');
    }

    function toggleSection() {
        if (section.classList.contains('collapsed')) {
            section.classList.remove('collapsed');
            section.classList.add('expanded');
            button.textContent = 'Collapse';
        } else {
            section.classList.remove('expanded');
            section.classList.add('collapsed');
            button.textContent = 'Expand';
        }
    }
});
