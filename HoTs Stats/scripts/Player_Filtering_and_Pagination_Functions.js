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