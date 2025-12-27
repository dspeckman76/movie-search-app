# movie-search-app
Purpose of the Project

The purpose of this project is to demonstrate how to build a dynamic web application that interacts with APIs, manipulates the DOM, and handles user input. It also showcases skills in responsive design, clean CSS organization, and JavaScript event handling. The end goal is to provide a smooth user experience where users can easily explore movies and keep track of their favorites.


APIs Used

OMDb API  – This API is used to fetch detailed movie information, including titles, plots, release dates, ratings, and awards. However, poster images were hidden behind a paywall.
TMDb Poster Images API – A separate endpoint from TMDb is used to retrieve movie poster images, allowing the app to display visually appealing movie cards.


Project Setup

Created an HTML structure with multiple pages:
index.html – Main search page.
movie.html – Detailed movie page.
favorites.html – List of user-saved favorite movies.
Linked CSS for styling and JavaScript files for functionality.

CSS Styling and Layout

Built a consistent design system using a body__wrapper and .main__wrapper to organize content and background images.
Styled the header, navigation buttons, search bar, movie cards, and detail sections.
Used flex-box and max-width constraints to center content and maintain responsiveness across different screen sizes.
Added media queries for large laptops, small laptops, tablets, and phones to ensure a seamless experience on all devices.


Building the Search Functionality

Created a search input and button that captures user queries.
Wrote JavaScript functions to call the TMDb API with the search query using fetch and async/await.
Processed the API response to dynamically generate movie cards using innerHTML.
Included default and hover states for bookmarks to visually indicate whether a movie is favorited.


Displaying Movie Details

When a movie is clicked, redirected to movie.html and used the movie ID to fetch detailed information from the API.
Displayed poster images, title, plot summary, release date, ratings, and awards in a structured layout.
Maintained consistency in padding, alignment, and responsive design for all sections (movie__top, movie__bottom, movie__header-top).


Favorites Functionality

Allowed users to add and remove movies from their favorites list by toggling a bookmark icon.
Saved the favorite movies in localStorage so that the favorites persist even after the page is refreshed.
Displayed favorite movies in a separate favorites.html page using the same card layout for visual consistency.


Responsive Design

Used flexible units and clamp() for font sizes and card widths.
Added media queries for all major screen sizes to adjust movie card layout, search box width, poster sizes, and padding.
Ensured buttons, cards, and detail sections scale correctly without breaking layout.


Polishing User Experience

Added hover and active states for buttons and bookmarks.
Used tooltips for bookmarks to explain functionality.
Ensured that the movie detail page looks visually consistent with the search page and that the background image scales properly.


