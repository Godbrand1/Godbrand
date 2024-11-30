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

// Add this function to group items by genre
function groupByGenre(docs) {
  const grouped = {};
  docs.forEach(doc => {
    const data = doc.data();
    if (!grouped[data.genre]) {
      grouped[data.genre] = [];
    }
    grouped[data.genre].push(doc);
  });
  return grouped;
}

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
// if statement to disable the season and episode count if movie is selected
document.getElementById("categorySelect").addEventListener("change", function() {
  const category = this.value;
  const seasonCountInput = document.getElementById("seasonCount");
  const episodeCountInput = document.getElementById("episodeCount");

  if (category === "Movie") {
    seasonCountInput.value = 0;
    episodeCountInput.value = 0;
    seasonCount.disabled = true;
    episodeCount.disabled = true;
  } else {
    seasonCountInput.disabled = false;
    episodeCountInput.disabled = false;
  }
});
// Add this function to group items by genre
function groupByGenre(docs) {
  const grouped = {};
  docs.forEach(doc => {
    const data = doc.data();
    if (!grouped[data.genre]) {
      grouped[data.genre] = [];
    }
    grouped[data.genre].push(doc);
  });
  return grouped;
}

// Modify the renderList function to use the new groupByGenre function
function renderList(listId, docs, type) {
  const list = document.getElementById(listId);
  list.innerHTML = ''; // Clear the current list
  const groupedDocs = groupByGenre(docs);

  Object.keys(groupedDocs).forEach(genre => {
    const genreHeader = document.createElement('h3');
    genreHeader.textContent = genre;
    list.appendChild(genreHeader);

    groupedDocs[genre].forEach(doc => {
      const data = doc.data();
      const li = document.createElement('li');
      li.setAttribute('data-id', doc.id);

      li.innerHTML = `
        <span class="${data.watched ? 'watched' : ''}">${data.title}</span>
        <button class="toggle-watched-button ${data.watched ? 'watched' : ''}">
          ${data.watched ? '\u2705 Watched' : '\ud83d\udfe2 Mark as Watched'}
        </button>
        <button class="delete-button">Delete</button>
      `;

      list.appendChild(li);
    });
  });

  // Reinitialize collapsibles after rendering the list
  initializeCollapsibles();
}

// Snapshot Listeners modification
["movie", "show"].forEach((type) => {
  getCollection(type).onSnapshot((snapshot) => {
    const listId = type === "movie" ? "movieList" : "showList";
    renderList(listId, snapshot.docs, type);
  });
});

// Collapsible Sections
function initializeCollapsibles() {
  const coll = document.getElementsByClassName("collapsible");
  for (let i = 0; i < coll.length; i++) {
    coll[i].addEventListener("click", function () {
      this.classList.toggle("active");
      const content = this.nextElementSibling;
      if (content.style.display === "block") {
        content.style.display = "none";
      } else {
        content.style.display = "block";
      }
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initializeCollapsibles();
});

// Delete Item Functionality
document.addEventListener("click", async (event) => {
  if (event.target.classList.contains("delete-button")) {
    const id = event.target.parentElement.getAttribute("data-id");
    const category = event.target.closest("ul").id === "movieList" ? "movie" : "show";
    try {
      const collection = getCollection(category);
      await collection.doc(id).delete();
    } catch (error) {
      alert("Failed to delete item. Please try again.");
    }
  }
});

// Toggle Watched Functionality
document.addEventListener("click", async (event) => {
  if (event.target.classList.contains("toggle-watched-button")) {
    const id = event.target.parentElement.getAttribute("data-id");
    const category = event.target.closest("ul").id === "movieList" ? "movie" : "show";
    try {
      const collection = getCollection(category);
      const doc = await collection.doc(id).get();
      const watched = doc.data().watched;
      await collection.doc(id).update({ watched: !watched });
    } catch (error) {
      alert("Failed to update item. Please try again.");
    }
  }
});
