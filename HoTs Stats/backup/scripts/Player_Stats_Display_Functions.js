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