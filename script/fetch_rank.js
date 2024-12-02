document.getElementById('slippiFrame').onload = async function() {
    const iframe = document.getElementById('slippiFrame');
    const url = iframe.src;

    try {
        const response = await fetch(`https://your-heroku-app-name.herokuapp.com/fetch-rank?url=${encodeURIComponent(url)}`);
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
};
