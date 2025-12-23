// TMDb API Key = d5512742aba4946105c54dd6c074076e
// TMDb API: `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(movieTitle)}

// Define the base URL for TMDb images and image size
const baseImageUrl = 'https://image.tmdb.org/t/p/';
const imageSize = 'w500'; // You can change this to the desired size

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer d5512742aba4946105c54dd6c074076e' // Replace with your actual API key
  }
};


// Async function to fetch movie details by ID
async function fetchMovieDetails(movieId) {
  try {
    const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?language=en-US`, options);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const movie = await response.json();

    // Construct the HTML to display movie details
    const output = `
      <div class="movie__poster">
        <img src="${baseImageUrl}${imageSize}${movie.poster_path}" alt="Movie Poster">
      </div>
      <div class="movie__details">
        <div class="details__header">
          <div class="dh__ls">
            <h2>${movie.title}</h2>
          </div>
          <div class="dh__rs">
            <i class="fa-solid fa-bookmark" onClick="addToFavorites('${movie.id}')" style="cursor: pointer;"></i>
          </div>
        </div>
        <span class="italics-text">
          <i>${movie.release_date} &#x2022; ${movie.original_language} &#x2022; Rating - <span style="font-size: 18px; font-weight: 600;">${movie.vote_average}</span>/10</i>
        </span>
        <ul class="details__ul">
          <li><strong>Actors: </strong>${movie.credits.cast.map(actor => actor.name).join(', ')}</li>
          <li><strong>Director: </strong>${movie.credits.crew.find(crew => crew.job === 'Director').name}</li>
          <li><strong>Writers: </strong>${movie.credits.crew.filter(crew => crew.job === 'Writer').map(writer => writer.name).join(', ')}</li>
        </ul>
        <ul class="details__ul">
          <li><strong>Genre: </strong>${movie.genres.map(genre => genre.name).join(', ')}</li>
          <li><strong>Release Date: </strong>${movie.release_date}</li>
          <li><strong>Box Office: </strong>${movie.revenue}</li>
          <li><strong>Movie Runtime: </strong>${movie.runtime} minutes</li>
        </ul>
        <p style="font-size: 14px; margin-top:10px;">${movie.overview}</p>
        <p style="font-size: 15px; font-style: italic; color: #222; margin-top: 10px;">
          <i class="fa-solid fa-award"></i>
          &thinsp; ${movie.awards ? movie.awards : 'No awards'}
        </p>
      </div>
    `;

    // Update the innerHTML of the container where you want to display the movie details
    document.querySelector('.movie__container').innerHTML = output;
    
  } catch (error) {
    console.error('Error fetching movie details:', error);
  }
}


// Event listener for the search button
document.getElementById('searchButton').addEventListener('click', () => {
  const searchInput = document.getElementById('searchInput').value; // Get the value from the input
  fetchMovieData(searchInput); // Call the fetch function with the input value
});