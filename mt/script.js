// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBp99FAJNWFZFUqwm2eeu9MtbpnMdtgMwE",
  authDomain: "movies-and-show-watch-list.firebaseapp.com",
  projectId: "movies-and-show-watch-list",
  storageBucket: "movies-and-show-watch-list.appspot.com",
  messagingSenderId: "169114410299",
  appId: "1:169114410299:web:66174a6bfea0346d06eb1e"
};

// Initialize Firebase (only once)
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


// Reference collections
const moviesCollection = db.collection("movies");
const showsCollection = db.collection("shows");

function renderList(listId, doc, type) {
  const list = document.getElementById(listId);
  const li = document.createElement("li");
  const data = doc.data();
  li.setAttribute("data-id", doc.id);
  li.innerHTML = `
    <span>${data.title} (${data.genre})</span>
    <button class="toggle-watched-button">${data.watched ? "Unmark Watched" : "Mark Watched"}</button>
    <button class="delete-button">Delete</button>
  `;

  // Watched toggle functionality
  li.querySelector(".toggle-watched-button").addEventListener("click", async () => {
    try {
      const collection = type === "movie" ? moviesCollection : showsCollection;
      await collection.doc(doc.id).update({ watched: !data.watched });
      console.log(`${data.title} marked as ${!data.watched ? "watched" : "unwatched"}`);
    } catch (error) {
      console.error("Error updating watched status:", error);
    }
  });

  // Delete functionality
  li.querySelector(".delete-button").addEventListener("click", async () => {
    try {
      const collection = type === "movie" ? moviesCollection : showsCollection;
      await collection.doc(doc.id).delete();
      list.removeChild(li); // Remove from UI
    } catch (error) {
      console.error("Error deleting document:", error);
    }
  });

  list.appendChild(li);
}


moviesCollection.onSnapshot((snapshot) => {
  const movieList = document.getElementById("movieList");
  movieList.innerHTML = ""; // Clear list
  snapshot.forEach((doc) => {
    renderList("movieList", doc, "movie");
  });
});

showsCollection.onSnapshot((snapshot) => {
  const showList = document.getElementById("showList");
  showList.innerHTML = ""; // Clear list
  snapshot.forEach((doc) => {
    renderList("showList", doc, "show");
  });
});


// Add button functionality
document.getElementById("addButton").addEventListener("click", async () => {
  const title = document.getElementById("titleInput").value.trim();
  const category = document.getElementById("categorySelect").value;
  const genre = document.getElementById("genreSelect").value;

  if (!title) {
    alert("Please enter a title!");
    return;
  }

  const data = { title, genre };

  try {
    if (category === "Movie") {
      await moviesCollection.add(data);
    } else {
      await showsCollection.add(data);
    }
    document.getElementById("titleInput").value = ""; // Clear input
  } catch (error) {
    console.error("Error adding document:", error);
  }
});
document.getElementById("logoutButton").addEventListener("click", () => {
  auth.signOut()
    .then(() => {
      console.log("User logged out");
    })
    .catch((error) => {
      console.error("Logout error:", error.message);
    });
});
