const playerLists = JSON.parse(localStorage.getItem('playerLists')) || {};
let currentList = 'default';
let editPlayerIndex = null;
let editMatchIndex = null;
let currentPage = 1;
const playersPerPage = 7;
let filteredPlayers = [];

if (!playerLists['default']) {
  playerLists['default'] = [];
  localStorage.setItem('playerLists', JSON.stringify(playerLists));
}

document.getElementById('list-selector').addEventListener('change', (e) => {
  currentList = e.target.value;
  currentPage = 1;
  filterPlayers();
});

document.getElementById('create-list-button').addEventListener('click', showCreateListToast);
document.getElementById('delete-list-button').addEventListener('click', showDeleteListToast);
document.getElementById('search-bar').addEventListener('input', filterPlayers);

function showCreateListToast() {
  showToast('Enter new list name:', (inputValue) => {
    if (inputValue && !playerLists[inputValue]) {
      playerLists[inputValue] = [];
      localStorage.setItem('playerLists', JSON.stringify(playerLists));
      updateListSelector();
    }
  }, true);
}

function showDeleteListToast() {
  if (currentList !== 'default') {
    showToast('Are you sure you want to delete this list?', () => {
      delete playerLists[currentList];
      currentList = 'default';
      localStorage.setItem('playerLists', JSON.stringify(playerLists));
      updateListSelector();
      filterPlayers();
    });
  } else {
    showToast('The default list cannot be deleted.');
  }
}

function showToast(message, onConfirm, isInput = false) {
  const toastContainer = document.getElementById('toast-container');
  toastContainer.innerHTML = ''; // Clear any existing toasts

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <span>${message}</span>
    <div>
      ${isInput ? '<input type="text" id="toast-input" />' : ''}
      <button class="toast-confirm">Yes</button>
      <button class="toast-cancel">No</button>
    </div>
  `;
  toastContainer.appendChild(toast);

  toast.querySelector('.toast-confirm').addEventListener('click', () => {
    const inputValue = isInput ? document.getElementById('toast-input').value.trim() : null;
    toastContainer.removeChild(toast);
    if (onConfirm) {
      onConfirm(inputValue);
    }
  });

  toast.querySelector('.toast-cancel').addEventListener('click', () => {
    toastContainer.removeChild(toast);
  });
}

const heroCategories = {
  'Tank': ['Anub\'arak', 'Arthas', 'Blaze', 'Cho', 'Diablo', 'E.T.C.', 'Garrosh', 'Johanna', 'Mal\'Ganis', 'Mei', 'Muradin', 'Stitches', 'Tyrael', 'Varian'],
  'Bruiser': ['Artanis', 'Chen', 'D.Va', 'Dehaka', 'Deathwing', 'Gazlowe', 'Hogger', 'Imperius', 'Leoric', 'Malthael', 'Ragnaros', 'Rexxar', 'Sonya', 'Thrall', 'Varian', 'Xul', 'Yrel'],
  'Ranged Assassin': ['Azmodan', 'Cassia', 'Chromie', 'Falstad', 'Fenix', 'Gall', 'Genji', 'Greymane', 'Gul\'dan', 'Hanzo', 'Jaina', 'Junkrat', 'Kael\'thas', 'Kel\'Thuzad', 'Li-Ming', 'Lunara', 'Mephisto', 'Nazeebo', 'Nova', 'Orphea', 'Probius', 'Raynor', 'Sgt. Hammer', 'Sylvanas', 'Tassadar', 'Tracer', 'Tychus', 'Valla', 'Zagara', 'Zul\'jin'],
  'Melee Assassin': ['Alarak', 'Illidan', 'Kerrigan', 'Maiev', 'Murky', 'Qhira', 'Samuro', 'The Butcher', 'Valeera', 'Varian', 'Zeratul'],
  'Healer': ['Alexstrasza', 'Ana', 'Anduin', 'Auriel', 'Brightwing', 'Deckard', 'Kharazim', 'Li Li', 'Lt. Morales', 'Lúcio', 'Malfurion', 'Rehgar', 'Stukov', 'Tyrande', 'Uther', 'Whitemane'],
  'Support': ['Abathur', 'Medivh', 'The Lost Vikings', 'Zarya']
};


function selectHeroCategory(category) {
  const heroSelect = document.getElementById('player-hero');
  heroSelect.innerHTML = '<option value="">Select Hero</option>'; // Clear existing options
  heroCategories[category].forEach(hero => {
    const option = document.createElement('option');
    option.value = hero;
    option.textContent = hero;
    heroSelect.appendChild(option);
  });
}

document.getElementById('add-player-form').addEventListener('submit', (e) => {
  e.preventDefault();

  const name = document.getElementById('player-name').value.trim();
  const hero = document.getElementById('player-hero').value.trim();
  const map = document.getElementById('match-map').value.trim();
  const outcome = document.getElementById('match-outcome').value.trim();
  const matchId = document.getElementById('match-id').value.trim();
  const team = document.getElementById('team').value.trim();
  const matchImage = document.getElementById('match-image').value.trim();
  const notes = document.getElementById('player-notes').value.trim();

  if (!name) {
    alert('Please fill out all required fields.');
    return;
  }

  let player = playerLists[currentList].find(p => p.name === name);
  if (!player) {
    player = { name, matches: [], wins: 0, losses: 0, notes: '' };
    playerLists[currentList].push(player);
  }

  if (editPlayerIndex !== null && editMatchIndex !== null) {
    const oldOutcome = player.matches[editMatchIndex].outcome;
    player.matches[editMatchIndex] = { hero, map, outcome, id: matchId, team, image: matchImage };

    if (oldOutcome === 'Win') player.wins--;
    if (oldOutcome === 'Loss') player.losses--;

    if (outcome === 'Win') player.wins++;
    if (outcome === 'Loss') player.losses++;

    player.notes = notes || player.notes;
    editPlayerIndex = null;
    editMatchIndex = null;
  } else {
    player.matches.push({ hero, map, outcome, id: matchId, team, image: matchImage });
    if (outcome === 'Win') player.wins++;
    if (outcome === 'Loss') player.losses++;
    player.notes = notes || player.notes;
  }

  localStorage.setItem('playerLists', JSON.stringify(playerLists));
  filterPlayers();
  openPlayerStats(player); // Ensure iframe updates after changes
  e.target.reset();
});

function filterPlayers() {
  const searchTerm = document.getElementById('search-bar').value.toLowerCase();
  const players = playerLists[currentList] || [];
  filteredPlayers = players.filter(player => player.name.toLowerCase().includes(searchTerm));
  renderPlayerList();
}

function renderPlayerList() {
  const playerList = document.getElementById('player-list');
  if (!playerList) return; // Ensure playerList exists

  playerList.innerHTML = '';

  const totalPages = Math.ceil(filteredPlayers.length / playersPerPage);
  const startIndex = (currentPage - 1) * playersPerPage;
  const endIndex = startIndex + playersPerPage;
  const playersToShow = filteredPlayers.slice(startIndex, endIndex);

  playersToShow.forEach((player, index) => {
    const listItem = document.createElement('li');
    listItem.textContent = player.name;
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.style.marginLeft = '10px';
    deleteButton.style.fontSize = '0.8em'; // Reduce the font size
    deleteButton.addEventListener('click', (e) => {
      e.stopPropagation();
      deletePlayer(startIndex + index);
    });
    listItem.appendChild(deleteButton);
    listItem.addEventListener('click', () => openPlayerStats(player));
    playerList.appendChild(listItem);
  });

  document.getElementById('page-info').textContent = `Page ${currentPage} of ${totalPages}`;
  document.getElementById('prev-page').disabled = currentPage === 1;
  document.getElementById('next-page').disabled = currentPage === totalPages;
}

function prevPage() {
  if (currentPage > 1) {
    currentPage--;
    renderPlayerList();
  }
}

function nextPage() {
  const totalPages = Math.ceil(filteredPlayers.length / playersPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    renderPlayerList();
  }
}

function openPlayerStats(player) {
  const iframe = document.getElementById('player-stats-iframe');
  const tableHTML = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Player Stats</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          padding: 20px;
          background-color: #1e1e1e;
          color: #cfcfcf;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }
        th, td {
          border: 1px solid #444;
          padding: 8px;
          text-align: center;
          color: #cfcfcf;
        }
        th {
          background-color: #3c3c3c;
          font-weight: bold;
          font-size: 1.1em;
        }
        tr:nth-child(even) {
          background-color: #2c2c2c;
        }
        tr:hover {
          background-color: #333;
        }
        img {
          display: block;
          margin: 10px auto;
          max-width: 100px;
          height: auto;
        }
      </style>
    </head>
    <body>
      <h2>Player Stats for ${player.name}</h2>
      <table>
        <thead>
          <tr>
            <th>Hero Played</th>
            <th>Map Name</th>
            <th>Outcome</th>
            <th>Match ID</th>
            <th>Team</th>
            <th>Match Image</th>
            <th>Notes</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${player.matches.map((match, index) => `
            <tr>
              <td>${match.hero}</td>
              <td>${match.map}</td>
              <td>${match.outcome}</td>
              <td>${match.id}</td>
              <td>${match.team}</td>
              <td><img src="${match.image}" alt="Match Image" width="50" height="50"></td>
              <td>${player.notes}</td>
              <td>
                <button onclick="parent.editMatch(${playerLists[currentList].indexOf(player)}, ${index})">Edit</button>
                <button onclick="parent.deleteMatch(${playerLists[currentList].indexOf(player)}, ${index})">Delete</button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </body>
    </html>
  `;
  iframe.srcdoc = tableHTML;
  document.getElementById('player-name').textContent = player.name; // Set the player's name in the placeholder
  updateMoreStats(player); // Update the more-stats section
  updatePlayerVsPlayerSummary(); // Update the player vs player summary
  updateCharacterMatchupSummary(); // Update the character matchup summary
}

function updateMoreStats(player) {
  const moreStatsSection = document.getElementById('more-stats');
  const heroStats = {};
  const mapStats = {};
  const heroMapStats = {};
  let totalWins = 0;
  let totalLosses = 0;

  const playerName = playerLists[currentList].find(p => p.name === player.name).name;

  player.matches.forEach(match => {
    if (!heroStats[match.hero]) {
      heroStats[match.hero] = { wins: 0, losses: 0, count: 0 };
    }
    if (!mapStats[match.map]) {
      mapStats[match.map] = { wins: 0, losses: 0, heroes: {} };
    }
    if (!heroMapStats[match.map]) {
      heroMapStats[match.map] = {};
    }
    if (!heroMapStats[match.map][match.hero]) {
      heroMapStats[match.map][match.hero] = 0;
    }

    heroStats[match.hero].count++;
    heroMapStats[match.map][match.hero]++;

    if (match.outcome === 'Win') {
      heroStats[match.hero].wins++;
      mapStats[match.map].wins++;
      totalWins++;
    } else if (match.outcome === 'Loss') {
      heroStats[match.hero].losses++;
      mapStats[match.map].losses++;
      totalLosses++;
    }

    if (!mapStats[match.map].heroes[match.hero]) {
      mapStats[match.map].heroes[match.hero] = 0;
    }
    mapStats[match.map].heroes[match.hero]++;
  });

  const overallWinRate = ((totalWins / (totalWins + totalLosses)) * 100).toFixed(2);
  const mostChosenHero = Object.keys(heroStats).reduce((a, b) => heroStats[a].count > heroStats[b].count ? a : b);
  const mostPlayedMap = Object.keys(mapStats).reduce((a, b) => (mapStats[a].wins + mapStats[a].losses) > (mapStats[b].wins + mapStats[b].losses) ? a : b);

  const heroStatsHTML = Object.keys(heroStats).map(hero => {
    const winPercentage = ((heroStats[hero].wins / heroStats[hero].count) * 100).toFixed(2);
    return `<p><span class="hero-name">${hero}</span>: ${heroStats[hero].wins} Wins, ${heroStats[hero].losses} Losses, ${heroStats[hero].count} Matches, Win Percentage: ${winPercentage}%</p>`;
  }).join('');

  const mapStatsHTML = Object.keys(mapStats).map(map => {
    const mostChosenHeroOnMap = Object.keys(mapStats[map].heroes).reduce((a, b) => mapStats[map].heroes[a] > mapStats[map].heroes[b] ? a : b);
    const winPercentage = ((mapStats[map].wins / (mapStats[map].wins + mapStats[map].losses)) * 100).toFixed(2);
    return `
      <p>${map}: ${mapStats[map].wins} Wins, ${mapStats[map].losses} Losses, Win Percentage: ${winPercentage}%</p>
      <p>Most Chosen Hero: <span class="hero-name">${mostChosenHeroOnMap}</span></p>
    `;
  }).join('');

  moreStatsSection.innerHTML = `
    <h2>${playerName}</h2>
    <h3>Overall Win Rate: ${overallWinRate}%</h3>
    <h3>Hero Stats</h3>
    ${heroStatsHTML}
    <h3>Most Chosen Hero Overall: <span class="hero-name">${mostChosenHero}</span></h3>
    <h3>Map Stats</h3>
    ${mapStatsHTML}
    <h3>Most Played Map: ${mostPlayedMap}</h3>
  `;
}

function deletePlayer(index) {
  showToast('Are you sure you want to delete this player?', () => {
    playerLists[currentList].splice(index, 1);
    localStorage.setItem('playerLists', JSON.stringify(playerLists));
    filterPlayers();
  });
}

function deleteMatch(playerIndex, matchIndex) {
  const player = playerLists[currentList][playerIndex];
  const match = player.matches[matchIndex];
  if (match.outcome === 'Win') player.wins--;
  if (match.outcome === 'Loss') player.losses--;
  player.matches.splice(matchIndex, 1);
  localStorage.setItem('playerLists', JSON.stringify(playerLists));
  openPlayerStats(player);
}

function editMatch(playerIndex, matchIndex) {
  const player = playerLists[currentList][playerIndex];
  const match = player.matches[matchIndex];
  document.getElementById('player-name').value = player.name;
  document.getElementById('player-hero').value = match.hero;
  document.getElementById('match-map').value = match.map;
  document.getElementById('match-outcome').value = match.outcome;
  document.getElementById('match-id').value = match.id;
  document.getElementById('team').value = match.team;
  document.getElementById('match-image').value = match.image;
  document.getElementById('player-notes').value = player.notes;
  editPlayerIndex = playerIndex;
  editMatchIndex = matchIndex;
}

function updateListSelector() {
  const listSelector = document.getElementById('list-selector');
  listSelector.innerHTML = '';
  Object.keys(playerLists).forEach(listName => {
    const option = document.createElement('option');
    option.value = listName;
    option.textContent = listName;
    listSelector.appendChild(option);
  });
  listSelector.value = currentList;
}

document.addEventListener('DOMContentLoaded', () => {
  const playerName = localStorage.getItem('playerName');
  if (playerName) {
    document.querySelector('#more-stats h2').textContent = `Player Stats for ${playerName}`;
  }
});

updateListSelector();
filterPlayers();

function exportData() {
  const dataStr = JSON.stringify(playerLists, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'playerLists.json';
  a.click();
  URL.revokeObjectURL(url);
}

function importData(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target.result);
        Object.keys(importedData).forEach(listName => {
          if (!playerLists[listName]) {
            playerLists[listName] = importedData[listName];
          } else {
            playerLists[listName] = [...playerLists[listName], ...importedData[listName]];
          }
        });
        localStorage.setItem('playerLists', JSON.stringify(playerLists));
        updateListSelector();
        filterPlayers();
      } catch (error) {
        alert('Failed to import data. Please ensure the file is in the correct format.');
      }
    };
    reader.readAsText(file);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('export-data-button').addEventListener('click', exportData);
  document.getElementById('import-data-input').addEventListener('change', importData);
});

function updatePlayerVsPlayerSummary() {
  const playerVsPlayerSummary = document.getElementById('player-vs-player-summary');
  const playerVsPlayerStats = {};

  playerLists[currentList].forEach(player => {
    player.matches.forEach(match => {
      if (!playerVsPlayerStats[player.name]) {
        playerVsPlayerStats[player.name] = { wins: 0, losses: 0 };
      }
      if (match.outcome === 'Win') {
        playerVsPlayerStats[player.name].wins++;
      } else if (match.outcome === 'Loss') {
        playerVsPlayerStats[player.name].losses++;
      }
    });
  });

  const playerVsPlayerHTML = Object.keys(playerVsPlayerStats).map(playerName => {
    const stats = playerVsPlayerStats[playerName];
    const winRate = ((stats.wins / (stats.wins + stats.losses)) * 100).toFixed(2);
    return `<p>${playerName}: ${stats.wins} Wins, ${stats.losses} Losses, Win Rate: ${winRate}%</p>`;
  }).join('');

  playerVsPlayerSummary.innerHTML = `
    <h3>Player vs Player Summary</h3>
    ${playerVsPlayerHTML}
  `;
}

function updateCharacterMatchupSummary() {
  const characterMatchupSummary = document.getElementById('character-matchup-summary');
  const characterMatchupStats = {};

  playerLists[currentList].forEach(player => {
    player.matches.forEach(match => {
      if (!characterMatchupStats[match.hero]) {
        characterMatchupStats[match.hero] = { wins: 0, losses: 0 };
      }
      if (match.outcome === 'Win') {
        characterMatchupStats[match.hero].wins++;
      } else if (match.outcome === 'Loss') {
        characterMatchupStats[match.hero].losses++;
      }
    });
  });

  const characterMatchupHTML = Object.keys(characterMatchupStats).map(hero => {
    const stats = characterMatchupStats[hero];
    const winRate = ((stats.wins / (stats.wins + stats.losses)) * 100).toFixed(2);
    return `<p>${hero}: ${stats.wins} Wins, ${stats.losses} Losses, Win Rate: ${winRate}%</p>`;
  }).join('');

  characterMatchupSummary.innerHTML = `
    <h3>Character Matchup Summary</h3>
    ${characterMatchupHTML}
  `;
}