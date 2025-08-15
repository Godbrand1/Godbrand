// Profile page specific JavaScript
let selectedPlayerName = '';

// Toggle section visibility
function toggleSection(sectionId) {
    const section = document.getElementById(sectionId);
    const button = document.querySelector(`[onclick="toggleSection('${sectionId}')"]`);
    
    if (!section || !button) return;
    
    const isCollapsed = section.classList.contains('collapsed');
    
    if (isCollapsed) {
        section.classList.remove('collapsed');
        button.textContent = '−';
        button.title = 'Collapse section';
    } else {
        section.classList.add('collapsed');
        button.textContent = '+';
        button.title = 'Expand section';
    }
}

// Helper function to get safe hero image name
function getHeroImageName(heroName) {
    if (!heroName || heroName === 'Unknown' || heroName.trim() === '') {
        return 'abathur';
    }
    return heroName.toLowerCase().replace(/[^a-z0-9]/g, '-');
}

// Ensure all localStorage data is loaded and synchronized
function initializeProfileData() {
    console.log('=== Initializing Profile Data ===');
    
    // Force reload matches data from localStorage
    const matchesData = localStorage.getItem('hotsMatches');
    if (matchesData) {
        try {
            window.matches = JSON.parse(matchesData);
            console.log('✓ Loaded', window.matches.length, 'matches from localStorage');
        } catch (e) {
            console.error('Failed to parse matches data:', e);
            window.matches = [];
        }
    } else {
        console.warn('⚠ No matches data found in localStorage');
        window.matches = [];
    }
    
    // Force reload player data from localStorage
    const playerDataSaved = localStorage.getItem('hotsPlayerData');
    if (playerDataSaved) {
        try {
            window.playerData = JSON.parse(playerDataSaved);
            console.log('✓ Loaded player data:', window.playerData.players.length, 'players');
        } catch (e) {
            console.error('Failed to parse player data:', e);
            window.playerData = {
                players: [],
                playerStats: {},
                totalMatches: 0,
                wins: 0,
                losses: 0
            };
        }
    } else {
        console.warn('⚠ No player data found in localStorage');
        window.playerData = {
            players: [],
            playerStats: {},
            totalMatches: 0,
            wins: 0,
            losses: 0
        };
    }
    
    // Force reload myPlayerName from localStorage
    const savedPlayerName = localStorage.getItem('myPlayerName');
    if (savedPlayerName) {
        window.myPlayerName = savedPlayerName;
        console.log('✓ Loaded myPlayerName:', window.myPlayerName);
    } else {
        console.warn('⚠ No myPlayerName found in localStorage');
        window.myPlayerName = '';
    }
    
    console.log('=== Profile Data Initialization Complete ===');
}

// Debug function to check localStorage content
function debugLocalStorage() {
    console.log('=== LocalStorage Debug ===');
    console.log('Current URL:', window.location.href);
    console.log('localStorage length:', localStorage.length);
    
    // List all localStorage keys
    console.log('All localStorage keys:');
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const value = localStorage.getItem(key);
        if (key.startsWith('hots') || key === 'myPlayerName') {
            try {
                const parsed = JSON.parse(value);
                if (Array.isArray(parsed)) {
                    console.log(`  ${key}: Array with ${parsed.length} items`);
                } else if (typeof parsed === 'object') {
                    console.log(`  ${key}: Object with keys:`, Object.keys(parsed));
                } else {
                    console.log(`  ${key}: ${parsed}`);
                }
            } catch (e) {
                console.log(`  ${key}: ${value}`);
            }
        } else {
            console.log(`  ${key}: (other)`);
        }
    }
    
    console.log('=== End Debug ===');
}

// Function to copy localStorage data from index page (for local file testing)
function copyDataFromIndex() {
    console.log('=== Data Copy Utility ===');
    console.log('To copy data from index.html:');
    console.log('1. Open index.html in another tab');
    console.log('2. Open console and run: exportData()');
    console.log('3. Copy the JSON output');
    console.log('4. Come back to profile.html and run: importData(jsonData)');
    console.log('========================');
}

// Function to import data that was exported from index page
function importData(dataString) {
    try {
        const data = typeof dataString === 'string' ? JSON.parse(dataString) : dataString;
        
        if (data.matches) {
            localStorage.setItem('hotsMatches', JSON.stringify(data.matches));
            console.log('✓ Imported', data.matches.length, 'matches');
        }
        
        if (data.playerData) {
            localStorage.setItem('hotsPlayerData', JSON.stringify(data.playerData));
            console.log('✓ Imported player data');
        }
        
        if (data.myPlayerName) {
            localStorage.setItem('myPlayerName', data.myPlayerName);
            console.log('✓ Imported myPlayerName:', data.myPlayerName);
        }
        
        // Refresh the page to load the new data
        console.log('Data imported successfully! Reloading page...');
        setTimeout(() => window.location.reload(), 1000);
        
    } catch (e) {
        console.error('Failed to import data:', e);
    }
}

// Function to export current localStorage data (to be run on index.html)
function exportData() {
    const data = {
        matches: JSON.parse(localStorage.getItem('hotsMatches') || '[]'),
        playerData: JSON.parse(localStorage.getItem('hotsPlayerData') || '{}'),
        myPlayerName: localStorage.getItem('myPlayerName') || ''
    };
    
    console.log('Copy this data:');
    console.log(JSON.stringify(data));
    return data;
}

// Function to verify data sharing is working
function verifyDataSharing() {
    const status = {
        matches: matches ? matches.length : 0,
        playerData: playerData ? playerData.players.length : 0,
        myPlayerName: localStorage.getItem('myPlayerName') || 'Not set',
        allGood: false
    };
    
    status.allGood = status.matches > 0 && status.playerData > 0 && status.myPlayerName !== 'Not set';
    
    console.log('Data sharing status:', status);
    return status;
}

// Make debugging functions globally available
window.verifyDataSharing = verifyDataSharing;
window.debugLocalStorage = debugLocalStorage;

// Note: copyDataFromIndex, importData, exportData are only needed for local file testing
// They can be removed when deploying to a web server
window.copyDataFromIndex = copyDataFromIndex;
window.importData = importData;
window.exportData = exportData;

document.addEventListener('DOMContentLoaded', function() {
    // Debug localStorage content
    debugLocalStorage();
    
    // Initialize profile data first
    initializeProfileData();
    
    // Wait a bit for script.js to load player data
    setTimeout(function() {
        // Verify data sharing is working
        verifyDataSharing();
        
        // Setup autocomplete for player search
        setupPlayerSearchAutocomplete();
        
        // Load default player (myPlayerName from localStorage)
        selectedPlayerName = localStorage.getItem('myPlayerName') || '';
        if (selectedPlayerName) {
            document.getElementById('player-search-input').value = selectedPlayerName;
            loadPlayerProfile();
        } else {
            document.getElementById('profile-player-name').textContent = 'No player selected';
            document.getElementById('profile-most-played').textContent = 'Please select a player above';
        }
    }, 100);
});

function setupPlayerSearchAutocomplete() {
    const input = document.getElementById('player-search-input');
    if (input && typeof setupAutocompleteForInput === 'function' && playerData && playerData.players) {
        setupAutocompleteForInput(input, playerData.players, 'player');
    } else {
        // If setupAutocompleteForInput is not available, we can try again later
        console.warn('Autocomplete setup failed - retrying in 500ms');
        setTimeout(function() {
            if (typeof setupAutocompleteForInput === 'function' && playerData && playerData.players) {
                setupAutocompleteForInput(input, playerData.players, 'player');
            }
        }, 500);
    }
}

function loadSelectedPlayer() {
    const input = document.getElementById('player-search-input');
    selectedPlayerName = input.value.trim();
    
    if (!selectedPlayerName) {
        alert('Please enter a player name');
        return;
    }
    
    loadPlayerProfile();
}

function loadPlayerProfile() {
    if (!selectedPlayerName) return;
    
    if (typeof calculatePlayerStats !== 'function') {
        console.error('calculatePlayerStats function not found');
        return;
    }
    
    const stats = calculatePlayerStats(selectedPlayerName);
    updateProfileDisplay(stats);
    loadPlayerNotes();
    displayRolePreferences();
    updateOpponentAnalysisTitle();
    updateTeammateAnalysisTitle();
    loadHeroStats(stats.heroes);
    loadWinrateHeroes(stats);
    loadOpponentStats();
    loadTeammateStats();
    displayEnhancedRecentMatches();
}

function updateProfileDisplay(stats) {
    if (!selectedPlayerName) {
        document.getElementById('profile-player-name').textContent = 'No Player Selected';
        document.getElementById('profile-most-played').textContent = 'Please select a player above';
        return;
    }
    
    // Update profile header
    document.getElementById('profile-player-name').textContent = selectedPlayerName;
    
    // Get most played hero
    const topHero = Object.entries(stats.heroes)
        .filter(([hero]) => hero !== 'Unknown')
        .sort(([,a], [,b]) => b - a)[0];
        
    if (topHero) {
        document.getElementById('profile-most-played-hero').textContent = topHero[0];
        const heroImage = `images/${topHero[0].toLowerCase().replace(/[^a-z0-9]/g, '-')}.jpg`;
        document.getElementById('profile-hero-icon').src = heroImage;
        document.getElementById('profile-hero-icon').alt = topHero[0];
        document.getElementById('profile-hero-icon').onerror = function() { this.src = 'images/abathur.jpg'; };
    } else {
        document.getElementById('profile-most-played-hero').textContent = 'None';
        document.getElementById('profile-hero-icon').src = 'images/abathur.jpg';
    }
    
    // Update stats
    document.getElementById('total-matches-stat').textContent = stats.totalMatches;
    document.getElementById('wins-stat').textContent = stats.wins;
    document.getElementById('losses-stat').textContent = stats.losses;
    
    const winRate = stats.totalMatches > 0 ? ((stats.wins / stats.totalMatches) * 100).toFixed(1) : 0;
    document.getElementById('win-rate-stat').textContent = winRate + '%';
}

function loadHeroStats(heroStats) {
    const heroStatsGrid = document.getElementById('hero-stats-grid');
    
    // Sort heroes by play count
    const sortedHeroes = Object.entries(heroStats)
        .filter(([hero]) => hero !== 'Unknown')
        .sort(([,a], [,b]) => b - a);
    
    if (sortedHeroes.length === 0) {
        heroStatsGrid.innerHTML = '<p>No hero statistics available</p>';
        return;
    }
    
    heroStatsGrid.innerHTML = sortedHeroes.map(([hero, count]) => {
        const heroImage = `images/${hero.toLowerCase().replace(/[^a-z0-9]/g, '-')}.jpg`;
        return `
            <div class="hero-stat-card">
                <img src="${heroImage}" alt="${hero}" class="hero-stat-icon" onerror="this.src='images/abathur.jpg'">
                <div class="hero-stat-info">
                    <h4>${hero}</h4>
                    <div class="hero-stat-details">${count} matches played</div>
                </div>
            </div>
        `;
    }).join('');
}

function loadWinrateHeroes(stats) {
    const bestWinrateDiv = document.getElementById('best-winrate-hero');
    const worstWinrateDiv = document.getElementById('worst-winrate-hero');
    
    // Calculate winrates for heroes with enough matches (25% of total)
    const minMatches = Math.ceil(stats.totalMatches * 0.25);
    const heroWinrates = [];
    
    // Get detailed hero stats with wins/losses
    const heroDetails = {};
    
    // Calculate wins/losses per hero from matches
    window.matches.forEach(match => {
        const playerInMatch = match.allyTeam.find(ally => ally.player === selectedPlayerName);
        if (playerInMatch && playerInMatch.hero && playerInMatch.hero !== 'Unknown') {
            const hero = playerInMatch.hero;
            if (!heroDetails[hero]) {
                heroDetails[hero] = { matches: 0, wins: 0, losses: 0 };
            }
            heroDetails[hero].matches++;
            if (match.result === 'win') {
                heroDetails[hero].wins++;
            } else {
                heroDetails[hero].losses++;
            }
        }
    });
    
    // Filter heroes with enough matches and calculate winrates
    Object.entries(heroDetails).forEach(([hero, data]) => {
        if (data.matches >= minMatches) {
            const winrate = (data.wins / data.matches) * 100;
            heroWinrates.push({
                hero,
                winrate: winrate.toFixed(1),
                matches: data.matches,
                wins: data.wins,
                losses: data.losses
            });
        }
    });
    
    // Find best and worst
    const bestHero = heroWinrates.length > 0 ? heroWinrates.reduce((a, b) => parseFloat(a.winrate) > parseFloat(b.winrate) ? a : b) : null;
    const worstHero = heroWinrates.length > 0 ? heroWinrates.reduce((a, b) => parseFloat(a.winrate) < parseFloat(b.winrate) ? a : b) : null;
    
    // Display best winrate hero
    if (bestHero) {
        const heroImageName = getHeroImageName(bestHero.hero);
        bestWinrateDiv.innerHTML = `
            <div class="winrate-hero-icon">
                <img src="images/${heroImageName}.jpg" alt="${bestHero.hero}" class="winrate-hero-img" onerror="this.src='images/abathur.jpg'">
            </div>
            <div class="winrate-hero-info">
                <div class="winrate-hero-name" style="color: #2ecc71;">${bestHero.hero}</div>
                <div class="winrate-hero-stats">${bestHero.winrate}% winrate (${bestHero.wins}-${bestHero.losses})</div>
                <div class="winrate-hero-stats">${bestHero.matches} matches played</div>
            </div>
        `;
    } else {
        bestWinrateDiv.innerHTML = `
            <div class="winrate-undetermined">
                <div>Undetermined</div>
                <div style="font-size: 0.8rem; margin-top: 5px;">Requires at least ${minMatches} matches (25% of total)</div>
            </div>
        `;
    }
    
    // Display worst winrate hero
    if (worstHero) {
        const heroImageName = getHeroImageName(worstHero.hero);
        worstWinrateDiv.innerHTML = `
            <div class="winrate-hero-icon">
                <img src="images/${heroImageName}.jpg" alt="${worstHero.hero}" class="winrate-hero-img" onerror="this.src='images/abathur.jpg'">
            </div>
            <div class="winrate-hero-info">
                <div class="winrate-hero-name" style="color: #e74c3c;">${worstHero.hero}</div>
                <div class="winrate-hero-stats">${worstHero.winrate}% winrate (${worstHero.wins}-${worstHero.losses})</div>
                <div class="winrate-hero-stats">${worstHero.matches} matches played</div>
            </div>
        `;
    } else {
        worstWinrateDiv.innerHTML = `
            <div class="winrate-undetermined">
                <div>Undetermined</div>
                <div style="font-size: 0.8rem; margin-top: 5px;">Requires at least ${minMatches} matches (25% of total)</div>
            </div>
        `;
    }
}

// Update opponent analysis title with selectedPlayerName
function updateOpponentAnalysisTitle() {
    const subtitleElement = document.getElementById('opponent-subtitle');
    if (subtitleElement && selectedPlayerName) {
        subtitleElement.textContent = `matches against ${selectedPlayerName}`;
    } else if (subtitleElement) {
        subtitleElement.textContent = 'matches against';
    }
}

// Update teammate analysis title with selectedPlayerName
function updateTeammateAnalysisTitle() {
    const subtitleElement = document.getElementById('teammate-subtitle');
    if (subtitleElement && selectedPlayerName) {
        subtitleElement.textContent = `matches with ${selectedPlayerName}`;
    } else if (subtitleElement) {
        subtitleElement.textContent = 'matches with';
    }
}

function loadOpponentStats() {
    const opponentList = document.getElementById('opponent-list');
    
    // Ensure matches data is available
    if (!window.matches || window.matches.length === 0) {
        opponentList.innerHTML = '<p>No match data available</p>';
        return;
    }
    
    // Get all opponents this player has faced
    const opponents = {};
    
    window.matches.forEach(match => {
        const playerInMatch = match.allyTeam.find(ally => ally.player === selectedPlayerName);
        if (playerInMatch) {
            match.enemyTeam.forEach(enemy => {
                if (enemy.player && enemy.player !== 'Unknown') {
                    if (!opponents[enemy.player]) {
                        opponents[enemy.player] = { 
                            matches: 0, 
                            wins: 0, 
                            losses: 0,
                            heroes: {}
                        };
                    }
                    opponents[enemy.player].matches++;
                    if (match.result === 'win') {
                        opponents[enemy.player].wins++;
                    } else {
                        opponents[enemy.player].losses++;
                    }
                    
                    // Track hero usage for this opponent
                    if (enemy.hero && enemy.hero !== 'Unknown') {
                        if (!opponents[enemy.player].heroes[enemy.hero]) {
                            opponents[enemy.player].heroes[enemy.hero] = 0;
                        }
                        opponents[enemy.player].heroes[enemy.hero]++;
                    }
                }
            });
        }
    });
    
    const sortedOpponents = Object.entries(opponents)
        .sort(([,a], [,b]) => b.matches - a.matches);
    
    if (sortedOpponents.length === 0) {
        opponentList.innerHTML = '<p>No opponent data available</p>';
        return;
    }
    
    // Store opponents data globally for pagination
    window.opponentPaginationData = {
        allItems: sortedOpponents,
        currentPage: 0,
        itemsPerPage: 5,
        renderFunction: function() {
            displayOpponentsWithPagination(this.allItems, opponentList, this.currentPage, this.itemsPerPage);
        }
    };

    // Initial render
    displayOpponentsWithPagination(sortedOpponents, opponentList, 0, 5);
}

// Display opponents with pagination
function displayOpponentsWithPagination(sortedOpponents, container, currentPage, itemsPerPage) {
    const startIndex = 0; // Always start from beginning
    const endIndex = (currentPage + 1) * itemsPerPage; // Show cumulative items
    const opponentsToShow = sortedOpponents.slice(startIndex, endIndex);
    const hasMore = endIndex < sortedOpponents.length;
    
    const opponentHTML = opponentsToShow.map(([opponent, stats]) => {
        const winRate = ((stats.wins / stats.matches) * 100).toFixed(1);
        
        // Find most played hero for this opponent
        let mostPlayedHero = 'Unknown';
        let maxHeroCount = 0;
        for (const [hero, count] of Object.entries(stats.heroes)) {
            if (count > maxHeroCount) {
                maxHeroCount = count;
                mostPlayedHero = hero;
            }
        }
        
        const heroImageName = getHeroImageName(mostPlayedHero);
        
        return `
            <div class="opponent-item">
                <div class="opponent-hero-icon">
                        <img src="images/${heroImageName}.jpg" alt="${mostPlayedHero}" class="opponent-hero-img" onerror="this.src='images/abathur.jpg'">
                    </div>
                    <div class="opponent-info">
                        <div class="opponent-name">${opponent}</div>
                        <div class="opponent-stats-detail">
                            ${stats.matches} matches | ${stats.wins}-${stats.losses} | ${winRate}% win rate
                        </div>
                    </div>
                </div>
            `;
        }).join('');

    let paginationHTML = '';
    if (hasMore && currentPage === 0) {
        paginationHTML = '<button onclick="showMoreOpponents()" class="show-more-btn">Show More</button>';
    } else if (currentPage > 0) {
        paginationHTML = '<button onclick="showLessOpponents()" class="show-less-btn">Show Less</button>';
        if (hasMore) {
            paginationHTML += '<button onclick="showMoreOpponents()" class="show-more-btn">Show More</button>';
        }
    }

    container.innerHTML = opponentHTML + (paginationHTML ? `<div class="pagination-controls">${paginationHTML}</div>` : '');
}

// Global functions for opponent pagination
function showMoreOpponents() {
    const data = window.opponentPaginationData;
    data.currentPage++;
    data.renderFunction();
}

function showLessOpponents() {
    const data = window.opponentPaginationData;
    data.currentPage = 0;
    data.renderFunction();
}

function loadTeammateStats() {
    const teammateList = document.getElementById('teammate-list');
    
    // Ensure matches data is available
    if (!window.matches || window.matches.length === 0) {
        teammateList.innerHTML = '<p>No match data available</p>';
        return;
    }
    
    // Get all teammates this player has played with
    const teammates = {};
    
    window.matches.forEach(match => {
        const playerInMatch = match.allyTeam.find(ally => ally.player === selectedPlayerName);
        if (playerInMatch) {
            // Get other teammates in the same match (excluding the selected player)
            match.allyTeam.forEach(teammate => {
                if (teammate.player && teammate.player !== 'Unknown' && teammate.player !== selectedPlayerName) {
                    if (!teammates[teammate.player]) {
                        teammates[teammate.player] = { 
                            matches: 0, 
                            wins: 0, 
                            losses: 0,
                            heroes: {}
                        };
                    }
                    teammates[teammate.player].matches++;
                    if (match.result === 'win') {
                        teammates[teammate.player].wins++;
                    } else {
                        teammates[teammate.player].losses++;
                    }
                    
                    // Track hero usage for this teammate
                    if (teammate.hero && teammate.hero !== 'Unknown') {
                        if (!teammates[teammate.player].heroes[teammate.hero]) {
                            teammates[teammate.player].heroes[teammate.hero] = 0;
                        }
                        teammates[teammate.player].heroes[teammate.hero]++;
                    }
                }
            });
        }
    });
    
    const sortedTeammates = Object.entries(teammates)
        .sort(([,a], [,b]) => b.matches - a.matches);
    
    if (sortedTeammates.length === 0) {
        teammateList.innerHTML = '<p>No teammate data available</p>';
        return;
    }

    // Set up pagination data for teammates
    window.teammatePaginationData = {
        allItems: sortedTeammates,
        currentPage: 0,
        itemsPerPage: 5,
        renderFunction: function() {
            displayTeammatesWithPagination(this.allItems, teammateList, this.currentPage, this.itemsPerPage);
        }
    };

    // Initial render
    displayTeammatesWithPagination(sortedTeammates, teammateList, 0, 5);
}

function displayTeammatesWithPagination(teammates, container, currentPage, itemsPerPage) {
    const startIndex = 0; // Always start from beginning
    const endIndex = (currentPage + 1) * itemsPerPage; // Show cumulative items
    const currentPageItems = teammates.slice(startIndex, endIndex);
    const hasMore = endIndex < teammates.length;
    
    const teammatesHTML = currentPageItems.map(([teammate, stats]) => {
        const winRate = ((stats.wins / stats.matches) * 100).toFixed(1);
        
        // Find most played hero for this teammate
        let mostPlayedHero = 'Unknown';
        let maxHeroCount = 0;
        for (const [hero, count] of Object.entries(stats.heroes)) {
            if (count > maxHeroCount) {
                maxHeroCount = count;
                mostPlayedHero = hero;
            }
        }
        
        const heroImageName = getHeroImageName(mostPlayedHero);
        
        return `
            <div class="teammate-item">
                <div class="teammate-hero-icon">
                    <img src="images/${heroImageName}.jpg" alt="${mostPlayedHero}" class="teammate-hero-img" onerror="this.src='images/abathur.jpg'">
                </div>
                <div class="teammate-info">
                    <div class="teammate-name">${teammate}</div>
                    <div class="teammate-stats-detail">
                        ${stats.matches} matches | ${stats.wins}-${stats.losses} | ${winRate}% win rate
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    let paginationHTML = '';
    if (hasMore && currentPage === 0) {
        paginationHTML = '<button onclick="showMoreTeammates()" class="show-more-btn">Show More</button>';
    } else if (currentPage > 0) {
        paginationHTML = '<button onclick="showLessTeammates()" class="show-less-btn">Show Less</button>';
        if (hasMore) {
            paginationHTML += '<button onclick="showMoreTeammates()" class="show-more-btn">Show More</button>';
        }
    }
    
    container.innerHTML = teammatesHTML + (paginationHTML ? `<div class="pagination-controls">${paginationHTML}</div>` : '');
}

function showMoreTeammates() {
    const data = window.teammatePaginationData;
    data.currentPage++;
    data.renderFunction();
}

function showLessTeammates() {
    const data = window.teammatePaginationData;
    data.currentPage = 0;
    data.renderFunction();
}

function loadRecentMatches() {
    const recentMatchesDiv = document.getElementById('recent-matches');
    
    // Ensure matches data is available
    if (!matches || matches.length === 0) {
        recentMatchesDiv.innerHTML = '<p>No match data available</p>';
        return;
    }
    
    // Get recent matches for the selected player
    const playerMatches = matches.filter(match => 
        match.allyTeam.some(player => player.player === selectedPlayerName)
    ).slice(0, 5);
    
    if (playerMatches.length === 0) {
        recentMatchesDiv.innerHTML = '<p>No recent matches found</p>';
        return;
    }
    
    recentMatchesDiv.innerHTML = playerMatches.map(match => {
        const playerHero = match.allyTeam.find(player => player.player === selectedPlayerName)?.hero || 'Unknown';
        const heroImageName = getHeroImageName(playerHero);
        
        return `
            <div class="match-card compact">
                <div class="match-header">
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <img src="images/${heroImageName}.jpg" alt="${playerHero}" style="width: 30px; height: 30px; border-radius: 4px; object-fit: cover;" onerror="this.src='images/abathur.jpg'">
                        <div>
                            <strong>${match.map}</strong> - ${playerHero}
                            <div style="font-size: 0.8rem; color: #666;">
                                ${new Date(match.timestamp).toLocaleDateString()}
                            </div>
                        </div>
                    </div>
                    <span class="match-result ${match.result}">${match.result}</span>
                </div>
            </div>
        `;
    }).join('');
}

function getMostPlayedHero(stats) {
    const heroes = stats.heroes;
    let mostPlayed = null;
    let maxCount = 0;
    
    for (const [heroName, count] of Object.entries(heroes)) {
        if (count > maxCount) {
            maxCount = count;
            mostPlayed = { name: heroName, count: count };
        }
    }
    
    return mostPlayed;
}

function loadHeroStatistics(myStats) {
    const heroStatsGrid = document.getElementById('hero-stats-grid');
    const heroes = myStats.heroes;
    
    // Sort heroes by play count
    const sortedHeroes = Object.entries(heroes).sort(([,a], [,b]) => b - a);
    
    heroStatsGrid.innerHTML = sortedHeroes.map(([heroName, count]) => {
        const percentage = ((count / myStats.totalMatches) * 100).toFixed(1);
        const heroImageName = getHeroImageName(heroName);
        
        return `
            <div class="hero-stat-card">
                <img src="images/${heroImageName}.jpg" alt="${heroName}" class="hero-stat-icon" 
                     onerror="this.src='images/abathur.jpg'">
                <div class="hero-stat-info">
                    <h4>${heroName}</h4>
                    <div class="hero-stat-details">
                        ${count} matches (${percentage}%)
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function loadOpponentAnalysis() {
    const opponentList = document.getElementById('opponent-list');
    const myPlayerName = localStorage.getItem('myPlayerName');
    
    // Ensure matches data is available
    if (!matches || matches.length === 0) {
        opponentList.innerHTML = '<p>No match data available</p>';
        return;
    }
    
    // Analyze matches against opponents
    const opponents = {};
    
    matches.forEach(match => {
        // Check if I'm in ally team
        const myTeammate = match.allyTeam.find(player => player.player === myPlayerName);
        if (myTeammate) {
            // Analyze enemy team
            match.enemyTeam.forEach(enemy => {
                if (enemy.player !== 'Unknown' && enemy.player !== '') {
                    if (!opponents[enemy.player]) {
                        opponents[enemy.player] = { 
                            wins: 0, 
                            losses: 0, 
                            lastMatch: null,
                            totalMatches: 0
                        };
                    }
                    opponents[enemy.player][match.result]++;
                    opponents[enemy.player].totalMatches++;
                    if (!opponents[enemy.player].lastMatch || new Date(match.timestamp) > new Date(opponents[enemy.player].lastMatch)) {
                        opponents[enemy.player].lastMatch = match.timestamp;
                    }
                }
            });
        }
    });
    
    // Sort by total matches
    const sortedOpponents = Object.entries(opponents)
        .sort(([,a], [,b]) => b.totalMatches - a.totalMatches)
        .slice(0, 10); // Top 10 opponents
    
    if (sortedOpponents.length === 0) {
        opponentList.innerHTML = '<p>No opponent data available</p>';
        return;
    }
    
    opponentList.innerHTML = sortedOpponents.map(([playerName, stats]) => {
        const winRate = ((stats.wins / stats.totalMatches) * 100).toFixed(1);
        const lastMatchDate = new Date(stats.lastMatch);
        const timeSince = getTimeSince(lastMatchDate);
        
        return `
            <div class="opponent-item">
                <div class="opponent-name">${playerName}</div>
                <div class="opponent-stats-detail">
                    <span>Record: ${stats.wins}-${stats.losses}</span>
                    <span class="${stats.wins > stats.losses ? 'win-rate' : 'loss-rate'}">
                        ${winRate}% win rate
                    </span>
                    <span>Last played: ${timeSince}</span>
                </div>
            </div>
        `;
    }).join('');
}

function getTimeSince(date) {
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
}

// Save player notes from profile page
function savePlayerNotesFromProfile() {
    if (!selectedPlayerName) {
        alert('Please select a player first');
        return;
    }
    
    const notes = document.getElementById('player-notes').value;
    savePlayerNotes(selectedPlayerName, notes);
    alert('Notes saved successfully!');
}

// Load and display player notes
function loadPlayerNotes() {
    if (!selectedPlayerName) return;
    
    const notes = getPlayerNotes(selectedPlayerName);
    document.getElementById('player-notes').value = notes;
}

// Display role preferences
function displayRolePreferences() {
    if (!selectedPlayerName) return;
    
    const rolePrefs = getPlayerRolePreferences(selectedPlayerName);
    const container = document.getElementById('role-preferences');
    
    if (!rolePrefs.roles || rolePrefs.roles.length === 0) {
        container.innerHTML = '<p>No role data available for this player.</p>';
        return;
    }
    
    container.innerHTML = `
        <div class="role-preferences-grid">
            ${rolePrefs.roles.map((role, index) => `
                <div class="role-card ${index === 0 ? 'primary' : ''}">
                    <div class="role-name">${role.role}</div>
                    <div class="role-stats">
                        <span class="role-percentage">${role.percentage}%</span> 
                        (${role.count}/${rolePrefs.totalMatches} matches)
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

// Enhanced recent matches display
function displayEnhancedRecentMatches() {
    const recentMatchesDiv = document.getElementById('recent-matches');
    
    if (!selectedPlayerName) {
        recentMatchesDiv.innerHTML = '<p>Please select a player to view matches</p>';
        return;
    }
    
    // Ensure matches data is available
    if (!window.matches || window.matches.length === 0) {
        recentMatchesDiv.innerHTML = '<p>No match data available</p>';
        return;
    }
    
    // Get all matches for the selected player, sorted by timestamp (newest first)
    const playerMatches = window.matches.filter(match => 
        match.allyTeam.some(player => player.player === selectedPlayerName)
    ).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    if (playerMatches.length === 0) {
        recentMatchesDiv.innerHTML = '<p>No recent matches found</p>';
        return;
    }
    
    recentMatchesDiv.innerHTML = playerMatches.slice(0, 10).map((match, index) => {
        const playerHero = match.allyTeam.find(player => player.player === selectedPlayerName)?.hero || 'Unknown';
        const heroImageName = getHeroImageName(playerHero);
        
        return `
            <div class="match-detail-card">
                <div class="match-detail-header" onclick="toggleMatchDetails('match-${match.id}')">
                    <div class="match-info-header">
                        <img src="images/${heroImageName}.jpg" alt="${playerHero}" class="hero-icon-small" onerror="this.src='images/abathur.jpg'">
                        <div>
                            <strong>${match.map}</strong> - ${playerHero}
                            <div style="font-size: 0.8rem; color: #c8d6e5;">
                                ${new Date(match.timestamp).toLocaleDateString()} ${new Date(match.timestamp).toLocaleTimeString()}
                            </div>
                        </div>
                        <span class="match-result ${match.result}">${match.result}</span>
                    </div>
                    <div class="match-time-info">
                        <div class="matches-ago">${index + 1} match${index === 0 ? '' : 'es'} ago</div>
                        <div>${getTimeSince(new Date(match.timestamp))}</div>
                        <span class="expand-icon" id="icon-match-${match.id}">▼</span>
                    </div>
                </div>
                <div class="match-detail-content" id="match-${match.id}">
                    <div class="teams-container">
                        <div class="team-section ally">
                            <div class="team-title">Allied Team</div>
                            ${match.allyTeam.map(player => {
                                const heroImg = (player.hero || 'Unknown').toLowerCase().replace(/[^a-z0-9]/g, '-');
                                const isCurrentPlayer = player.player === selectedPlayerName;
                                return `
                                    <div class="player-in-match ${isCurrentPlayer ? 'current-player' : ''}">
                                        <img src="images/${heroImg}.jpg" alt="${player.hero}" class="hero-icon-small" onerror="this.src='images/abathur.jpg'">
                                        <div>
                                            <strong>${player.player || 'Unknown'}</strong>
                                            <div style="font-size: 0.8rem; color: #c8d6e5;">${player.hero || 'Unknown'}</div>
                                        </div>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                        <div class="team-section enemy">
                            <div class="team-title">Enemy Team</div>
                            ${match.enemyTeam.map(player => {
                                const heroImg = (player.hero || 'Unknown').toLowerCase().replace(/[^a-z0-9]/g, '-');
                                return `
                                    <div class="player-in-match">
                                        <img src="images/${heroImg}.jpg" alt="${player.hero}" class="hero-icon-small" onerror="this.src='images/abathur.jpg'">
                                        <div>
                                            <strong>${player.player || 'Unknown'}</strong>
                                            <div style="font-size: 0.8rem; color: #c8d6e5;">${player.hero || 'Unknown'}</div>
                                        </div>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    </div>
                    ${match.notes ? `<div style="margin-top: 15px; padding: 10px; background: rgba(255,255,255,0.1); border-radius: 5px;"><strong>Notes:</strong> ${match.notes}</div>` : ''}
                </div>
            </div>
        `;
    }).join('');
}

// Toggle match details
function toggleMatchDetails(matchId) {
    const content = document.getElementById(matchId);
    const icon = document.getElementById(`icon-${matchId}`);
    
    if (content.classList.contains('expanded')) {
        content.classList.remove('expanded');
        icon.classList.remove('rotated');
    } else {
        content.classList.add('expanded');
        icon.classList.add('rotated');
    }
}
