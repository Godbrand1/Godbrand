// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBp99FAJNWFZFUqwm2eeu9MtbpnMdtgMwE",
  authDomain: "movies-and-show-watch-list.firebaseapp.com",
  projectId: "movies-and-show-watch-list",
  storageBucket: "movies-and-show-watch-list.firebaseapp.com",
  messagingSenderId: "169114410299",
  appId: "1:169114410299:web:66174a6bfea0346d06eb1e"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

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

// Add item
document.getElementById("addButton").addEventListener("click", async () => {
  const title = document.getElementById("titleInput").value.trim();
  const category = document.getElementById("categorySelect").value;
  const genre = document.getElementById("genreSelect").value;

  if (!title) {
    alert("Please enter a title!");
    return;
  }

  const data = { title, genre };

  if (category === "Movie") {
    await moviesCollection.add(data);
  } else {
    await showsCollection.add(data);
  }

  document.getElementById("titleInput").value = ""; // Clear the input
});
