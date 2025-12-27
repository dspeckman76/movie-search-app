// TMDb API Key = ef943a5f931db3c8d6cbb26093cbd052
// TMDb API: `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(movieTitle)}`
//
// Look into security to hide api keys? - Github Secrets, GitIgnore, .Env
//
// OMDb API Key = 48fa60c3
// OMDb API: `http://www.omdbapi.com/?i=tt3896198&apikey=48fa60c3`

// OMDb no longer offers (free) movie poster images. 
// Utilize a different API (TMDb) that does for poster images only.
// Fetch all other movie detail data from OMDb.

const OMDB_API_KEY = "48fa60c3"; // Key for OMDb API
const resultsContainer = document.getElementById("results"); // Container to display favorite movies

/**
 * Load and display favorite movies
 */
async function loadFavorites() {
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  // Show message if no favorites
  if (favorites.length === 0) {
    resultsContainer.innerHTML = "<p>No favorite movies yet.</p>";
    return;
  }

  resultsContainer.innerHTML = "";

  const limitedFavorites = favorites.slice(0, 6); // Show only first 6 favorites

  for (let movie of limitedFavorites) {
    let poster = "";
    try {
      // Fetch poster from OMDb API
      const res = await fetch(`https://www.omdbapi.com/?i=${movie.imdbID}&apikey=${OMDB_API_KEY}`);
      const data = await res.json();
      poster = data.Poster && data.Poster !== "N/A" ? data.Poster : "";
    } catch (error) {
      console.error("Error fetching poster:", error);
    }

    // Render movie card
    resultsContainer.innerHTML += `
      <div class="movie__card">
        <a href="movie.html?id=${movie.imdbID}">
          ${poster ? `<img src="${poster}" alt="${movie.Title} poster">` : `<div class="no__poster"></div>`}
          <h2>${movie.Title}</h2>
        </a>
        <p>${movie.Year}</p>
        <i class="fa-solid fa-bookmark movie__bookmark favorited"
           data-tooltip="Remove from Favorites"
           onclick='toggleFavorite(${JSON.stringify(movie)})'></i>
      </div>
    `;
  }
}

/**
 * Toggle a movie in favorites
 */
function toggleFavorite(movie) {
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  const index = favorites.findIndex(fav => fav.imdbID === movie.imdbID);

  if (index !== -1) {
    // Remove movie from favorites
    favorites.splice(index, 1);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    alert(`${movie.Title} removed from favorites!`);
  } else {
    // Add movie to favorites
    if (favorites.length >= 6) { // Limit to 6 favorites
      alert("You can only save up to 6 favorite movies.");
      return;
    }
    favorites.push(movie);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    alert(`${movie.Title} added to favorites!`);
  }

  loadFavorites(); // Refresh the results container
}

// Load favorites on page load
loadFavorites();

/**
 * Redirect search from favorites page to index page with query
 */
document.getElementById("searchBtn").addEventListener("click", () => {
  const query = document.querySelector(".search__input").value.trim();
  if (!query) return;
  window.location.href = `index.html?search=${encodeURIComponent(query)}`;
});

// Add Enter key listener to trigger search
const searchInput = document.querySelector(".search__input");
const searchBtn = document.getElementById("searchBtn");
if (searchInput && searchBtn) {
  searchInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      searchBtn.click();
    }
  });
}

/**
 * Back button functionality
 */
document.getElementById("backBtn").addEventListener("click", () => {
  const lastSearch = localStorage.getItem("lastSearch") || "";
  if (lastSearch) {
    window.location.href = `index.html?search=${encodeURIComponent(lastSearch)}`;
  } else {
    window.history.back();
  }
});




