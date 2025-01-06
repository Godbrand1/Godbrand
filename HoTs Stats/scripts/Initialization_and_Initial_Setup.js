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


const heroCategories = {
  'Tank': ['Anub\'arak', 'Arthas', 'Blaze', 'Cho', 'Diablo', 'E.T.C.', 'Garrosh', 'Johanna', 'Mal\'Ganis', 'Mei', 'Muradin', 'Stitches', 'Tyrael', 'Varian'],
  'Bruiser': ['Artanis', 'Chen', 'D.Va', 'Dehaka', 'Deathwing', 'Gazlowe', 'Hogger', 'Imperius', 'Leoric', 'Malthael', 'Ragnaros', 'Rexxar', 'Sonya', 'Thrall', 'Varian', 'Xul', 'Yrel'],
  'Ranged Assassin': ['Azmodan', 'Cassia', 'Chromie', 'Falstad', 'Fenix', 'Gall', 'Genji', 'Greymane', 'Gul\'dan', 'Hanzo', 'Jaina', 'Junkrat', 'Kael\'thas', 'Kel\'Thuzad', 'Li-Ming', 'Lunara', 'Mephisto', 'Nazeebo', 'Nova', 'Orphea', 'Probius', 'Raynor', 'Sgt. Hammer', 'Sylvanas', 'Tassadar', 'Tracer', 'Tychus', 'Valla', 'Zagara', 'Zul\'jin'],
  'Melee Assassin': ['Alarak', 'Illidan', 'Kerrigan', 'Maiev', 'Murky', 'Qhira', 'Samuro', 'The Butcher', 'Valeera', 'Varian', 'Zeratul'],
  'Healer': ['Alexstrasza', 'Ana', 'Anduin', 'Auriel', 'Brightwing', 'Deckard', 'Kharazim', 'Li Li', 'Lt. Morales', 'Lúcio', 'Malfurion', 'Rehgar', 'Stukov', 'Tyrande', 'Uther', 'Whitemane'],
  'Support': ['Abathur', 'Medivh', 'The Lost Vikings', 'Zarya']
};
