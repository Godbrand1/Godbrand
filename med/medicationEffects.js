document.addEventListener('DOMContentLoaded', () => {
    const detailsContainer = document.getElementById('medication-details');
    const storedDoseTime = localStorage.getItem('timestamps');

    if (storedDoseTime) {
        displayMedicationEffects(new Date(storedDoseTime));
    }

    function displayMedicationEffects(doseTime) {
        const onsetStart = new Date(doseTime.getTime() + 20 * 60000);
        const onsetEnd = new Date(doseTime.getTime() + 60 * 60000);
        const peakStart = new Date(doseTime.getTime() + 60 * 60000);
        const peakEnd = new Date(doseTime.getTime() + 180 * 60000);
        const effectEnd = new Date(doseTime.getTime() + 360 * 60000);

        detailsContainer.innerHTML = `
            <h2>Medication Effects</h2>
            <p><strong>Onset:</strong> ${formatTime(onsetStart)} - ${formatTime(onsetEnd)}</p>
            <p><strong>Peak Blood Levels:</strong> ${formatTime(peakStart)} - ${formatTime(peakEnd)}</p>
            <p><strong>Duration of Effects:</strong> Until ${formatTime(effectEnd)}</p>
        `;
    }

    function formatTime(date) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
});
