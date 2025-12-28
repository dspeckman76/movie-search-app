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

// Fallback poster (ADD THIS FILE)
const FALLBACK_POSTER = "assets/blank-poster.png";

/**
 * loadMovie()
 * - Fetches full movie details from OMDb using IMDb ID
 * - Fetches poster image from TMDb using IMDb ID (CORRECT MATCH)
 * - Displays movie poster, metadata, plot, awards
 * - Sets bookmark icon based on favorites
 */
async function loadMovie() {
  const params = new URLSearchParams(window.location.search);
  const imdbID = params.get("id");
  if (!imdbID) return;

  try {
    // ==========================
    // FETCH OMDb DETAILS
    // ==========================
    const omdbResponse = await fetch(
      `https://www.omdbapi.com/?i=${imdbID}&plot=full&apikey=${OMDB_API_KEY}`
    );
    const movie = await omdbResponse.json();

    if (movie.Response === "False") {
      throw new Error("Movie not found");
    }

    // Ensure essential fields exist
    movie.BoxOffice = movie.BoxOffice || "N/A";
    movie.Ratings = movie.Ratings || [];
    movie.Awards = movie.Awards || "No awards";

    // ==========================
    // FETCH TMDb POSTER (IMDb ID)
    // ==========================
    let posterURL = FALLBACK_POSTER;

    try {
      const tmdbRes = await fetch(
        `https://api.themoviedb.org/3/find/${imdbID}?api_key=${TMDB_API_KEY}&external_source=imdb_id`
      );
      const tmdbData = await tmdbRes.json();

      const tmdbMovie = tmdbData.movie_results?.[0];
      if (tmdbMovie?.poster_path) {
        posterURL = `${TMDB_IMAGE_BASE}${tmdbMovie.poster_path}`;
      }
    } catch (err) {
      console.warn("TMDb poster fetch failed:", err);
    }

    // ==========================
    // FAVORITES CHECK
    // ==========================
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    const isFavorited = favorites.some(fav => fav.imdbID === movie.imdbID);

    // ==========================
    // RENDER MOVIE DETAILS
    // ==========================
    document.getElementById("movieDetails").innerHTML = `
      <div class="movie__top">
        <div class="movie__poster-container">
          <img 
            src="${posterURL}" 
            alt="${movie.Title} poster" 
            class="movie__poster"
            onerror="this.src='${FALLBACK_POSTER}'"
          >
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
            <p><strong>Actors:</strong> ${movie.Actors || "N/A"}</p>
            <p><strong>Director:</strong> ${movie.Director || "N/A"}</p>
            <p><strong>Writers:</strong> ${movie.Writer || "N/A"}</p>
            <p><strong>Genre:</strong> ${movie.Genre || "N/A"}</p>
            <p><strong>Release Date:</strong> ${movie.Released || movie.Year || "N/A"}</p>
            <p><strong>Box Office:</strong> ${movie.BoxOffice}</p>
            <p><strong>Runtime:</strong> ${movie.Runtime || "N/A"}</p>
            <p><strong>Ratings:</strong> ${
              movie.Ratings.length
                ? movie.Ratings
                    .map(r =>
                      `${r.Source === "Internet Movie Database" ? "IMDb" : r.Source}: ${r.Value}`
                    )
                    .join(" | ")
                : "No ratings available"
            }</p>
          </div>
        </div>
      </div>

      <div class="movie__bottom">
        <h2 class="movie__plot--title">Plot</h2>
        <p class="movie__plot">${movie.Plot || "Plot not available"}</p>
        <p class="movie__awards">
          <i class="fa-solid fa-award"></i> &thinsp; ${movie.Awards}
        </p>
      </div>
    `;

  } catch (err) {
    console.error(err);
    document.getElementById("movieDetails").innerHTML =
      "<p>Error loading movie details.</p>";
  }
}

/**
 * Toggle a movie in favorites
 */
function toggleFavorite(movie) {
  let favorites = JSON.parse(localStorage.getItem("favorites") || []);
  const index = favorites.findIndex(fav => fav.imdbID === movie.imdbID);

  if (index !== -1) {
    favorites.splice(index, 1);
    alert(`${movie.Title} removed from favorites!`);
  } else {
    if (favorites.length >= 6) {
      alert("You can only save up to 6 favorite movies.");
      return;
    }
    favorites.push(movie);
    alert(`${movie.Title} added to favorites!`);
  }

  localStorage.setItem("favorites", JSON.stringify(favorites));
  loadMovie();
}

/**
 * Back button functionality
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



