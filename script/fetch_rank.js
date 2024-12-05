document.addEventListener('DOMContentLoaded', () => {
    const iframe = document.getElementById('slippiFrame');
    const goButton = document.getElementById('goButton');
    const connectCodeInput = document.getElementById('connectCode');
    const rankDisplay = document.getElementById('rankDisplay'); // Element to display rank

    // Function to fetch rank data
    async function fetchRankData(url) {
        try {
            const response = await fetch(`https://godbrand-rank-022b9b50b4a4.herokuapp.com/fetch-rating?url=${encodeURIComponent(url)}`);
            if (!response.ok) {
                throw new Error(`Network response was not ok, status: ${response.status}`);
            }
            const data = await response.json();
            if (data.rating) {
                rankDisplay.textContent = `Rating: ${data.rating}`; // Update the rank display
            } else {
                rankDisplay.textContent = 'Rating data not found';
            }
        } catch (error) {
            console.error('Error:', error);
            rankDisplay.textContent = `Error: ${error.message}`;
        }
    }

    // Event listener for the Go button
    goButton.addEventListener('click', () => {
        const connectCode = connectCodeInput.value.trim();
        if (!connectCode) {
            console.error('Connect code is required');
            return;
        }
        const url = `https://slippi.gg/user/${encodeURIComponent(connectCode)}`;
        console.log('Iframe URL set to:', url);
        fetchRankData(url);
        iframe.src = url; // Update iframe source
    });

    // Event listener for Enter key in the input field
    connectCodeInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            const connectCode = connectCodeInput.value.trim();
            if (!connectCode) {
                console.error('Connect code is required');
                return;
            }
            const url = `https://slippi.gg/user/${encodeURIComponent(connectCode)}`;
            console.log('Iframe URL set to:', url);
            fetchRankData(url);
            iframe.src = url; // Update iframe source
        }
    });
});
