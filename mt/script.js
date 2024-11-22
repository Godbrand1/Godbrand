// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBp99FAJNWFZFUqwm2eeu9MtbpnMdtgMwE",
  authDomain: "movies-and-show-watch-list.firebaseapp.com",
  projectId: "movies-and-show-watch-list",
  storageBucket: "movies-and-show-watch-list.appspot.com",
  messagingSenderId: "169114410299",
  appId: "1:169114410299:web:66174a6bfea0346d06eb1e"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();

// Login Functionality
document.getElementById("loginButton").addEventListener("click", () => {
  const email = document.getElementById("emailInput").value;
  const password = document.getElementById("passwordInput").value;

  auth.signInWithEmailAndPassword(email, password)
    .then(() => {
      console.log("User logged in");
      document.getElementById("authSection").style.display = "none";
      document.getElementById("mainContent").style.display = "block";
    })
    .catch((error) => {
      console.error("Login error:", error.message);
    });
});

// Signup Functionality
document.getElementById("signupButton").addEventListener("click", () => {
  const email = document.getElementById("emailInput").value;
  const password = document.getElementById("passwordInput").value;

  auth.createUserWithEmailAndPassword(email, password)
    .then(() => {
      console.log("User signed up");
      document.getElementById("authSection").style.display = "none";
      document.getElementById("mainContent").style.display = "block";
    })
    .catch((error) => {
      console.error("Signup error:", error.message);
    });
});

// Monitor Authentication State
auth.onAuthStateChanged((user) => {
  if (user) {
    console.log("User is logged in:", user.email);
    document.getElementById("authSection").style.display = "none";
    document.getElementById("mainContent").style.display = "block";
  } else {
    console.log("No user logged in");
    document.getElementById("authSection").style.display = "block";
    document.getElementById("mainContent").style.display = "none";
  }
});

// Add Button Functionality
document.getElementById("addButton").addEventListener("click", async () => {
  const title = document.getElementById("titleInput").value.trim();
  const category = document.getElementById("categorySelect").value;
  const genre = document.getElementById("genreSelect").value;

  if (!title) {
    alert("Please enter a title!");
    return;
  }

  const data = { title, genre, watched: false };

  try {
    if (category === "Movie") {
      await db.collection("movies").add(data);
    } else {
      await db.collection("shows").add(data);
    }
    document.getElementById("titleInput").value = ""; // Clear input
  } catch (error) {
    console.error("Error adding document:", error);
  }
});

// Render List
function renderList(listId, doc, type) {
  const list = document.getElementById(listId);
  const data = doc.data();
  const li = document.createElement("li");
  li.setAttribute("data-id", doc.id);
  li.innerHTML = `
    <span class="${data.watched ? 'watched' : ''}">${data.title} (${data.genre})</span>
    <button class="toggle-watched-button">
      ${data.watched ? '✅ Watched' : '🟢 Mark as Watched'}
    </button>
    <button class="delete-button">Delete</button>
  `;

  // Watched toggle functionality
  li.querySelector(".toggle-watched-button").addEventListener("click", async () => {
    try {
      const collection = type === "movie" ? db.collection("movies") : db.collection("shows");
      await collection.doc(doc.id).update({ watched: !data.watched });
    } catch (error) {
      console.error("Error updating watched status:", error);
    }
  });

  // Delete functionality
  li.querySelector(".delete-button").addEventListener("click", async () => {
    try {
      const collection = type === "movie" ? db.collection("movies") : db.collection("shows");
      await collection.doc(doc.id).delete();
      list.removeChild(li); // Remove from UI
    } catch (error) {
      console.error("Error deleting document:", error);
    }
  });

  list.appendChild(li);
}

// Real-time Snapshot Listeners
db.collection("movies").onSnapshot((snapshot) => {
  const movieList = document.getElementById("movieList");
  movieList.innerHTML = ""; // Clear the list
  snapshot.forEach((doc) => {
    renderList("movieList", doc, "movie");
  });
});

db.collection("shows").onSnapshot((snapshot) => {
  const showList = document.getElementById("showList");
  showList.innerHTML = ""; // Clear the list
  snapshot.forEach((doc) => {
    renderList("showList", doc, "show");
  });
});
