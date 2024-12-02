document.getElementById('slippiFrame').onload = async function() {
    const iframe = document.getElementById('slippiFrame');
    const url = iframe.src;

    console.log('Fetching rank for URL:', url);

    try {
        const response = await fetch(`https://godbrand-rank-022b9b50b4a4.herokuapp.com/fetch-rank?url=${encodeURIComponent(url)}`);
        console.log('Response status:', response.status);
        const data = await response.json();
        console.log('Fetched data:', data);

        if (data.rank) {
            console.log('Rank:', data.rank);
            document.getElementById('rankDisplay').textContent = `Rank: ${data.rank}`;
        } else {
            console.error('Failed to fetch rank data');
        }
    } catch (error) {
        console.error('Error:', error);
    }
};
