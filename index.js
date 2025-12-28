// TMDb API Key = ef943a5f931db3c8d6cbb26093cbd052
// TMDb API: `https://api.themoviedb.org/3/find/{imdb_id}?api_key=${apiKey}&external_source=imdb_id`
//
// OMDb API Key = 48fa60c3
// OMDb API: `http://www.omdbapi.com/?i=tt3896198&apikey=48fa60c3`

// OMDb no longer offers (free) movie poster images.
// Use TMDb for posters ONLY; OMDb for all movie data.

const OMDB_API_KEY = "48fa60c3";
const TMDB_API_KEY = "ef943a5f931db3c8d6cbb26093cbd052";
const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w500";
const FALLBACK_POSTER = "assets/blank-poster.png";

const resultsContainer = document.getElementById("results");
const filterContainer = document.getElementById("filterContainer");

let lastMovieData = []; // Stores full movie data for filtering

// ======================================
// RUN SEARCH FROM URL ON PAGE LOAD
// ======================================
document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const searchQuery = urlParams.get("search");

  if (searchQuery) {
    document.getElementById("movieInput").value = searchQuery;
    searchMovies();
  }
});

/**
 * Fetch and display movies based on user input
 * Uses IMDb ID for poster accuracy
 */
async function searchMovies() {
  const title = document.getElementById("movieInput").value.trim();
  resultsContainer.innerHTML = "";
  if (!title) return;

  // ==========================
  // FETCH BASIC SEARCH (OMDb)
  // ==========================
  const omdbRes = await fetch(
    `https://www.omdbapi.com/?s=${encodeURIComponent(title)}&apikey=${OMDB_API_KEY}`
  );
  const omdbData = await omdbRes.json();

  if (omdbData.Response === "False") {
    resultsContainer.innerHTML = `<p>${omdbData.Error}</p>`;
    filterContainer.style.display = "none";
    return;
  }

  // ==========================
  // REMOVE DUPLICATE IMDb IDs
  // ==========================
  const seenIDs = new Set();
  const uniqueMovies = omdbData.Search.filter(movie => {
    if (seenIDs.has(movie.imdbID)) return false;
    seenIDs.add(movie.imdbID);
    return true;
  });

  // ==========================
  // FETCH FULL OMDb DETAILS
  // ==========================
  const detailedMovies = await Promise.all(
    uniqueMovies.slice(0, 6).map(async (movie) => {
      const detailRes = await fetch(
        `https://www.omdbapi.com/?i=${movie.imdbID}&apikey=${OMDB_API_KEY}`
      );
      const detailData = await detailRes.json();

      return {
        ...movie,
        BoxOffice: detailData.BoxOffice || null,
        imdbRating: detailData.imdbRating || null
      };
    })
  );

  // ==========================
  // FETCH TMDb POSTERS (IMDb ID)
  // ==========================
  lastMovieData = await Promise.all(
    detailedMovies.map(async (movie) => {
      let posterURL = FALLBACK_POSTER;

      try {
        const tmdbRes = await fetch(
          `https://api.themoviedb.org/3/find/${movie.imdbID}?api_key=${TMDB_API_KEY}&external_source=imdb_id`
        );
        const tmdbData = await tmdbRes.json();

        const tmdbMovie = tmdbData.movie_results?.[0];
        if (tmdbMovie?.poster_path) {
          posterURL = `${TMDB_IMAGE_BASE}${tmdbMovie.poster_path}`;
        }
      } catch (err) {
        console.warn(`Poster fetch failed for ${movie.Title}`);
      }

      return { ...movie, posterURL };
    })
  );

  displayMovies(lastMovieData);
  filterContainer.style.display = "block";
}

/**
 * Display movies in the DOM
 */
function displayMovies(movies) {
  const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
  resultsContainer.innerHTML = "";

  movies.forEach((movie) => {
    const isFavorited = favorites.some(fav => fav.imdbID === movie.imdbID);

    resultsContainer.innerHTML += `
      <div class="movie__card">
        <a href="movie.html?id=${movie.imdbID}&search=${encodeURIComponent(
          document.getElementById("movieInput").value
        )}">
          <img 
            src="${movie.posterURL}" 
            alt="${movie.Title} poster"
            onerror="this.src='${FALLBACK_POSTER}'"
          >
          <h2>${movie.Title}</h2>
        </a>
        <p>${movie.Year}</p>
        <i class="fa-solid fa-bookmark movie__bookmark ${
          isFavorited ? "favorited" : ""
        }"
           data-tooltip="${isFavorited ? "Remove from Favorites" : "Add to Favorites"}"
           onclick='toggleFavorite(${JSON.stringify(movie)})'>
        </i>
      </div>
    `;
  });

  const explore = document.getElementById("explore");
  if (explore) explore.style.display = "none";
}

/**
 * Toggle movie in favorites
 */
function toggleFavorite(movie) {
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  const index = favorites.findIndex(fav => fav.imdbID === movie.imdbID);

  if (index > -1) {
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
  displayMovies(lastMovieData);
}

// ==========================
// SEARCH EVENTS
// ==========================
document.getElementById("searchBtn").addEventListener("click", searchMovies);

const searchInput = document.querySelector(".search__input");
if (searchInput) {
  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      searchMovies();
    }
  });
}

/**
 * FILTER FUNCTIONALITY
 */
document.querySelectorAll(".filter__options p").forEach(option => {
  option.addEventListener("click", () => {
    const filterType = option.dataset.filter;
    let sortedMovies = [...lastMovieData];

    if (filterType === "release") {
      sortedMovies.sort((a, b) => parseInt(b.Year) - parseInt(a.Year));
    } else if (filterType === "boxoffice") {
      sortedMovies.sort((a, b) => {
        const aVal = a.BoxOffice ? parseInt(a.BoxOffice.replace(/\D/g, "")) : 0;
        const bVal = b.BoxOffice ? parseInt(b.BoxOffice.replace(/\D/g, "")) : 0;
        return bVal - aVal;
      });
    } else if (filterType === "imdb") {
      sortedMovies.sort((a, b) => {
        const aVal = a.imdbRating ? parseFloat(a.imdbRating) : 0;
        const bVal = b.imdbRating ? parseFloat(b.imdbRating) : 0;
        return bVal - aVal;
      });
    }

    displayMovies(sortedMovies);
  });
});

// ==========================
// SCROLL TO TOP
// ==========================
const scrollTopBtn = document.getElementById("scrollTopBtn");

window.onscroll = () => {
  scrollTopBtn.style.display =
    document.documentElement.scrollTop > 100 ? "block" : "none";
};

scrollTopBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});










