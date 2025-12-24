// TMDb API Key = ef943a5f931db3c8d6cbb26093cbd052
// TMDb API: `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(movieTitle)}

// OMDb API Key = 48fa60c3
// OMDb API: `http://www.omdbapi.com/?i=tt3896198&apikey=48fa60c3`

// Function to fetch movie data
const OMDB_API_KEY = "48fa60c3";
const TMDB_API_KEY = "ef943a5f931db3c8d6cbb26093cbd052";
const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w500";

const resultsContainer = document.getElementById("results");

async function searchMovies() {
  const title = document.getElementById("movieInput").value.trim();
  resultsContainer.innerHTML = "";

  if (!title) return;

  const omdbRes = await fetch(
    `https://www.omdbapi.com/?s=${encodeURIComponent(title)}&apikey=${OMDB_API_KEY}`
  );
  const omdbData = await omdbRes.json();

  if (omdbData.Response === "False") {
    resultsContainer.innerHTML = `<p>${omdbData.Error}</p>`;
    return;
  }

  const tmdbRes = await fetch(
    `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(title)}`
  );
  const tmdbData = await tmdbRes.json();

  const movies = omdbData.Search.slice(0, 6);
  const posters = tmdbData.results.slice(0, 6);

  movies.forEach((movie, i) => {
    const poster = posters[i]?.poster_path
      ? `${TMDB_IMAGE_BASE}${posters[i].poster_path}`
      : "";

    resultsContainer.innerHTML += `
      <div class="movie-card">
        <a href="movie.html?id=${movie.imdbID}">
          ${
            poster
              ? `<img src="${poster}" alt="${movie.Title} poster">`
              : `<div class="no-poster"></div>`
          }
          <h2>${movie.Title}</h2>
        </a>
        <p>${movie.Year}</p>
      </div>
    `;
  });
}

document.getElementById("searchBtn")
  .addEventListener("click", searchMovies);

