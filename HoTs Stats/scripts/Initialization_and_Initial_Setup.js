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

document.addEventListener('DOMContentLoaded', () => {
  const playerName = localStorage.getItem('playerName');
  if (playerName) {
    document.querySelector('#more-stats h2').textContent = `Player Stats for ${playerName}`;
  }
  updateListSelector();
  filterPlayers();
});