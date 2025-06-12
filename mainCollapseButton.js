document.addEventListener('DOMContentLoaded', () => {
    const section = document.getElementById('connectCodeSection');
    const button = document.getElementById('mainCollapseButton');

    if (section && button) {
        button.addEventListener('click', toggleSection);

        // 🔽 ✅ ADDED: Listen for Escape key
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                if (section.classList.contains('expanded')) {
                    toggleSection(); // Collapse if expanded
                }
            }
        });
        // 🔼 ✅ END: Escape key listener

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
