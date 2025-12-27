// TMDb API Key = ef943a5f931db3c8d6cbb26093cbd052
// TMDb API: `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(movieTitle)}`
//
// OMDb API Key = 48fa60c3
// OMDb API: `http://www.omdbapi.com/?i=tt3896198&apikey=48fa60c3`
// OMDb no longer offers (free) movie poster images. 
// Use TMDb for poster images; OMDb for other movie details.

const OMDB_API_KEY = "48fa60c3";
const TMDB_API_KEY = "ef943a5f931db3c8d6cbb26093cbd052";
const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w500";

/**
 * loadMovie()
 * - Fetches full movie details from OMDb using IMDb ID
 * - Fetches poster image from TMDb
 * - Displays movie poster, metadata, plot, awards
 * - Sets bookmark icon based on whether movie is in favorites
 */
async function loadMovie() {
  // Get IMDb ID from URL query parameter
  const params = new URLSearchParams(window.location.search);
  const imdbID = params.get("id");
  if (!imdbID) return;

  try {
    // Fetch movie details from OMDb
    const omdbResponse = await fetch(`https://www.omdbapi.com/?i=${imdbID}&plot=full&apikey=${OMDB_API_KEY}`);
    const movie = await omdbResponse.json();

    // Fetch poster from TMDb using movie title
    const tmdbResponse = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(movie.Title)}`);
    const tmdbData = await tmdbResponse.json();
    const posterPath = tmdbData.results?.[0]?.poster_path ? `${TMDB_IMAGE_BASE}${tmdbData.results[0].poster_path}` : "";
    movie.PosterURL = posterPath; // store TMDb poster URL in movie object

    // Check if movie is already in favorites
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    const isFavorited = favorites.some(fav => fav.imdbID === movie.imdbID);

    // Render movie details in DOM
    document.getElementById("movieDetails").innerHTML = `
      <div class="movie__top" style="padding:20px;">
        <div class="movie__poster-container">
          ${posterPath ? `<img src="${posterPath}" alt="${movie.Title} poster" class="movie__poster">` : `<div class="no__poster"></div>`}
        </div>

        <div class="movie__info-container">
          <div class="movie__title-row">
            <h1 class="movie__title">${movie.Title}</h1>
            <i class="fa-solid fa-bookmark movie__bookmark ${isFavorited ? 'favorited' : ''}" 
               data-tooltip="${isFavorited ? 'Remove from Favorites' : 'Add to Favorites'}"
               onclick='toggleFavorite(${JSON.stringify(movie)})'>
            </i>
          </div>
          <div class="movie__meta">
            <p><strong>Actors:</strong> ${movie.Actors}</p>
            <p><strong>Director:</strong> ${movie.Director}</p>
            <p><strong>Writers:</strong> ${movie.Writer}</p>
            <p><strong>Genre:</strong> ${movie.Genre}</p>
            <p><strong>Release Date:</strong> ${movie.Year}</p>
            <p><strong>Box Office:</strong> ${movie.BoxOffice}</p>
            <p><strong>Runtime:</strong> ${movie.Runtime}</p>
          </div>
        </div>
      </div>

      <div class="movie__bottom" style="padding:20px;">
        <h2 class="movie__plot--title">Plot</h2>
        <p class="movie__plot">${movie.Plot}</p>
        <p class="movie__awards"><i class="fa-solid fa-award"></i> &thinsp; ${movie.Awards ? movie.Awards : 'No awards'}</p>
      </div>
    `;
  } catch (error) {
    console.error(error);
    document.getElementById("movieDetails").innerHTML = "<p>Error loading movie details.</p>";
  }
}

/**
 * toggleFavorite(movie)
 * - Adds or removes a movie from favorites stored in localStorage
 * - Updates the bookmark icon immediately
 * - Limits favorites to a maximum of 6 movies
 */
function toggleFavorite(movie) {
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  const index = favorites.findIndex(fav => fav.imdbID === movie.imdbID);

  if (index !== -1) {
    // Movie is already in favorites → remove it
    favorites.splice(index, 1);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    alert(`${movie.Title} removed from favorites!`);
  } else {
    // Movie not in favorites → add it
    if (favorites.length >= 6) { 
      alert("You can only save up to 6 favorite movies.");
      return;
    }
    favorites.push(movie);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    alert(`${movie.Title} added to favorites!`);
  }

  loadMovie(); // Refresh movie details to update bookmark color
}

/**
 * Search functionality
 * - Redirects to index.html with search query
 */
document.getElementById("searchBtn").addEventListener("click", () => {
  const query = document.querySelector(".search__input").value.trim();
  if (!query) return;
  window.location.href = `index.html?search=${encodeURIComponent(query)}`;
});

// Allow pressing Enter to trigger search
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
 * - Goes back to last search if present, otherwise uses browser history
 */
const backBtn = document.getElementById("backBtn");
const params = new URLSearchParams(window.location.search);
const searchQuery = params.get("search");

if (backBtn && searchQuery) {
  backBtn.addEventListener("click", () => {
    window.location.href = `index.html?search=${encodeURIComponent(searchQuery)}`;
  });
} else if (backBtn) {
  backBtn.addEventListener("click", () => window.history.back());
}

// Load movie details on page load
loadMovie();
