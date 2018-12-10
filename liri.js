// code to read and set any environment variables with the dotenv package (honestly I am only kinda sure what this is doing...)
require("dotenv").config();

// creating a variable to hold my API keys retireved from the .env by keys.js... 
let keys = require("./keys.js");

let whichAPI = process.argv[2];

let artistOrMovie = process.argv[3];

if (whichAPI === 'spotify-this') {
    spotify
        .search({ type: 'track', query: })
}

// making it so that I can use the node-spotify-api in my app
let Spotify = require('node-spotify-api');

// creating a variable for the node-spotify-api with my specific API key
let spotify = new Spotify(keys.spotify);
console.log(spotify);


spotify
    .search({ type: 'track', query: })



// concert-this <artist/band name> will make an api call to bands in town Artists events API for an artist and render the following information to the terminal
    // 1. grab user input and put it in a variable
    // 2. take what comes after 'concert-this' and store it in a variable
    // 3. use that variable inside the api call to return the band specific info
    // 4.  Pick through the object for the name of the venue, venue location, date of the event (use moment to format this as MM/DD/YYYY

// spotify-this <snog name here>
        // 1. grab user input and put it in a variable
        // 2. take what comes after 'concert-this' and store it in a variable
        // 3. use that variable inside the api call to return the band specific info.
        // 4. pick through the object to return the the Artist of the song, the song's name, a preview link of the song from spotify and the album that the song is from
        // 5. If no song is provided program should have a default song that it returns info about

// movie-this <movie name here>
        // 1. grab user input and put it in a variable
        // 2. take what comes after 'concert-this' and store it in a variable
        // 3. use that variable in the api call to omdb api
        // 4. pck through the object to return the title of the movie, year released, imdb rating, rotten tomatoes, country movie was made in, language of the movie, plot, and actors

// do-what-it-says will take the text inside of random.txt and then use it to call one of liri's commands
        // 1. grab the text from random text and use it for the user input on the command line



