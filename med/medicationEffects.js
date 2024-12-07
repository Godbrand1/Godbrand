document.addEventListener('DOMContentLoaded', () => {
    const detailsContainer = document.getElementById('medication-details');
    const totalEffectsContainer = document.getElementById('total-medication-effects');

    // Update effects every minute
    setInterval(updateAllEffects, 60000);
    updateAllEffects(); // Initial update

    document.getElementById('add-timestamp').addEventListener('click', () => {
        updateAllEffects();
    });

    function updateAllEffects() {
        const timestamps = JSON.parse(localStorage.getItem('timestamps')) || [];
        const now = new Date();
        
        // Clear old displays
        detailsContainer.innerHTML = '<h2>Individual Medication Effects</h2>';
        totalEffectsContainer.innerHTML = '<h2>Total Active Effects</h2>';

        // Track overlapping periods
        let activeOnsets = 0;
        let activePeaks = 0;
        let activeDurations = 0;

        timestamps.forEach(entry => {
            const doseTime = new Date(entry.timestamp);
            const effects = calculateEffects(doseTime, now);
            
            if (effects.isActive) {
                displayIndividualEffects(doseTime, effects);
                
                // Count active effects
                if (effects.inOnset) activeOnsets++;
                if (effects.inPeak) activePeaks++;
                if (effects.inDuration) activeDurations++;
            }
        });

        // Display total active effects
        displayTotalEffects(activeOnsets, activePeaks, activeDurations);
    }

    function calculateEffects(doseTime, now) {
        const onsetStart = new Date(doseTime.getTime() + 20 * 60000);
        const onsetEnd = new Date(doseTime.getTime() + 60 * 60000);
        const peakStart = new Date(doseTime.getTime() + 60 * 60000);
        const peakEnd = new Date(doseTime.getTime() + 180 * 60000);
        const effectEnd = new Date(doseTime.getTime() + 360 * 60000);

        return {
            isActive: now < effectEnd,
            inOnset: now >= onsetStart && now < onsetEnd,
            inPeak: now >= peakStart && now < peakEnd,
            inDuration: now < effectEnd,
            times: {
                onsetStart, onsetEnd, peakStart, peakEnd, effectEnd
            }
        };
    }

    function displayIndividualEffects(doseTime, effects) {
        const div = document.createElement('div');
        div.className = 'individual-effect';
        const times = effects.times;
        
        div.innerHTML = `
            <p>Dose taken at ${formatTime(doseTime)}</p>
            ${effects.inOnset ? `<p class="active">Currently in onset period (until ${formatTime(times.onsetEnd)})</p>` : ''}
            ${effects.inPeak ? `<p class="active">Currently at peak levels (until ${formatTime(times.peakEnd)})</p>` : ''}
            ${effects.inDuration ? `<p class="active">Effects active until ${formatTime(times.effectEnd)}</p>` : ''}
        `;
        
        detailsContainer.appendChild(div);
    }

    function displayTotalEffects(onsets, peaks, durations) {
        if (onsets + peaks + durations === 0) {
            totalEffectsContainer.innerHTML += '<p>No active medication effects</p>';
            return;
        }

        totalEffectsContainer.innerHTML += `
            ${onsets > 0 ? `<p class="total-active">Total doses in onset period: ${onsets}</p>` : ''}
            ${peaks > 0 ? `<p class="total-active">Total doses at peak levels: ${peaks}</p>` : ''}
            ${durations > 0 ? `<p class="total-active">Total active doses: ${durations}</p>` : ''}
        `;
    }

    function formatTime(date) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
});