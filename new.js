function fetchMovies(genre, startYear, endYear, minRuntime, maxRuntime) {
  console.log('Fetching movies for:', genre, startYear, endYear, minRuntime, maxRuntime);
  const apiKey = '48fa60c';  
  const url = `https://www.omdbapi.com/?s=${genre}&y=${startYear}&apikey=${apiKey}`;

  fetch(url)
      .then(response => response.json())
      .then(data => {
          const moviesContainer = document.getElementById('moviesContainer');
          moviesContainer.innerHTML = ''; 

          if (data.Response === 'True') {
              // Filter films
              const filteredMovies = data.Search.filter(movie => {
                  const runtime = parseInt(movie.Runtime);
                  return runtime >= minRuntime && runtime <= maxRuntime;
              });

              if (filteredMovies.length > 0) {
                  filteredMovies.forEach(movie => {
                      const movieDiv = document.createElement('div');
                      movieDiv.classList.add('movie');
                      movieDiv.innerHTML = `
                          <img src="${movie.Poster}" alt="${movie.Title}">
                          <h3>${movie.Title}</h3>
                          <p>${movie.Year}</p>
                          <p>${movie.Runtime}</p>
                      `;
                      moviesContainer.appendChild(movieDiv);
                  });
              } else {
                  moviesContainer.innerHTML = `<p>No movies found for this selection.</p>`;
              }
          } else {
              moviesContainer.innerHTML = `<p>No movies found for this selection.</p>`;
          }
      })
      .catch(error => {
          console.error('Error fetching movies:', error);
          const moviesContainer = document.getElementById('moviesContainer');
          moviesContainer.innerHTML = `<p>Error fetching movies.</p>`;
      });
}