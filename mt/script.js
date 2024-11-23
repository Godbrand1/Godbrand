// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyBp99FAJNWFZFUqwm2eeu9MtbpnMdtgMwE",
  authDomain: "movies-and-show-watch-list.firebaseapp.com",
  projectId: "movies-and-show-watch-list",
  storageBucket: "movies-and-show-watch-list.appspot.com",
  messagingSenderId: "169114410299",
  appId: "1:169114410299:web:66174a6bfea0346d06eb1e"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();

// Helper to get the collection
function getCollection(type) {
  switch (type) {
    case "movie":
      return db.collection("movies");
    case "show":
      return db.collection("shows");
    default:
      throw new Error("Invalid type");
  }
}

// Login Functionality
document.getElementById("loginButton").addEventListener("click", () => {
  const email = document.getElementById("emailInput").value.trim();
  const password = document.getElementById("passwordInput").value.trim();
  auth.signInWithEmailAndPassword(email, password)
    .then(() => {
      document.getElementById("authSection").style.display = "none";
      document.getElementById("mainContent").style.display = "block";
    })
    .catch((error) => {
      alert("Login failed: " + error.message);
    });
});

// Signup Functionality
document.getElementById("signupButton").addEventListener("click", () => {
  const email = document.getElementById("emailInput").value.trim();
  const password = document.getElementById("passwordInput").value.trim();
  auth.createUserWithEmailAndPassword(email, password)
    .then(() => {
      document.getElementById("authSection").style.display = "none";
      document.getElementById("mainContent").style.display = "block";
    })
    .catch((error) => {
      alert("Signup failed: " + error.message);
    });
});

// Monitor Authentication State
auth.onAuthStateChanged((user) => {
  const authSection = document.getElementById("authSection");
  const mainContent = document.getElementById("mainContent");
  if (user) {
    authSection.style.display = "none";
    mainContent.style.display = "block";
  } else {
    authSection.style.display = "block";
    mainContent.style.display = "none";
  }
});

// Add Item Functionality
document.getElementById("addButton").addEventListener("click", async (event) => {
  event.preventDefault();
  const title = document.getElementById("titleInput").value.trim();
  const category = document.getElementById("categorySelect").value;
  const genre = document.getElementById("genreSelect").value;
  const seasonCount = parseInt(document.getElementById("seasonCount").value) || 0;
  const episodeCount = parseInt(document.getElementById("episodeCount").value) || 0;

  if (!title) {
    alert("Please enter a title!");
    return;
  }

  let data = { title, genre, watched: false };

  if (category === "Show" && seasonCount > 0 && episodeCount > 0) {
    const seasons = Array.from({ length: seasonCount }, (_, i) => ({
      seasonNumber: i + 1,
      episodes: Array.from({ length: episodeCount }, (_, j) => ({
        episodeNumber: j + 1,
        watched: false,
      })),
    }));
    data.seasons = seasons;
  }

  try {
    const collection = getCollection(category.toLowerCase());
    await collection.add(data);
    document.getElementById("titleInput").value = "";
    document.getElementById("seasonCount").value = "";
    document.getElementById("episodeCount").value = "";
  } catch (error) {
    alert("Failed to add item. Please try again.");
  }
});

// Render List Function
function renderList(listId, doc, type) {
  const list = document.getElementById(listId);
  const data = doc.data();
  const li = document.createElement("li");
  li.setAttribute("data-id", doc.id);

  li.innerHTML = `
    <span class="${data.watched ? 'watched' : ''}">${data.title} (${data.genre})</span>
    <button class="toggle-watched-button ${data.watched ? 'watched' : ''}">
      ${data.watched ? '✅ Watched' : '🟢 Mark as Watched'}
    </button>
    <button class="delete-button">Delete</button>
  `;

  // Handle shows with seasons/episodes
  if (type === "show" && Array.isArray(data.seasons)) {
    const seasonList = document.createElement("ul");
    seasonList.style.listStyle = "none";

    data.seasons.forEach((season, seasonIndex) => {
      const seasonItem = document.createElement("li");
      const seasonHeader = document.createElement("button");
      seasonHeader.textContent = `Season ${season.seasonNumber}`;
      seasonHeader.style.cursor = "pointer";

      const episodeList = document.createElement("ul");
      episodeList.style.display = "none";

      season.episodes.forEach((episode, episodeIndex) => {
        const episodeItem = document.createElement("li");
        episodeItem.style.display = "flex";
        episodeItem.style.justifyContent = "space-between";

        const label = document.createElement("label");
        label.textContent = `Episode ${episode.episodeNumber}`;
        label.style.flex = "1";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = episode.watched;

        episodeItem.appendChild(label);
        episodeItem.appendChild(checkbox);
        episodeList.appendChild(episodeItem);

        // Update episode watched status
        checkbox.addEventListener("change", async () => {
          const updatedSeasons = [...data.seasons];
          updatedSeasons[seasonIndex].episodes[episodeIndex].watched = checkbox.checked;

          const allWatched = updatedSeasons.every((season) =>
            season.episodes.every((ep) => ep.watched)
          );

          try {
            await getCollection(type).doc(doc.id).update({
              seasons: updatedSeasons,
              watched: allWatched,
            });
          } catch (error) {
            alert("Failed to update episode status.");
          }
        });
      });

      seasonHeader.addEventListener("click", () => {
        episodeList.style.display =
          episodeList.style.display === "none" ? "block" : "none";
      });

      seasonItem.appendChild(seasonHeader);
      seasonItem.appendChild(episodeList);
      seasonList.appendChild(seasonItem);
    });

    li.appendChild(seasonList);
  }

  // Update main watched status
  li.querySelector(".toggle-watched-button").addEventListener("click", async () => {
    try {
      await getCollection(type).doc(doc.id).update({
        watched: !data.watched,
      });
    } catch (error) {
      alert("Failed to update watched status.");
    }
  });

  // Delete item
  li.querySelector(".delete-button").addEventListener("click", async () => {
    try {
      await getCollection(type).doc(doc.id).delete();
      list.removeChild(li);
    } catch (error) {
      alert("Failed to delete item.");
    }
  });

  list.appendChild(li);
}

// Snapshot Listeners
["movie", "show"].forEach((type) => {
  getCollection(type).onSnapshot((snapshot) => {
    const listId = type === "movie" ? "movieList" : "showList";
    const list = document.getElementById(listId);
    list.innerHTML = "";
    snapshot.forEach((doc) => renderList(listId, doc, type));
  });
});
