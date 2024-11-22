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

// Collections
const moviesCollection = db.collection("movies");
const showsCollection = db.collection("shows");

// Genre Containers
const genres = ["Action", "Comedy", "Drama", "Horror", "Romance", "Sci-Fi"];
function createGenreContainers(category) {
  const containerId = category === "Movie" ? "movieGenres" : "showGenres";
  const container = document.getElementById(containerId);

  genres.forEach((genre) => {
    const genreSection = document.createElement("div");
    genreSection.innerHTML = `<h3>${genre}</h3><ul id="${containerId}-${genre}"></ul>`;
    container.appendChild(genreSection);
  });
}
createGenreContainers("Movie");
createGenreContainers("Show");

// Fetch and Display Data
loadData();
