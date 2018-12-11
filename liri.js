// code to read and set any environment variables with the dotenv package (honestly I am only kinda sure what this is doing...)
require("dotenv").config();

// creating a variable to hold my API keys retireved from the .env by keys.js... 
let keys = require("./keys.js");

// storing the first user string input in a variable to determine which api call to make 
let whichAPI = process.argv[2];

// storing the second user string input to determine what to query the API call for
let artistTrackOrMovie = process.argv[3];

// making it so that I can use the node-spotify-api in my app
let Spotify = require('node-spotify-api');


// creating a variable to hold the request package
let request = require('request');

// creating a variable for the node-spotify-api with my specific API key
let spotify = new Spotify(keys.spotify);

//FIXME: was trying to use process.env with the bandsintown api key but it didn't work
// let bandsInTown = new BandsInTown(keys.bandsintown)

// spotify function: if the user types spotify-this-song '{a song name here}' make an api call using node-spotify-api to return back the artist name, track name, a link to a 30 second spotify sample of the track and the album the track is found on
function spotification(song) {

    // conditional statement that handles the case where a user does not put in a song to spotify and returns the data for 
    if (song === undefined) {
        song = 'whitey on the moon';
        console.log('You should check out this song by Gil Scott Heron')
        spotify
            .search({ type: 'track', query: song })
            .then(function (response) {
                console.log(response.tracks.items[0].album.artists[0].name);
                console.log(response.tracks.items[0].name);
                console.log(response.tracks.items[0].preview_url);
                console.log(response.tracks.items[0].album.name);
            })
            .catch(function (err) {
                console.log(err)
            });
        // condtional statement handles the regular case where a user follows the instructions
    } else {
        // using the .search method supplied by the npm-spotify-api package to return an object and then traverse through it to pull the data from it
        spotify
            .search({ type: 'track', query: song })
            .then(function (response) {
                console.log(response.tracks.items[0].album.artists[0].name);
                console.log(response.tracks.items[0].name);
                console.log(response.tracks.items[0].preview_url);
                console.log(response.tracks.items[0].album.name);
            })
            .catch(function (err) {
                console.log(err)
            })
    };
};

if (whichAPI === 'spotify-this-song') {

    spotification(artistTrackOrMovie)

} else if (whichAPI === 'concert-this') {

    function findAConcert(artist) {

        request("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp", function (error, response, body) {
            // console.log('error:', error);
            // console.log(response);
            let bandsResponse = JSON.parse(body);

            for (let i = 0; i < bandsResponse.length; i++) {
                console.log(bandsResponse[i]);
            }

            // console.log('body:', bandsResponse);

        })

    }
    request("https://rest.bandsintown.com/artists/" + artistTrackOrMovie + "/events?app_id=codingbootcamp", function (error, response, body) {
        // console.log('error:', error);
        // console.log(response);
        let bandsResponse = JSON.parse(body);

        for (let i = 0; i < bandsResponse.length; i++) {
            console.log(bandsResponse[i]);
        }

        // console.log('body:', bandsResponse);

    })

} else if (whichAPI === 'movie-this') {
    request("http://www.omdbapi.com/?apikey=49544f9c&t=" + artistTrackOrMovie, function (error, response, body) {

        let omdbResponse = JSON.parse(body);

        // console.log('error:', error);
        // console.log('statusCode:', response && response.statusCode);
        console.log(omdbResponse);
    })

}

let fs = require('fs');

if (whichAPI === 'do-what-it-say') {
    fs.readFile('random.txt', 'utf8', function (error, data) {
        data.split(",");
        spotification(data[1]);

    })
}




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