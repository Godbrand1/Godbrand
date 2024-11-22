// Add genres dynamically for movies and shows
const genres = ["Action", "Comedy", "Drama", "Horror", "Romance", "Sci-Fi"];
const movieGenres = document.getElementById("movieGenres");
const showGenres = document.getElementById("showGenres");

// Create genre sections
genres.forEach((genre) => {
  createGenreSection(movieGenres, genre);
  createGenreSection(showGenres, genre);
});

function createGenreSection(container, genre) {
  const section = document.createElement("div");
  section.classList.add("genre-section");
  section.innerHTML = `
    <div class="genre-header">${genre}</div>
    <div class="genre-content">
      <ul id="${container.id}-${genre}"></ul>
    </div>
  `;
  container.appendChild(section);

  // Add toggle functionality
  section.querySelector(".genre-header").addEventListener("click", () => {
    const content = section.querySelector(".genre-content");
    content.style.display = content.style.display === "none" ? "block" : "none";
  });
}

document.getElementById("addButton").addEventListener("click", function () {
  const title = document.getElementById("titleInput").value.trim();
  const category = document.getElementById("categorySelect").value;
  const genre = document.getElementById("genreSelect").value;

  if (!title) {
    alert("Please enter a title!");
    return;
  }

  const listId =
    category === "Movie"
      ? `movieGenres-${genre}`
      : `showGenres-${genre}`;
  const list = document.getElementById(listId);

  if (list) {
    // Create new list item
    const li = document.createElement("li");
    li.innerHTML = `
      <span>${title}</span>
      <button class="delete-button">Delete</button>
    `;

    // Add delete functionality
    li.querySelector(".delete-button").addEventListener("click", function () {
      li.remove();
    });

    list.appendChild(li);
  }

  // Clear the input field
  document.getElementById("titleInput").value = "";
});
