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

// creating a variable to hold the moment package
let moment = require('moment');

// requiring the file system package from npm so that I can read my random.txt file 
let fs = require('fs');

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
                console.log('The name of the band/artist is: ' + response.tracks.items[0].album.artists[0].name);
                console.log('The name or the song is: ' + response.tracks.items[0].name);
                console.log('Listen to a preview of this track here: ' + response.tracks.items[0].preview_url);
                console.log('This track can be found on the album: ' + response.tracks.items[0].album.name);
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
                console.log('The name of the band/artist is: ' + response.tracks.items[0].album.artists[0].name);
                console.log('The name or the song is: ' + response.tracks.items[0].name);
                console.log('Listen to a preview of this track here: ' + response.tracks.items[0].preview_url);
                console.log('This track can be found on the album: ' + response.tracks.items[0].album.name);
            })
            .catch(function (err) {
                console.log(err)
            })
    };
};

// This function takes the user input and searches for concerts that the user wants to see
function findAConcert(artist) {

    // using the request package to make an api call to the bandsintown api
    request("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp", function (error, response, body) {

        // creating a variable to hold the parsed data returned from the bandsintown api call so that the original data remains intact but changes it from a string into an object so that I can more easily traverse the object and pull the data that I need (I think .split() would work too...)
        let bandsResponse = JSON.parse(body);

        // this for loop loops through the array of objects and allows me to pull out what I need becuase NOTHING else actually worked to get this to happen
        for (let i = 0; i < bandsResponse.length; i++) {
            console.log('The venue for this concert is: ' + bandsResponse[i].venue.name);
            console.log('This Venue is located in: ' + bandsResponse[i].venue.city + ', ' + bandsResponse[i].venue.country);
            console.log
            console.log('This concert will be held on: ' + moment(bandsResponse[i].venue.datetime).format("MM/DD/YYYY"));

        }

    })

};

// This function takes the user input and returns data for the movie title entered 
function movieData (title) {

    request("http://www.omdbapi.com/?apikey=49544f9c&t=" + title, function (error, response, body) {

        let omdbResponse = JSON.parse(body);
        
        // this for loop loops through the ratings so that i can scope the ratings array of objects inside the omdb response object...
        for (let i = 0; i < omdbResponse.Ratings.length; i++) {
            console.log(omdbResponse.Ratings[i])
        };
        console.log('error:', error);
        console.log('Movie title: ' + omdbResponse.Title);
        console.log('This movie was released: ' + omdbResponse.Released);
        console.log('The IMDB rating for this movie is: ' + omdbResponse.imdbRating);
        // FIXME:using JSON.stringify to make the Ratings[1] into a string now  I probably need to put it into a variable and then use .split(':', ',') then loop through that array or use a regular expression to just get the rating percentage... FML REALLY??!?  
        console.log('Rotten Tomatoes gives this move a rating of: ' + JSON.stringify(omdbResponse.Ratings[1]));
        console.log('This movie was filmed in: ' + omdbResponse.Country);
        console.log('This movie is in: ' + omdbResponse.Language);
        console.log('Here is a brief synopsis of the plot: ' + omdbResponse.Plot);
        console.log('Starring: ' + omdbResponse.Actors);
    })

}

if (whichAPI === 'spotify-this-song') {

    spotification(artistTrackOrMovie);

} else if (whichAPI === 'concert-this') {

    findAConcert(artistTrackOrMovie);

} else if (whichAPI === 'movie-this') {

    movieData(artistTrackOrMovie);

} else if (whichAPI === 'do-what-it-say') {

    function randomizer () {

        fs.readFile('random.txt', 'utf8', function (error, data) {
            data.split(",");
            spotification(data[1]);
    
        })

    } 

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