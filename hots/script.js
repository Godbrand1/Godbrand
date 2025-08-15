let matches = JSON.parse(localStorage.getItem('hotsMatches')) || [];
let currentScreenshots = [];
let currentPage = 1;
const matchesPerPage = 5;
let editingMatchId = null;
let myPlayerName = ''; // Track the current player's name
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// Helper function to get safe hero image name
function getHeroImageName(heroName) {
    if (!heroName || heroName === 'Unknown' || heroName.trim() === '') {
        return 'abathur';
    }
    return heroName.toLowerCase().replace(/[^a-z0-9]/g, '-');
}

// Heroes list for autocomplete
const heroes = [
    "Abathur", "Alarak", "Alexstrasza", "Ana", "Anduin", "Anub'arak", "Artanis", "Arthas", "Auriel", "Azmodan",
    "Blaze", "Brightwing", "Cassia", "Chen", "Cho", "Chromie", "D.Va", "Deathwing", "Deckard", "Dehaka", "Diablo",
    "E.T.C.", "Falstad", "Fenix", "Gall", "Garrosh", "Gazlowe", "Genji", "Greymane", "Gul'dan", "Hanzo", "Hogger",
    "Illidan", "Imperius", "Jaina", "Johanna", "Junkrat", "Kael'thas", "Kel'Thuzad", "Kerrigan", "Kharazim",
    "Leoric", "Li Li", "Li-Ming", "Lt. Morales", "Lunara", "Lúcio", "Maiev", "Mal'Ganis", "Malfurion", "Malthael",
    "Medivh", "Mei", "Mephisto", "Muradin", "Murky", "Nazeebo", "Nova", "Orphea", "Probius", "Qhira", "Ragnaros",
    "Raynor", "Rehgar", "Rexxar", "Samuro", "Sgt. Hammer", "Sonya", "Stitches", "Stukov", "Sylvanas", "Tassadar",
    "The Butcher", "The Lost Vikings", "Thrall", "Tracer", "Tyrael", "Tyrande", "Tychus", "Uther", "Valeera", "Valla", 
    "Varian", "Whitemane", "Xul", "Yrel", "Zagara", "Zarya", "Zeratul", "Zul'jin"
];

// Hero role mapping for determining player preferences
const heroRoles = {
    // Assassins/Damage
    "Alarak": "Assassin", "Azmodan": "Assassin", "Cassia": "Assassin", "Chromie": "Assassin", "Falstad": "Assassin",
    "Fenix": "Assassin", "Genji": "Assassin", "Greymane": "Assassin", "Gul'dan": "Assassin", "Hanzo": "Assassin",
    "Illidan": "Assassin", "Jaina": "Assassin", "Junkrat": "Assassin", "Kael'thas": "Assassin", "Kel'Thuzad": "Assassin",
    "Kerrigan": "Assassin", "Li-Ming": "Assassin", "Lunara": "Assassin", "Maiev": "Assassin", "Malthael": "Assassin",
    "Mephisto": "Assassin", "Nazeebo": "Assassin", "Nova": "Assassin", "Orphea": "Assassin", "Probius": "Assassin",
    "Qhira": "Assassin", "Raynor": "Assassin", "Samuro": "Assassin", "Sylvanas": "Assassin", "Tassadar": "Assassin",
    "The Butcher": "Assassin", "Thrall": "Assassin", "Tracer": "Assassin", "Tychus": "Assassin", "Valeera": "Assassin",
    "Valla": "Assassin", "Zeratul": "Assassin", "Zul'jin": "Assassin", "Mei": "Assassin",
    
    // Tanks
    "Arthas": "Tank", "Anub'arak": "Tank", "Chen": "Tank", "Cho": "Tank", "Diablo": "Tank", "E.T.C.": "Tank",
    "Garrosh": "Tank", "Johanna": "Tank", "Mal'Ganis": "Tank", "Muradin": "Tank", "Stitches": "Tank", "Tyrael": "Tank",
    "Varian": "Tank", "Yrel": "Tank", "Imperius": "Tank", "Hogger": "Tank", "Deathwing": "Tank",
    
    // Bruisers/Offlane
    "Artanis": "Bruiser", "Blaze": "Bruiser", "D.Va": "Bruiser", "Dehaka": "Bruiser", "Gazlowe": "Bruiser",
    "Leoric": "Bruiser", "Malthael": "Bruiser", "Ragnaros": "Bruiser", "Rexxar": "Bruiser", "Sonya": "Bruiser",
    "Thrall": "Bruiser", "Xul": "Bruiser", "Zarya": "Bruiser",
    
    // Healers/Support
    "Alexstrasza": "Healer", "Ana": "Healer", "Anduin": "Healer", "Auriel": "Healer", "Brightwing": "Healer",
    "Deckard": "Healer", "Kharazim": "Healer", "Li Li": "Healer", "Lt. Morales": "Healer", "Lúcio": "Healer",
    "Malfurion": "Healer", "Rehgar": "Healer", "Stukov": "Healer", "Tyrande": "Healer", "Uther": "Healer",
    "Whitemane": "Healer",
    
    // Specialists/Unique
    "Abathur": "Specialist", "Medivh": "Specialist", "Murky": "Specialist", "Sgt. Hammer": "Specialist",
    "The Lost Vikings": "Specialist", "Zagara": "Specialist"
};

// Player data management
let playerData = {
    players: [],
    matchStats: {
        totalMatches: 0,
        wins: 0,
        losses: 0,
        lastMatchId: 0
    },
    playerStats: {}
};

// Load player data from localStorage
function loadPlayerData() {
    const saved = localStorage.getItem('hotsPlayerData');
    if (saved) {
        playerData = JSON.parse(saved);
    }
}

// Save player data to localStorage
function savePlayerData() {
    localStorage.setItem('hotsPlayerData', JSON.stringify(playerData));
}

// Add player to database if not exists
function addPlayerToDatabase(playerName) {
    if (!playerName || playerName.trim() === '') return;
    
    const trimmedName = playerName.trim();
    if (!playerData.players.includes(trimmedName)) {
        playerData.players.push(trimmedName);
        playerData.players.sort(); // Keep alphabetically sorted
        savePlayerData();
    }
}

// Update player statistics
function updatePlayerStats(playerName, hero, result) {
    if (!playerName || playerName.trim() === '') return;
    
    const key = playerName.trim();
    if (!playerData.playerStats[key]) {
        playerData.playerStats[key] = {
            totalMatches: 0,
            wins: 0,
            losses: 0,
            heroes: {},
            notes: ''
        };
    }
    
    playerData.playerStats[key].totalMatches++;
    playerData.playerStats[key][result]++;
    
    if (hero && hero.trim() !== '') {
        const heroKey = hero.trim();
        if (!playerData.playerStats[key].heroes[heroKey]) {
            playerData.playerStats[key].heroes[heroKey] = 0;
        }
        playerData.playerStats[key].heroes[heroKey]++;
    }
}

// Save player notes
function savePlayerNotes(playerName, notes) {
    if (!playerName || playerName.trim() === '') return;
    
    const key = playerName.trim();
    if (!playerData.playerStats[key]) {
        playerData.playerStats[key] = {
            totalMatches: 0,
            wins: 0,
            losses: 0,
            heroes: {},
            notes: ''
        };
    }
    
    playerData.playerStats[key].notes = notes.trim();
    savePlayerData();
}

// Get player notes
function getPlayerNotes(playerName) {
    if (!playerName || playerName.trim() === '') return '';
    
    const key = playerName.trim();
    return playerData.playerStats[key]?.notes || '';
}

// Get player role preferences based on their hero picks
function getPlayerRolePreferences(playerName) {
    if (!playerName || playerName.trim() === '') return {};
    
    const key = playerName.trim();
    const stats = playerData.playerStats[key];
    if (!stats || !stats.heroes) return {};
    
    const roleCounts = {};
    
    // Count matches for each role
    for (const [hero, count] of Object.entries(stats.heroes)) {
        const role = heroRoles[hero] || 'Unknown';
        roleCounts[role] = (roleCounts[role] || 0) + count;
    }
    
    // Sort roles by frequency
    const sortedRoles = Object.entries(roleCounts)
        .sort(([,a], [,b]) => b - a)
        .map(([role, count]) => ({
            role,
            count,
            percentage: Math.round((count / stats.totalMatches) * 100)
        }));
    
    return {
        totalMatches: stats.totalMatches,
        roles: sortedRoles,
        primaryRole: sortedRoles[0]?.role || 'Unknown'
    };
}

// Generate unique match ID
function generateMatchId() {
    playerData.matchStats.lastMatchId++;
    savePlayerData();
    return playerData.matchStats.lastMatchId;
}

// Helper function to process player data consistently
function processPlayerData(playerName, heroName) {
    return {
        player: playerName.trim() || 'Unknown',
        hero: heroName.trim() || 'Unknown'
    };
}

function handleScreenshots(event) {
    const files = Array.from(event.target.files);
    
    files.forEach(file => {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function(e) {
                currentScreenshots.push({
                    name: file.name,
                    data: e.target.result
                });
                updateScreenshotPreview();
            };
            reader.readAsDataURL(file);
        }
    });
}

function updateScreenshotPreview() {
    const preview = document.getElementById('screenshot-preview');
    preview.innerHTML = currentScreenshots.map((screenshot, index) => `
        <div class="screenshot-item">
            <img src="${screenshot.data}" alt="${screenshot.name}">
            <button class="remove-btn" onclick="removeScreenshot(${index})">&times;</button>
        </div>
    `).join('');
}

function removeScreenshot(index) {
    currentScreenshots.splice(index, 1);
    updateScreenshotPreview();
}

function toggleMatch(matchId) {
    const details = document.getElementById(`details-${matchId}`);
    const icon = document.getElementById(`icon-${matchId}`);
    
    if (details.classList.contains('expanded')) {
        details.classList.remove('expanded');
        icon.classList.remove('expanded');
    } else {
        details.classList.add('expanded');
        icon.classList.add('expanded');
    }
}

function editMatch(matchId) {
    editingMatchId = matchId;
    const match = matches.find(m => m.id === matchId);
    
    const editFormHTML = `
        <div class="edit-form" id="edit-form-${matchId}">
            <h4>Edit Match</h4>
            <div class="form-grid">
                <div class="form-group">
                    <label>Map</label>
                    <select id="edit-map-${matchId}">
                        <option value="">Select Map</option>
                        <option value="Alterac Pass" ${match.map === 'Alterac Pass' ? 'selected' : ''}>Alterac Pass</option>
                        <option value="Battlefield of Eternity" ${match.map === 'Battlefield of Eternity' ? 'selected' : ''}>Battlefield of Eternity</option>
                        <option value="Braxis Holdout" ${match.map === 'Braxis Holdout' ? 'selected' : ''}>Braxis Holdout</option>
                        <option value="Cursed Hollow" ${match.map === 'Cursed Hollow' ? 'selected' : ''}>Cursed Hollow</option>
                        <option value="Dragon Shire" ${match.map === 'Dragon Shire' ? 'selected' : ''}>Dragon Shire</option>
                        <option value="Garden of Terror" ${match.map === 'Garden of Terror' ? 'selected' : ''}>Garden of Terror</option>
                        <option value="Hanamura Temple" ${match.map === 'Hanamura Temple' ? 'selected' : ''}>Hanamura Temple</option>
                        <option value="Infernal Shrines" ${match.map === 'Infernal Shrines' ? 'selected' : ''}>Infernal Shrines</option>
                        <option value="Sky Temple" ${match.map === 'Sky Temple' ? 'selected' : ''}>Sky Temple</option>
                        <option value="Tomb of the Spider Queen" ${match.map === 'Tomb of the Spider Queen' ? 'selected' : ''}>Tomb of the Spider Queen</option>
                        <option value="Towers of Doom" ${match.map === 'Towers of Doom' ? 'selected' : ''}>Towers of Doom</option>
                        <option value="Volskaya Foundry" ${match.map === 'Volskaya Foundry' ? 'selected' : ''}>Volskaya Foundry</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Result</label>
                    <select id="edit-result-${matchId}">
                        <option value="win" ${match.result === 'win' ? 'selected' : ''}>Victory</option>
                        <option value="loss" ${match.result === 'loss' ? 'selected' : ''}>Defeat</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Date & Time</label>
                    <input type="datetime-local" id="edit-timestamp-${matchId}" value="${match.timestamp}">
                </div>
            </div>
            <div class="notes-section">
                <h4>Match Notes</h4>
                <textarea id="edit-notes-${matchId}" placeholder="Add notes about this match..." rows="4">${match.notes || ''}</textarea>
            </div>
            <div class="teams-display">
                <div class="team-display ally">
                    <h4>Allied Team (5 players max)</h4>
                    <div id="edit-ally-${matchId}">
                        ${Array.from({length: 5}, (_, i) => `
                            <div class="player-row">
                                <div class="autocomplete-wrapper">
                                    <input type="text" placeholder="Player ${i + 1}" value="${match.allyTeam[i] ? match.allyTeam[i].player : ''}" class="edit-ally-player">
                                    <div class="autocomplete-dropdown"></div>
                                </div>
                                <div class="autocomplete-wrapper">
                                    <input type="text" placeholder="Hero" value="${match.allyTeam[i] ? match.allyTeam[i].hero : ''}" class="edit-ally-hero autocomplete-input">
                                    <div class="autocomplete-dropdown"></div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                <div class="team-display enemy">
                    <h4>Enemy Team (5 players max)</h4>
                    <div id="edit-enemy-${matchId}">
                        ${Array.from({length: 5}, (_, i) => `
                            <div class="player-row">
                                <div class="autocomplete-wrapper">
                                    <input type="text" placeholder="Enemy ${i + 1}" value="${match.enemyTeam[i] ? match.enemyTeam[i].player : ''}" class="edit-enemy-player">
                                    <div class="autocomplete-dropdown"></div>
                                </div>
                                <div class="autocomplete-wrapper">
                                    <input type="text" placeholder="Hero" value="${match.enemyTeam[i] ? match.enemyTeam[i].hero : ''}" class="edit-enemy-hero autocomplete-input">
                                    <div class="autocomplete-dropdown"></div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
            <div class="edit-screenshots-section" style="margin-top: 15px;">
                <h5>Edit Screenshots</h5>
                <input type="file" id="edit-screenshot-input-${matchId}" multiple accept="image/*" onchange="handleEditScreenshots(event, ${matchId})">
                <div id="edit-screenshot-preview-${matchId}" class="screenshot-preview">
                    ${(match.screenshots || []).map((screenshot, index) => `
                        <div class="screenshot-item">
                            <img src="${screenshot.data}" alt="${screenshot.name}">
                            <button class="remove-btn" onclick="removeEditScreenshot(${matchId}, ${index})">&times;</button>
                        </div>
                    `).join('')}
                </div>
            </div>
            <div style="margin-top: 15px;">
                <button class="save-btn" onclick="saveMatch(${matchId})">Save Changes</button>
                <button class="cancel-btn" onclick="cancelEdit(${matchId})">Cancel</button>
            </div>
        </div>
    `;
    
    // Insert edit form after the match details
    const detailsDiv = document.getElementById(`details-${matchId}`);
    detailsDiv.insertAdjacentHTML('afterend', editFormHTML);
    
    // Setup autocomplete for the edit form
    setupAutocomplete();
    
    // Hide edit/delete buttons
    const buttons = document.querySelector(`#match-${matchId} .match-header > div:last-child`);
    buttons.style.display = 'none';
}

function saveMatch(matchId) {
    const map = document.getElementById(`edit-map-${matchId}`).value;
    const result = document.getElementById(`edit-result-${matchId}`).value;
    const timestamp = document.getElementById(`edit-timestamp-${matchId}`).value;
    const notes = document.getElementById(`edit-notes-${matchId}`).value.trim();

    if (!map || !result || !timestamp) {
        alert('Please fill in all required fields');
        return;
    }

    // Get ally players
    const allyPlayers = [];
    const allyPlayerInputs = document.querySelectorAll(`#edit-ally-${matchId} .edit-ally-player`);
    const allyHeroInputs = document.querySelectorAll(`#edit-ally-${matchId} .edit-ally-hero`);
    for (let i = 0; i < allyPlayerInputs.length; i++) {
        const playerName = allyPlayerInputs[i].value.trim();
        const heroName = allyHeroInputs[i].value.trim();
        if (playerName || heroName) {
            allyPlayers.push(processPlayerData(playerName, heroName));
        }
    }

    // Get enemy players
    const enemyPlayers = [];
    const enemyPlayerInputs = document.querySelectorAll(`#edit-enemy-${matchId} .edit-enemy-player`);
    const enemyHeroInputs = document.querySelectorAll(`#edit-enemy-${matchId} .edit-enemy-hero`);
    for (let i = 0; i < enemyPlayerInputs.length; i++) {
        const playerName = enemyPlayerInputs[i].value.trim();
        const heroName = enemyHeroInputs[i].value.trim();
        if (playerName || heroName) {
            enemyPlayers.push(processPlayerData(playerName, heroName));
        }
    }

    // Update the match
    const matchIndex = matches.findIndex(m => m.id === matchId);
    const oldMatch = matches[matchIndex];
    
    // Clean up old player data first
    cleanupMatchPlayerData(oldMatch, oldMatch.result);
    
    // Update global match statistics if result changed
    if (oldMatch.result !== result) {
        playerData.matchStats[oldMatch.result]--;
        playerData.matchStats[result]++;
    }
    
    // Add new player data
    allyPlayers.forEach(player => {
        if (player.player && player.player !== 'Unknown') {
            addPlayerToDatabase(player.player);
            updatePlayerStats(player.player, player.hero, result);
        }
    });
    
    enemyPlayers.forEach(player => {
        if (player.player && player.player !== 'Unknown') {
            addPlayerToDatabase(player.player);
        }
    });
    
    // Update screenshots if they were edited
    let updatedScreenshots = oldMatch.screenshots || [];
    if (oldMatch.editScreenshots) {
        updatedScreenshots = [...oldMatch.editScreenshots];
        delete oldMatch.editScreenshots;
    }
    
    matches[matchIndex] = {
        ...matches[matchIndex],
        map: map,
        result: result,
        timestamp: timestamp,
        notes: notes,
        allyTeam: allyPlayers,
        enemyTeam: enemyPlayers,
        screenshots: updatedScreenshots
    };

    localStorage.setItem('hotsMatches', JSON.stringify(matches));
    editingMatchId = null;
    displayMatches();
}

function cancelEdit(matchId) {
    const editForm = document.getElementById(`edit-form-${matchId}`);
    editForm.remove();
    
    // Clean up temporary screenshot data
    const match = matches.find(m => m.id === matchId);
    if (match && match.editScreenshots) {
        delete match.editScreenshots;
    }
    
    // Show edit/delete buttons again
    const buttons = document.querySelector(`#match-${matchId} .match-header > div:last-child`);
    buttons.style.display = 'flex';
    
    editingMatchId = null;
}

function addMatch() {
    const map = document.getElementById('map').value;
    const result = document.getElementById('result').value;
    const timestamp = document.getElementById('timestamp').value;
    const notes = document.getElementById('match-notes').value.trim();

    if (!map || !result || !timestamp) {
        alert('Please fill in all required fields (Map, Result, Date & Time)');
        return;
    }

    const allyPlayers = [];
    const enemyPlayers = [];

    // Get ally players and add to database
    const allyPlayerInputs = document.querySelectorAll('.ally-player');
    const allyHeroInputs = document.querySelectorAll('.ally-hero');
    for (let i = 0; i < allyPlayerInputs.length; i++) {
        const playerName = allyPlayerInputs[i].value.trim();
        const heroName = allyHeroInputs[i].value.trim();
        if (playerName || heroName) {
            const playerData = processPlayerData(playerName, heroName);
            allyPlayers.push(playerData);
            
            // Add player to database and update stats
            if (playerData.player !== 'Unknown') {
                addPlayerToDatabase(playerData.player);
                updatePlayerStats(playerData.player, playerData.hero, result);
            }
        }
    }

    // Get enemy players and add to database
    const enemyPlayerInputs = document.querySelectorAll('.enemy-player');
    const enemyHeroInputs = document.querySelectorAll('.enemy-hero');
    for (let i = 0; i < enemyPlayerInputs.length; i++) {
        const playerName = enemyPlayerInputs[i].value.trim();
        const heroName = enemyHeroInputs[i].value.trim();
        if (playerName || heroName) {
            const playerData = processPlayerData(playerName, heroName);
            enemyPlayers.push(playerData);
            
            // Add enemy player to database (for autocomplete purposes)
            if (playerData.player !== 'Unknown') {
                addPlayerToDatabase(playerData.player);
            }
        }
    }

    // Update match statistics
    playerData.matchStats.totalMatches++;
    playerData.matchStats[result]++;

    const match = {
        id: generateMatchId(),
        map: map,
        result: result,
        timestamp: timestamp,
        notes: notes,
        allyTeam: allyPlayers,
        enemyTeam: enemyPlayers,
        screenshots: [...currentScreenshots]
    };

    matches.unshift(match);
    localStorage.setItem('hotsMatches', JSON.stringify(matches));
    
    // Clear the form
    clearForm();
    
    // Reset to first page and refresh display
    currentPage = 1;
    displayMatches();
}

function clearForm() {
    document.getElementById('map').value = '';
    document.getElementById('result').value = '';
    document.getElementById('match-notes').value = '';
    document.getElementById('screenshot-input').value = '';
    
    document.querySelectorAll('.ally-player, .ally-hero, .enemy-player, .enemy-hero').forEach(input => {
        input.value = '';
    });

    currentScreenshots = [];
    updateScreenshotPreview();
    
    // Auto-fill timestamp with current time
    setCurrentTime();
}

function deleteMatch(matchId) {
    if (confirm('Are you sure you want to delete this match?')) {
        const matchToDelete = matches.find(match => match.id === matchId);
        
        // Update global match statistics
        playerData.matchStats.totalMatches--;
        playerData.matchStats[matchToDelete.result]--;
        
        // Clean up player data before removing the match
        cleanupMatchPlayerData(matchToDelete, matchToDelete.result);
        
        // Remove the match
        matches = matches.filter(match => match.id !== matchId);
        localStorage.setItem('hotsMatches', JSON.stringify(matches));
        
        // Adjust current page if necessary
        const totalPages = Math.ceil(matches.length / matchesPerPage);
        if (currentPage > totalPages && totalPages > 0) {
            currentPage = totalPages;
        }
        
        displayMatches();
    }
}

// Remove player statistics when a match is deleted
function removePlayerStats(playerName, hero, result) {
    if (!playerName || playerName.trim() === '' || playerName === 'Unknown') return;
    
    const key = playerName.trim();
    if (!playerData.playerStats[key]) return;
    
    // Decrease match count and result count
    playerData.playerStats[key].totalMatches--;
    playerData.playerStats[key][result]--;
    
    // Decrease hero count if hero exists
    if (hero && hero.trim() !== '' && hero !== 'Unknown') {
        const heroKey = hero.trim();
        if (playerData.playerStats[key].heroes[heroKey]) {
            playerData.playerStats[key].heroes[heroKey]--;
            
            // Remove hero entry if count reaches 0
            if (playerData.playerStats[key].heroes[heroKey] <= 0) {
                delete playerData.playerStats[key].heroes[heroKey];
            }
        }
    }
    
    // Remove player entirely if no matches left
    if (playerData.playerStats[key].totalMatches <= 0) {
        delete playerData.playerStats[key];
        
        // Remove from players list
        const playerIndex = playerData.players.indexOf(key);
        if (playerIndex > -1) {
            playerData.players.splice(playerIndex, 1);
        }
    }
}

// Clean up all player data for a specific match
function cleanupMatchPlayerData(match, result) {
    // Clean up ally team data
    match.allyTeam.forEach(player => {
        removePlayerStats(player.player, player.hero, result);
    });
    
    // Clean up enemy team data (they don't have win/loss stats with us, but they exist in the database)
    match.enemyTeam.forEach(player => {
        // Check if this enemy player appears in any other matches
        const playerStillExists = matches.some(otherMatch => 
            otherMatch.id !== match.id && (
                otherMatch.allyTeam.some(ally => ally.player === player.player) ||
                otherMatch.enemyTeam.some(enemy => enemy.player === player.player)
            )
        );
        
        // If they don't appear in any other matches, remove them from players list
        if (!playerStillExists && player.player !== 'Unknown') {
            const playerIndex = playerData.players.indexOf(player.player);
            if (playerIndex > -1) {
                playerData.players.splice(playerIndex, 1);
            }
        }
    });
    
    savePlayerData();
}

// Rebuild player database from existing matches (for data consistency)
function rebuildPlayerDatabase() {
    // Reset player data
    playerData.players = [];
    playerData.playerStats = {};
    
    // Rebuild from all existing matches
    matches.forEach(match => {
        // Process ally team
        match.allyTeam.forEach(player => {
            if (player.player && player.player !== 'Unknown') {
                addPlayerToDatabase(player.player);
                updatePlayerStats(player.player, player.hero, match.result);
            }
        });
        
        // Process enemy team (for autocomplete, but no win/loss stats)
        match.enemyTeam.forEach(player => {
            if (player.player && player.player !== 'Unknown') {
                addPlayerToDatabase(player.player);
            }
        });
    });
    
    savePlayerData();
}

// Debug functions (can be called from console)
window.rebuildDatabase = () => {
    rebuildPlayerDatabase();
    setupAutocomplete();
    console.log('Database rebuilt:', playerData.players.length, 'players');
};

window.showPlayerData = () => {
    console.log('Players:', playerData.players.length, 'Stats:', Object.keys(playerData.playerStats).length);
    return playerData;
};

function displayMatches() {
    const container = document.getElementById('matches-container');
    const infoElement = document.getElementById('matches-info');
    
    if (matches.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #666; font-style: italic;">No matches recorded yet. Add your first match above!</p>';
        infoElement.innerHTML = '';
        document.getElementById('pagination').innerHTML = '';
        return;
    }

    // Calculate pagination
    const totalPages = Math.ceil(matches.length / matchesPerPage);
    const startIndex = (currentPage - 1) * matchesPerPage;
    const endIndex = startIndex + matchesPerPage;
    const currentMatches = matches.slice(startIndex, endIndex);

    // Update info display
    infoElement.innerHTML = `Showing ${startIndex + 1}-${Math.min(endIndex, matches.length)} of ${matches.length} matches`;

    // Display current page matches
    container.innerHTML = currentMatches.map(match => {
        const thumbnail = match.screenshots && match.screenshots.length > 0 
            ? `<img src="${match.screenshots[0].data}" alt="Match thumbnail" class="match-thumbnail">`
            : '';
            
        return `
        <div class="match-card compact" id="match-${match.id}">
            <div class="match-summary" onclick="toggleMatch(${match.id})">
                <div class="match-header">
                    <div style="display: flex; align-items: center; gap: 10px;">
                        ${thumbnail}
                        <div>
                            <span class="expand-icon" id="icon-${match.id}">▶</span>
                            <strong>${match.map}</strong> - 
                            <span style="color: #666;">${new Date(match.timestamp).toLocaleString()}</span>
                            <span class="match-result ${match.result}" style="margin-left: 10px;">${match.result}</span>
                        </div>
                    </div>
                    <div style="display: flex; gap: 10px; align-items: center;" onclick="event.stopPropagation()">
                        <button class="edit-btn" onclick="editMatch(${match.id})">Edit</button>
                        <button class="delete-btn" onclick="deleteMatch(${match.id})">Delete</button>
                    </div>
                </div>
            </div>
            <div class="match-details" id="details-${match.id}">
                <div class="teams-display">
                    <div class="team-display ally">
                        <h4>Allied Team</h4>
                        ${match.allyTeam.map(player => `
                            <div class="player-display">
                                <strong>${player.player}</strong> - ${player.hero}
                            </div>
                        `).join('')}
                    </div>
                    <div class="team-display enemy">
                        <h4>Enemy Team</h4>
                        ${match.enemyTeam.map(player => `
                            <div class="player-display">
                                <strong>${player.player}</strong> - ${player.hero}
                            </div>
                        `).join('')}
                    </div>
                </div>
                ${match.notes && match.notes.trim() !== '' ? `
                    <div class="match-notes-display">
                        <h5>Notes</h5>
                        <div class="notes-content">${match.notes.replace(/\n/g, '<br>')}</div>
                    </div>
                ` : ''}
                ${match.screenshots && match.screenshots.length > 0 ? `
                    <div class="match-screenshots">
                        <h5>Screenshots (${match.screenshots.length})</h5>
                        <div class="match-screenshot-grid">
                            ${match.screenshots.map((screenshot, index) => `
                                <div class="match-screenshot-item" onclick="openModal('${screenshot.data}')">
                                    <img src="${screenshot.data}" alt="${screenshot.name}">
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
            </div>
        </div>
        `;
    }).join('');

    // Update pagination
    updatePagination(totalPages);
}

function updatePagination(totalPages) {
    const paginationElement = document.getElementById('pagination');
    
    if (totalPages <= 1) {
        paginationElement.innerHTML = '';
        return;
    }

    let paginationHTML = '';

    // Previous button
    paginationHTML += `<button ${currentPage === 1 ? 'disabled' : ''} onclick="changePage(${currentPage - 1})">Previous</button>`;

    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        if (i === currentPage) {
            paginationHTML += `<button class="current-page">${i}</button>`;
        } else if (i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
            paginationHTML += `<button onclick="changePage(${i})">${i}</button>`;
        } else if (i === currentPage - 3 || i === currentPage + 3) {
            paginationHTML += `<span>...</span>`;
        }
    }

    // Next button
    paginationHTML += `<button ${currentPage === totalPages ? 'disabled' : ''} onclick="changePage(${currentPage + 1})">Next</button>`;

    paginationElement.innerHTML = paginationHTML;
}

function changePage(page) {
    const totalPages = Math.ceil(matches.length / matchesPerPage);
    if (page >= 1 && page <= totalPages) {
        currentPage = page;
        displayMatches();
    }
}

function openModal(imageSrc) {
    const modal = document.getElementById('screenshot-modal');
    const modalImage = document.getElementById('modal-image');
    modal.style.display = 'block';
    modalImage.src = imageSrc;
}

function closeModal() {
    document.getElementById('screenshot-modal').style.display = 'none';
}

// Set current time as default
function setCurrentTime() {
    const timestampElement = document.getElementById('timestamp');
    if (timestampElement) {
        const now = new Date();
        const localDateTime = now.getFullYear() + '-' +
            String(now.getMonth() + 1).padStart(2, '0') + '-' +
            String(now.getDate()).padStart(2, '0') + 'T' +
            String(now.getHours()).padStart(2, '0') + ':' +
            String(now.getMinutes()).padStart(2, '0');
        timestampElement.value = localDateTime;
    }
}

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    try {
        loadPlayerData();
        myPlayerName = localStorage.getItem('myPlayerName') || '';
        
        // Check if player database needs rebuilding (for data consistency)
        const hasPlayerData = playerData.players.length > 0 || Object.keys(playerData.playerStats).length > 0;
        const hasMatches = matches.length > 0;
        
        if (hasMatches && !hasPlayerData) {
            rebuildPlayerDatabase();
        }
        
        // Check if we're on the main page or profile page
        const isMainPage = document.getElementById('timestamp') !== null;
        const isProfilePage = document.getElementById('profile-player-name') !== null;
        
        if (isMainPage) {
            setCurrentTime();
            displayMatches();
            setupAutocomplete();
            updatePlayerProfile();
        }
        
        if (isProfilePage) {
            // Profile page initialization handled by profile page's own script
        }
        
    } catch (error) {
        console.error('Error during page initialization:', error);
    }
});

function handleEditScreenshots(event, matchId) {
    const files = Array.from(event.target.files);
    const match = matches.find(m => m.id === matchId);
    
    if (!match.editScreenshots) {
        match.editScreenshots = [...(match.screenshots || [])];
    }
    
    files.forEach(file => {
        if (file.size > MAX_FILE_SIZE) {
            alert(`File ${file.name} is too large. Maximum size is 5MB.`);
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            match.editScreenshots.push({
                name: file.name,
                data: e.target.result
            });
            updateEditScreenshotPreview(matchId);
        };
        reader.readAsDataURL(file);
    });
}

function removeEditScreenshot(matchId, index) {
    const match = matches.find(m => m.id === matchId);
    if (match.editScreenshots) {
        match.editScreenshots.splice(index, 1);
        updateEditScreenshotPreview(matchId);
    }
}

function updateEditScreenshotPreview(matchId) {
    const match = matches.find(m => m.id === matchId);
    const previewDiv = document.getElementById(`edit-screenshot-preview-${matchId}`);
    
    if (match.editScreenshots) {
        previewDiv.innerHTML = match.editScreenshots.map((screenshot, index) => `
            <div class="screenshot-item">
                <img src="${screenshot.data}" alt="${screenshot.name}">
                <button class="remove-btn" onclick="removeEditScreenshot(${matchId}, ${index})">&times;</button>
            </div>
        `).join('');
    }
}

// Autocomplete functionality
function setupAutocomplete() {
    const autocompleteInputs = document.querySelectorAll('.autocomplete-input');
    const playerInputs = document.querySelectorAll('.ally-player, .enemy-player, .edit-ally-player, .edit-enemy-player');
    const myPlayerNameInput = document.getElementById('my-player-name');
    
    // Setup hero autocomplete
    autocompleteInputs.forEach(input => {
        setupAutocompleteForInput(input, heroes, 'hero');
    });
    
    // Setup player autocomplete
    playerInputs.forEach(input => {
        setupAutocompleteForInput(input, playerData.players, 'player');
    });
    
    // Setup autocomplete for myPlayerName input
    if (myPlayerNameInput) {
        setupAutocompleteForInput(myPlayerNameInput, playerData.players, 'player');
    }
}

function setupAutocompleteForInput(input, dataSource, type) {
    // Create dropdown if it doesn't exist
    let dropdown = input.parentElement.querySelector('.autocomplete-dropdown');
    if (!dropdown) {
        dropdown = document.createElement('div');
        dropdown.className = 'autocomplete-dropdown';
        input.parentElement.style.position = 'relative';
        input.parentElement.appendChild(dropdown);
    }
    
    let highlightedIndex = -1;
    
    input.addEventListener('input', function() {
        const value = this.value.toLowerCase();
        dropdown.innerHTML = '';
        highlightedIndex = -1;
        
        if (value.length === 0) {
            dropdown.classList.remove('show');
            return;
        }
        
        // Separate matches that start with the input vs those that contain it
        const startsWithMatches = dataSource.filter(item => 
            item.toLowerCase().startsWith(value)
        );
        
        const containsMatches = dataSource.filter(item => 
            item.toLowerCase().includes(value) && !item.toLowerCase().startsWith(value)
        );
        
        // Combine results: starts-with first, then contains, both alphabetically sorted
        const sortedStartsWith = startsWithMatches.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
        const sortedContains = containsMatches.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
        const matches = [...sortedStartsWith, ...sortedContains].slice(0, 8); // Limit to 8 results
        
        if (matches.length > 0) {
            matches.forEach((item, index) => {
                const itemElement = document.createElement('div');
                itemElement.className = 'autocomplete-item';
                itemElement.textContent = item;
                itemElement.addEventListener('click', function() {
                    input.value = item;
                    dropdown.classList.remove('show');
                });
                dropdown.appendChild(itemElement);
            });
            dropdown.classList.add('show');
            
            // Automatically highlight the first item
            highlightedIndex = 0;
            updateHighlight(dropdown.querySelectorAll('.autocomplete-item'), highlightedIndex);
        } else {
            dropdown.classList.remove('show');
        }
    });
    
    input.addEventListener('keydown', function(e) {
        const items = dropdown.querySelectorAll('.autocomplete-item');
        
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (highlightedIndex < items.length - 1) {
                highlightedIndex = highlightedIndex + 1;
            } else {
                highlightedIndex = 0; // Wrap to first item
            }
            updateHighlight(items, highlightedIndex);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (highlightedIndex > 0) {
                highlightedIndex = highlightedIndex - 1;
            } else {
                highlightedIndex = items.length - 1; // Wrap to last item
            }
            updateHighlight(items, highlightedIndex);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (items.length > 0) {
                // If no specific item is highlighted or first item is highlighted, use the first item
                const targetIndex = highlightedIndex >= 0 ? highlightedIndex : 0;
                if (items[targetIndex]) {
                    input.value = items[targetIndex].textContent;
                    dropdown.classList.remove('show');
                    highlightedIndex = -1;
                }
            }
        } else if (e.key === 'Escape') {
            dropdown.classList.remove('show');
            highlightedIndex = -1;
        }
    });
    
    input.addEventListener('blur', function() {
        // Delay hiding to allow click events on dropdown items
        setTimeout(() => {
            dropdown.classList.remove('show');
            highlightedIndex = -1;
        }, 150);
    });
}

function updateHighlight(items, index) {
    items.forEach((item, i) => {
        item.classList.toggle('highlighted', i === index);
    });
}

// Close dropdowns when clicking outside
document.addEventListener('click', function(e) {
    // Close autocomplete dropdowns when clicking outside
    if (!e.target.closest('.autocomplete-wrapper')) {
        document.querySelectorAll('.autocomplete-dropdown').forEach(dropdown => {
            dropdown.classList.remove('show');
        });
    }
    
    // Close modal when clicking outside the image
    const modal = document.getElementById('screenshot-modal');
    if (e.target === modal) {
        closeModal();
    }
});
function setMyPlayerName() {
    const input = document.getElementById('my-player-name');
    const name = input.value.trim();
    
    if (!name) {
        alert('Please enter a player name');
        return;
    }
    
    myPlayerName = name;
    localStorage.setItem('myPlayerName', myPlayerName);
    updatePlayerProfile();
}

function changePlayerName() {
    const profileSetup = document.getElementById('profile-setup');
    const myProfile = document.getElementById('my-profile');
    const input = document.getElementById('my-player-name');
    
    if (profileSetup) profileSetup.style.display = 'block';
    if (myProfile) myProfile.style.display = 'none';
    if (input) {
        input.value = myPlayerName;
        input.focus();
    }
}

function viewFullProfile() {
    // This function can open profile.html or show detailed stats
    // For now, let's redirect to the profile page
    window.open('profile.html', '_blank');
}

function updatePlayerProfile() {
    const profileSetup = document.getElementById('profile-setup');
    const myProfile = document.getElementById('my-profile');
    const playerNameSpan = document.getElementById('my-display-name');
    
    if (!myPlayerName) {
        if (profileSetup) profileSetup.style.display = 'block';
        if (myProfile) myProfile.style.display = 'none';
        return;
    }
    
    if (profileSetup) profileSetup.style.display = 'none';
    if (myProfile) myProfile.style.display = 'block';
    if (playerNameSpan) playerNameSpan.textContent = myPlayerName;
    
    // Calculate statistics for my player
    const myStats = calculatePlayerStats(myPlayerName);
    
    // Update profile statistics
    const totalMatchesEl = document.getElementById('my-total-matches');
    const winRateEl = document.getElementById('my-win-rate');
    const mostPlayedEl = document.getElementById('my-most-played-hero');
    
    if (totalMatchesEl) totalMatchesEl.textContent = myStats.totalMatches;
    
    const winRate = myStats.totalMatches > 0 ? ((myStats.wins / myStats.totalMatches) * 100).toFixed(1) : '0.0';
    if (winRateEl) winRateEl.textContent = `${winRate}% (${myStats.wins}-${myStats.losses})`;
    
    // Update most played hero
    const topHero = Object.entries(myStats.heroes)
        .filter(([hero]) => hero !== 'Unknown')
        .sort(([,a], [,b]) => b - a)[0];
    
    if (mostPlayedEl) {
        mostPlayedEl.textContent = topHero ? `${topHero[0]} (${topHero[1]})` : 'None';
    }
    
    // Update hero icon
    const heroIcon = document.getElementById('my-hero-icon');
    if (heroIcon && topHero) {
        const heroImage = `images/${getHeroImageName(topHero[0])}.jpg`;
        heroIcon.src = heroImage;
        heroIcon.style.display = 'block';
        heroIcon.onerror = function() { this.src = 'images/abathur.jpg'; };
    } else if (heroIcon) {
        heroIcon.style.display = 'none';
    }
}

function calculatePlayerStats(playerName) {
    const stats = {
        totalMatches: 0,
        wins: 0,
        losses: 0,
        heroes: {}
    };
    
    matches.forEach(match => {
        const playerInMatch = match.allyTeam.find(ally => ally.player === playerName);
        if (playerInMatch) {
            stats.totalMatches++;
            if (match.result === 'win') {
                stats.wins++;
            } else if (match.result === 'loss') {
                stats.losses++;
            }
            
            const hero = playerInMatch.hero || 'Unknown';
            stats.heroes[hero] = (stats.heroes[hero] || 0) + 1;
        }
    });
    
    return stats;
}

// Export function for transferring data to profile page (for local file testing)
function exportData() {
    const data = {
        matches: matches,
        playerData: playerData,
        myPlayerName: myPlayerName
    };
    
    console.log('=== Data Export for Profile Page ===');
    console.log('Copy this JSON and use importData() on profile page:');
    console.log(JSON.stringify(data));
    console.log('=====================================');
    return data;
}

// Make export function globally available
window.exportData = exportData;
