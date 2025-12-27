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
const TMDB_API_KEY = "ef943a5f931db3c8d6cbb26093cbd052"; // Key for TMDb API
const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w500"; // Base URL for TMDb images
const resultsContainer = document.getElementById("results"); // <div> Container to display innerHTML movie results

// Check URL for search query and run search on page load
document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const searchQuery = urlParams.get("search"); // Get search query from URL

  if (searchQuery) {
    // If a search query exists, set it in input and perform search
    document.getElementById("movieInput").value = searchQuery;
    searchMovies();
  }
});

/**
 * Fetch and display movies based on user input
 * - Queries both OMDb (for basic movie info) and TMDb (for poster images)
 * - Shows up to 6 results
 * - Displays bookmark status if movie is in favorites
 */
async function searchMovies() {
  const title = document.getElementById("movieInput").value.trim(); // Get input value
  resultsContainer.innerHTML = ""; // Clear previous results
  if (!title) return;

  // Fetch movies from OMDb API
  const omdbRes = await fetch(`https://www.omdbapi.com/?s=${encodeURIComponent(title)}&apikey=${OMDB_API_KEY}`);
  const omdbData = await omdbRes.json();
  if (omdbData.Response === "False") {
    resultsContainer.innerHTML = `<p>${omdbData.Error}</p>`; // Show error if no results
    return;
  }

  // Fetch movie posters from TMDb API
  const tmdbRes = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(title)}`);
  const tmdbData = await tmdbRes.json();

  const movies = omdbData.Search.slice(0, 6); // Take max 6 movies
  const posters = tmdbData.results.slice(0, 6); // Take corresponding posters

  const favorites = JSON.parse(localStorage.getItem("favorites") || "[]"); // Get favorites from localStorage

  // Display each movie card
  movies.forEach((movie, i) => {
    const poster = posters[i]?.poster_path ? `${TMDB_IMAGE_BASE}${posters[i].poster_path}` : "";
    const isFavorited = favorites.some(fav => fav.imdbID === movie.imdbID); // Check if movie is favorited
    // add to DOM
    resultsContainer.innerHTML += `
      <div class="movie__card">
        <a href="movie.html?id=${movie.imdbID}&search=${encodeURIComponent(title)}">
          ${poster ? `<img src="${poster}" alt="${movie.Title} poster">` : `<div class="no__poster"></div>`}
          <h2>${movie.Title}</h2>
        </a>
        <p>${movie.Year}</p>
        <i class="fa-solid fa-bookmark movie__bookmark ${isFavorited ? 'favorited' : ''}" 
        data-tooltip="${isFavorited ? 'Remove from Favorites' : 'Add to Favorites'}"
        onclick='toggleFavorite(${JSON.stringify(movie)})'>
        </i>
      </div>
    `;
    
    // Hide the "Start Exploring" section once results are displayed
    const divToHide = document.getElementById("explore");
    if(divToHide) divToHide.style.display = "none";
  });
}

// Add event listener for search button click
document.getElementById("searchBtn").addEventListener("click", searchMovies);

/**
 * Toggle a movie in favorites
 * - If movie is already in favorites → remove it
 * - If movie is not in favorites → add it
 * - Updates localStorage and refreshes movie cards
 */
function toggleFavorite(movie) {
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  const index = favorites.findIndex(fav => fav.imdbID === movie.imdbID);

  if (index > -1) {
    // Movie is already favorited → remove it
    favorites.splice(index, 1);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    alert(`${movie.Title} removed from favorites!`);
  } else {
    // Add to favorites
    if (favorites.length >= 6) { // MAX 6 FAVORITES
      alert("You can only save up to 6 favorite movies.");
      return;
    }
    favorites.push(movie);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    alert(`${movie.Title} added to favorites!`);
  }

  searchMovies(); // Refresh cards to update bookmark icons
}



