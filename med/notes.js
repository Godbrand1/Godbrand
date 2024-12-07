document.addEventListener('DOMContentLoaded', function() {
    // Collapsible functionality
    const coll = document.getElementsByClassName("collapsible");
    for (let i = 0; i < coll.length; i++) {
        coll[i].addEventListener("click", function() {
            this.classList.toggle("active");
            const content = this.nextElementSibling;
            if (content.style.maxHeight) {
                content.style.maxHeight = null;
                this.innerHTML = "Notes ▼";
            } else {
                content.style.maxHeight = content.scrollHeight + "px";
                this.innerHTML = "Notes ▲";
            }
        });
    }

    // Load saved notes
    const savedNotes = localStorage.getItem('userNotes');
    const textArea = document.getElementById('saved-notes');
    if (savedNotes) {
        textArea.value = savedNotes;
    }

    // Save notes functionality
    document.getElementById('save-notes').addEventListener('click', function() {
        const notes = document.getElementById('saved-notes').value;
        localStorage.setItem('userNotes', notes);
        alert('Notes saved!');
    });
});