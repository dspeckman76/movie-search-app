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

const OMDB_API_KEY = "48fa60c3";
const resultsContainer = document.getElementById("results");
const filterContainer = document.getElementById("filterContainer"); // Filter button container
let lastMovieData = []; // Stores favorites for filtering

/**
 * Load and display favorite movies
 */
async function loadFavorites() {
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  // Show message if no favorites
  if (favorites.length === 0) {
    resultsContainer.innerHTML = "<p style='color:#fff; text-align:center;'>No favorite movies yet.</p>";
    filterContainer.style.display = "none"; // hide filter if empty
    return;
  }

  resultsContainer.innerHTML = "";
  const limitedFavorites = favorites.slice(0, 6); // Only first 6

  lastMovieData = []; // Reset for filter

  for (let movie of limitedFavorites) {
    let poster = "";
    try {
      const res = await fetch(`https://www.omdbapi.com/?i=${movie.imdbID}&apikey=${OMDB_API_KEY}`);
      const data = await res.json();
      poster = data.Poster && data.Poster !== "N/A" ? data.Poster : "";
      movie.BoxOffice = data.BoxOffice || "N/A";  // Add box office for sorting
      movie.imdbRating = data.imdbRating || "0";  // Add IMDb rating for sorting
      movie.Year = data.Year || "0";              // Ensure Year exists
    } catch (error) {
      console.error("Error fetching poster:", error);
    }

    lastMovieData.push({ ...movie, posterURL: poster });
  }

  displayMovies(lastMovieData);
  filterContainer.style.display = "block"; // always show filter on favorites
}

/**
 * Display movies in the DOM
 * @param {Array} movies - Array of movie objects including posterURL
 */
function displayMovies(movies) {
  resultsContainer.innerHTML = "";
  movies.forEach((movie) => {
    resultsContainer.innerHTML += `
      <div class="movie__card">
        <a href="movie.html?id=${movie.imdbID}">
          ${movie.posterURL ? `<img src="${movie.posterURL}" alt="${movie.Title} poster">` : `<div class="no__poster"></div>`}
          <h2>${movie.Title}</h2>
        </a>
        <p>${movie.Year}</p>
        <i class="fa-solid fa-bookmark movie__bookmark favorited"
           data-tooltip="Remove from Favorites"
           onclick='toggleFavorite(${JSON.stringify(movie)})'></i>
      </div>
    `;
  });
}

/**
 * Toggle a movie in favorites
 */
function toggleFavorite(movie) {
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  const index = favorites.findIndex(fav => fav.imdbID === movie.imdbID);

  if (index !== -1) {
    favorites.splice(index, 1);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    alert(`${movie.Title} removed from favorites!`);
  } else {
    if (favorites.length >= 6) {
      alert("You can only save up to 6 favorite movies.");
      return;
    }
    favorites.push(movie);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    alert(`${movie.Title} added to favorites!`);
  }

  loadFavorites();
}

// Load favorites on page load
loadFavorites();

// FILTER FUNCTIONALITY (works on favorites)
const filterOptions = document.querySelectorAll(".filter__options p");
filterOptions.forEach(option => {
  option.addEventListener("click", () => {
    const filterType = option.dataset.filter;
    let sortedMovies = [...lastMovieData];

    if (filterType === "release") {
      sortedMovies.sort((a, b) => parseInt(b.Year) - parseInt(a.Year));
    } else if (filterType === "boxoffice") {
      sortedMovies.sort((a, b) => {
        const boxA = a.BoxOffice ? parseInt(a.BoxOffice.replace(/\D/g, "")) : 0;
        const boxB = b.BoxOffice ? parseInt(b.BoxOffice.replace(/\D/g, "")) : 0;
        return boxB - boxA;
      });
    } else if (filterType === "imdb") {
      sortedMovies.sort((a, b) => {
        const imdbA = a.imdbRating ? parseFloat(a.imdbRating) : 0;
        const imdbB = b.imdbRating ? parseFloat(b.imdbRating) : 0;
        return imdbB - imdbA;
      });
    }

    displayMovies(sortedMovies);
  });
});

/**
 * Redirect search from favorites page to index page with query
 */
const searchInput = document.querySelector(".search__input");
const searchBtn = document.getElementById("searchBtn");

if (searchBtn && searchInput) {
  searchBtn.addEventListener("click", () => {
    const query = searchInput.value.trim();
    if (!query) return;
    window.location.href = `index.html?search=${encodeURIComponent(query)}`;
  });

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
const backBtn = document.getElementById("backBtn");
if (backBtn) {
  backBtn.addEventListener("click", () => {
    const lastSearch = localStorage.getItem("lastSearch") || "";
    if (lastSearch) {
      window.location.href = `index.html?search=${encodeURIComponent(lastSearch)}`;
    } else {
      window.history.back();
    }
  });
}

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
