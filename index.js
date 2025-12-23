// TMDb API Key = d5512742aba4946105c54dd6c074076e
// TMDb API: `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(movieTitle)}

const baseImageUrl = 'https://image.tmdb.org/t/p/';
const imageSize = 'w500'; // You can change this to the desired size

async function fetchAndDisplayMovies(searchTerm) {
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: 'Bearer d5512742aba4946105c54dd6c074076e' // Replace with your actual API key
        }
    };

    try {
        const response = await fetch(`https://api.themoviedb.org/3/search/movie?include_adult=false&language=en-US&page=1&query=${searchTerm}`, options);
        const data = await response.json();

        // Get the first 6 results
        const movies = data.results.slice(0, 6);
        const container = document.getElementById('moviesContainer'); // Make sure to have a container with this ID

        // Clear previous content
        container.innerHTML = '';

        // Generate HTML for each movie
        movies.forEach(movie => {
            const fullImageUrl = `${baseImageUrl}${imageSize}${movie.poster_path}`; // Construct the full image URL

            const movieHTML = `
                <div class="fav__item">
                    <div class="fav__poster">
                        <a href="movieDetails.html?id=${movie.id}">
                            <img src="${fullImageUrl}" alt="Movie Poster">
                        </a>
                    </div>
                    <div class="fav__details">
                        <div class="fav__details--box">
                            <div>
                                <p class="fav__movie--name"><a href="movieDetails.html?id=${movie.id}">${movie.title}</a></p>
                                <p class="fav__movie--date"><a href="movieDetails.html?id=${movie.id}">${movie.release_date}</a></p>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            // Append the movie HTML to the container
            container.innerHTML += movieHTML;
        });
    } catch (error) {
        console.error('Error fetching movies:', error);
    }
}

// Function to handle the search
function handleSearch() {
    const searchTerm = document.getElementById('searchInput').value; // Get the value from the input
    if (searchTerm) {
        fetchAndDisplayMovies(searchTerm); // Call the fetch function with the search term
    } else {
        console.log('Please enter a search term.'); // Optional: handle empty input
    }
}

// Add event listener to the button
document.getElementById('searchButton').addEventListener('click', handleSearch);