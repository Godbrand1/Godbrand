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

function deletePlayer(index) {
  showToast('Are you sure you want to delete this player?', () => {
    playerLists[currentList].splice(index, 1);
    localStorage.setItem('playerLists', JSON.stringify(playerLists));
    filterPlayers();
  });
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

function deleteMatch(playerIndex, matchIndex) {
  const player = playerLists[currentList][playerIndex];
  const match = player.matches[matchIndex];
  if (match.outcome === 'Win') player.wins--;
  if (match.outcome === 'Loss') player.losses--;
  player.matches.splice(matchIndex, 1);
  localStorage.setItem('playerLists', JSON.stringify(playerLists));
  openPlayerStats(player);
}

// Event Listeners
document.getElementById('list-selector').addEventListener('change', (e) => {
  currentList = e.target.value;
  currentPage = 1;
  filterPlayers();
});

document.getElementById('create-list-button').addEventListener('click', showCreateListToast);
document.getElementById('delete-list-button').addEventListener('click', showDeleteListToast);
document.getElementById('search-bar').addEventListener('input', filterPlayers);

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

document.addEventListener('DOMContentLoaded', () => {
  const playerName = localStorage.getItem('playerName');
  if (playerName) {
    document.querySelector('#more-stats h2').textContent = `Player Stats for ${playerName}`;
  }
});