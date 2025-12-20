//API Key - 48fa60c3
//OMDb API: http://www.omdbapi.com/?i=tt3896198&apikey=48fa60c3

const key = '48fa60c3';
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const favoritesBtn = document.getElementById("favoritesBtn");
const homeBtn = document.getElementById("homeBtn");

async function main() {
console.log(await(await fetch("http://www.omdbapi.com/?i=tt3896198&apikey=48fa60c3")).json());
}
main();