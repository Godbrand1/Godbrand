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

// Collections for Movies and Shows
const moviesCollection = db.collection("movies");
const showsCollection = db.collection("shows");

// Load data from Firestore
async function loadData() {
  try {
    const movieSnap = await moviesCollection.get();
    const showSnap = await showsCollection.get();

    console.log("Movies fetched:", movieSnap.docs.map(doc => doc.data()));
    console.log("Shows fetched:", showSnap.docs.map(doc => doc.data()));

    movieSnap.forEach((doc) => displayItem("Movie", doc.id, doc.data()));
    showSnap.forEach((doc) => displayItem("Show", doc.id, doc.data()));
  } catch (error) {
    console.error("Error loading data:", error);
  }
}

// Display item on the page
function displayItem(category, id, data) {
  const listId = `${category.toLowerCase()}Genres-${data.genre}`;
  const list = document.getElementById(listId);

  if (!list) {
    console.error(`No list found for ID: ${listId}. Ensure genre containers are correctly set up.`);
    return;
  }

  const li = document.createElement("li");
  li.setAttribute("data-id", id);
  li.innerHTML = `
    <span>${data.title}</span>
    <button class="delete-button">Delete</button>
  `;
  li.querySelector(".delete-button").addEventListener("click", async function () {
    await deleteItem(category, id);
    li.remove();
  });
  list.appendChild(li);
}

// Add item to Firestore
async function addItem(category, genre, title) {
  const collectionRef = category === "Movie" ? moviesCollection : showsCollection;
  const docRef = await collectionRef.add({ genre, title });
  displayItem(category, docRef.id, { genre, title });
}

// Delete item from Firestore
async function deleteItem(category, id) {
  const collectionRef = category === "Movie" ? moviesCollection : showsCollection;
  await collectionRef.doc(id).delete();
}

// Add button functionality
document.getElementById("addButton").addEventListener("click", async function () {
  const title = document.getElementById("titleInput").value.trim();
  const category = document.getElementById("categorySelect").value;
  const genre = document.getElementById("genreSelect").value;

  if (!title) {
    alert("Please enter a title!");
    return;
  }

  await addItem(category, genre, title);

  document.getElementById("titleInput").value = "";
});

// Load saved data on page load
loadData();
