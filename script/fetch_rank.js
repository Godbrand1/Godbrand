document.addEventListener('DOMContentLoaded', () => {
    const iframe = document.getElementById('slippiFrame');
    const goButton = document.getElementById('goButton');
    const connectCodeInput = document.getElementById('connectCode');

    // Function to fetch rank data
    async function fetchRankData(url) {
        try {
            const response = await fetch(`https://godbrand-rank-022b9b50b4a4.herokuapp.com/fetch-rank?url=${encodeURIComponent(url)}`);
            if (!response.ok) {
                throw new Error(`Network response was not ok, status: ${response.status}`);
            }
            const data = await response.json();
            if (data.rank) {
                console.log('Rank:', data.rank);
                // Process the rank data as needed
            } else {
                console.error('Failed to fetch rank data');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    // Event listener for the Go button
    goButton.addEventListener('click', () => {
        const url = iframe.src;
        if (!url) {
            console.error('URL query parameter is required');
            return;
        }
        fetchRankData(url);
    });

    // Event listener for Enter key in the input field
    connectCodeInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            const url = iframe.src;
            if (!url) {
                console.error('URL query parameter is required');
                return;
            }
            fetchRankData(url);
        }
    });

    // Update iframe src when user enters the connect code
    function openIframeWithCode(connectCode) {
        iframe.src = `https://slippi.gg/user/${encodeURIComponent(connectCode)}`;
    }

    // Function to open Slippi page
    function openSlippiPage() {
        const connectCode = connectCodeInput.value.trim();
        const validFormat = /^[A-Z]{1,6}-\d{1,3}$/; // Adjusted to 6 letters

        if (!validFormat.test(connectCode)) {
            alert('Invalid format. Use ABCDEF-123.');
            return;
        }

        if (document.getElementById('saveToggle').checked) {
            saveConnectCode(connectCode);  // Assuming saveConnectCode is defined elsewhere
        }

        openIframeWithCode(connectCode);
    }

    // Bind openSlippiPage function to the Go button click
    goButton.onclick = openSlippiPage;

    // Log rank element's text content
    const rankElement = document.querySelector('.MuiTypography-root.MuiTypography-body1.jss14.css-1rxv754');
    if (rankElement) {
        console.log('Rank:', rankElement.textContent);
    } else {
        console.error('Rank element not found');
    }
});
