// TMDb API Key = d5512742aba4946105c54dd6c074076e
// TMDb API: `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(movieTitle)}

// Define the base URL for TMDb images and image size
const OMDB_API_KEY = "48fa60c3";
const TMDB_API_KEY = "ef943a5f931db3c8d6cbb26093cbd052";
const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w500";

async function loadMovie() {
  const params = new URLSearchParams(window.location.search);
  const imdbID = params.get("id");

  if (!imdbID) return;

  try {
    // 1️⃣ Get full movie details from OMDb
    const omdbResponse = await fetch(
      `https://www.omdbapi.com/?i=${imdbID}&plot=full&apikey=${OMDB_API_KEY}`
    );
    const movie = await omdbResponse.json();

    // 2️⃣ Search TMDb for poster using movie title
    const tmdbResponse = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(movie.Title)}`
    );
    const tmdbData = await tmdbResponse.json();

    const posterPath = tmdbData.results?.[0]?.poster_path
      ? `${TMDB_IMAGE_BASE}${tmdbData.results[0].poster_path}`
      : "";

    // 3️⃣ Render single movie card
    document.getElementById("movieDetails").innerHTML = `
    <div class="movie__poster">
    ${
      posterPath
        ? `<img src="${posterPath}" alt="${movie.Title} poster" class="movie-poster">`
        : ""
    }
    </div>
    <div class="movie__details">
      <div class="details__header">
        <div class="dh__ls">
        <h1>${movie.Title}</h1>
        </div>
        <div class="dh__rs">
          <i class="fa-solid fa-bookmark" onClick="addToFavorites('${movie.id}')" style="cursor: pointer;"></i>
        </div>
      </div>
      <ul class="details__ul">
        <li><strong>Actors: </strong>${movie.Actors}</li>
        <li><strong>Director: </strong>${movie.Director}</li>
        <li><strong>Writers: </strong>${movie.Writer}</li>
      </ul>
      <ul class="details__ul">
        <li><strong>Genre: </strong>${movie.Genre}</li>
        <li><strong>Release Date: </strong>${movie.Year}</li>
        <li><strong>Box Office: </strong>${movie.BoxOffice}</li>
        <li><strong>Movie Runtime: </strong>${movie.runtime} minutes</li>
      </ul>
      <p style="font-size: 14px; margin-top:10px;">${movie.Plot}</p>
      <p style="font-size: 15px; font-style: italic; color: #222; margin-top: 10px;">
        <i class="fa-solid fa-award"></i>
        &thinsp; ${movie.awards ? movie.awards : 'No awards'}
      </p>
    </div>
    `;
  } catch (error) {
    console.error(error);
    document.getElementById("movieDetails").innerHTML =
      "<p>Error loading movie details.</p>";
  }
}

loadMovie();
