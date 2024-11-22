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
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Reference collections
const moviesCollection = db.collection("movies");
const showsCollection = db.collection("shows");

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

// Real-time updates for Movies
moviesCollection.onSnapshot((snapshot) => {
  const movieList = document.getElementById("movieList");
  movieList.innerHTML = ""; // Clear list
  snapshot.forEach((doc) => {
    const li = document.createElement("li");
    li.textContent = `${doc.data().title} (${doc.data().genre})`;
    movieList.appendChild(li);
  });
});

// Real-time updates for Shows
showsCollection.onSnapshot((snapshot) => {
  const showList = document.getElementById("showList");
  showList.innerHTML = ""; // Clear list
  snapshot.forEach((doc) => {
    const li = document.createElement("li");
    li.textContent = `${doc.data().title} (${doc.data().genre})`;
    showList.appendChild(li);
  });
});
