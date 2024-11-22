// Import Firebase and Firestore
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Collections for Movies and Shows
const moviesCollection = collection(db, "movies");
const showsCollection = collection(db, "shows");

// Load data from Firestore
async function loadData() {
  const movieSnap = await getDocs(moviesCollection);
  const showSnap = await getDocs(showsCollection);

  movieSnap.forEach((doc) => displayItem("Movie", doc.id, doc.data()));
  showSnap.forEach((doc) => displayItem("Show", doc.id, doc.data()));
}

// Display item on the page
function displayItem(category, id, data) {
  const listId = `${category.toLowerCase()}Genres-${data.genre}`;
  const list = document.getElementById(listId);

  if (list) {
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
}

// Add item to Firestore
async function addItem(category, genre, title) {
  const collectionRef = category === "Movie" ? moviesCollection : showsCollection;
  const docRef = await addDoc(collectionRef, { genre, title });
  displayItem(category, docRef.id, { genre, title });
}

// Delete item from Firestore
async function deleteItem(category, id) {
  const collectionRef = category === "Movie" ? moviesCollection : showsCollection;
  await deleteDoc(doc(collectionRef, id));
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
