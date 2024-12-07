document.addEventListener('DOMContentLoaded', () => {
    const detailsContainer = document.getElementById('medication-details');
    const totalContainer = document.getElementById('total'); // Changed to target the total div

    window.updateAllEffects = function() {
        const timestamps = JSON.parse(localStorage.getItem('timestamps')) || [];
        const now = new Date();
        
        // Clear old displays
        detailsContainer.innerHTML = '<h2>Individual Medication Effects</h2>';
        
        // Track overlapping periods
        let activeOnsets = 0;
        let activePeaks = 0;
        let activeDurations = 0;
        let residualEffects = 0;

        timestamps.forEach(entry => {
            const doseTime = new Date(entry.timestamp);
            const effects = calculateEffects(doseTime, now);
            
            if (effects.isActive) {
                displayIndividualEffects(doseTime, effects);
                
                // Count active effects
                if (effects.inOnset) activeOnsets++;
                if (effects.inPeak) activePeaks++;
                if (effects.inDuration) activeDurations++;
                if (effects.inResidual) residualEffects++;
            }
        });

        // Display total active effects
        displayTotalEffects(activeOnsets, activePeaks, activeDurations, residualEffects);
    };

    // Update effects every minute
    setInterval(updateAllEffects, 60000);
    updateAllEffects(); // Initial update

    document.getElementById('add-timestamp').addEventListener('click', () => {
        updateAllEffects();
    });

    function displayTotalEffects(onsets, peaks, durations, residuals) {
        // Remove any existing total effects div
        const existingTotalEffects = document.getElementById('total-medication-effects');
        if (existingTotalEffects) {
            existingTotalEffects.remove();
        }

        // Create new total effects div
        const totalEffectsDiv = document.createElement('div');
        totalEffectsDiv.id = 'total-medication-effects';
        
        if (onsets + peaks + durations + residuals === 0) {
            totalEffectsDiv.innerHTML = '<p class="no-effects">No active medication effects</p>';
        } else {
            totalEffectsDiv.innerHTML = `
                ${onsets > 0 ? `<p class="total-active">Doses in onset period: ${onsets}</p>` : ''}
                ${peaks > 0 ? `<p class="total-active">Doses at peak levels: ${peaks}</p>` : ''}
                ${durations > 0 ? `<p class="total-active">Active doses: ${durations}</p>` : ''}
                ${residuals > 0 ? `<p class="total-residual">Doses in residual period: ${residuals}</p>` : ''}
            `;
        }

        // Insert after the total amount heading
        const totalAmountHeading = totalContainer.querySelector('h2');
        totalAmountHeading.insertAdjacentElement('afterend', totalEffectsDiv);
    }

    // Rest of your functions remain the same
    function calculateEffects(doseTime, now) {
        const onsetStart = new Date(doseTime.getTime() + 20 * 60000);
        const onsetEnd = new Date(doseTime.getTime() + 60 * 60000);
        const peakStart = new Date(doseTime.getTime() + 60 * 60000);
        const peakEnd = new Date(doseTime.getTime() + 180 * 60000);
        const effectEnd = new Date(doseTime.getTime() + 360 * 60000);
        const residualEnd = new Date(doseTime.getTime() + 480 * 60000);

        return {
            isActive: now < residualEnd,
            preOnset: now < onsetStart,
            inOnset: now >= onsetStart && now < onsetEnd,
            inPeak: now >= peakStart && now < peakEnd,
            inDuration: now < effectEnd,
            inResidual: now >= effectEnd && now < residualEnd,
            times: {
                onsetStart, onsetEnd, peakStart, peakEnd, effectEnd, residualEnd
            }
        };
    }

    function displayIndividualEffects(doseTime, effects) {
        const div = document.createElement('div');
        div.className = 'individual-effect';
        const times = effects.times;
        
        div.innerHTML = `
            <p>Dose taken at ${formatTime(doseTime)}</p>
            ${effects.preOnset ? `<p class="waiting">Effects will begin at ${formatTime(times.onsetStart)}</p>` : ''}
            ${effects.inOnset ? `<p class="active">Currently in onset period (until ${formatTime(times.onsetEnd)})</p>` : ''}
            ${(effects.preOnset || effects.inOnset) ? 
                `<p class="upcoming">Peak levels will be: ${formatTime(times.peakStart)} - ${formatTime(times.peakEnd)}</p>` : ''}
            ${effects.inPeak ? `<p class="active">Peak levels: ${formatTime(times.peakStart)} - ${formatTime(times.peakEnd)}</p>` : ''}
            ${effects.inDuration ? `<p class="active">Primary effects active until ${formatTime(times.effectEnd)}</p>` : ''}
            ${effects.inResidual ? `<p class="residual">Residual effects until ${formatTime(times.residualEnd)}</p>` : ''}
            ${(effects.preOnset || effects.inOnset || effects.inPeak || effects.inDuration) ? 
                `<p class="upcoming">Residual effects will continue until ${formatTime(times.residualEnd)}</p>` : ''}
        `;
        
        detailsContainer.appendChild(div);
    }

    function formatTime(date) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
});