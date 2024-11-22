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

// Function to render items
function renderList(listId, doc, type) {
  const list = document.getElementById(listId);
  const li = document.createElement("li");
  li.setAttribute("data-id", doc.id);
  li.innerHTML = `
    <span>${doc.data().title} (${doc.data().genre})</span>
    <button class="delete-button">Delete</button>
  `;

  // Delete functionality
  li.querySelector(".delete-button").addEventListener("click", async () => {
    if (type === "movie") {
      await moviesCollection.doc(doc.id).delete();
    } else {
      await showsCollection.doc(doc.id).delete();
    }
    list.removeChild(li);
  });

  list.appendChild(li);
}

// Real-time updates for Movies
moviesCollection.onSnapshot((snapshot) => {
  const movieList = document.getElementById("movieList");
  movieList.innerHTML = ""; // Clear the list
  snapshot.forEach((doc) => {
    renderList("movieList", doc, "movie");
  });
});

// Real-time updates for Shows
showsCollection.onSnapshot((snapshot) => {
  const showList = document.getElementById("showList");
  showList.innerHTML = ""; // Clear the list
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
