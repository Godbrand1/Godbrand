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