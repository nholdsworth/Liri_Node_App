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

// random package
let randomItem = require('random-item')

// creating a variable for the node-spotify-api with my specific API key
let spotify = new Spotify(keys.spotify);

// spotify function: if the user types spotify-this-song '{a song name here}' make an api call using node-spotify-api to return back the artist name, track name, a link to a 30 second spotify sample of the track and the album the track is found on
function spotification(song) {

    // conditional statement that handles the case where a user does not put in a song to spotify and returns the data for 
    if (song === undefined) {

        song = 'whitey on the moon';
        console.log('You should check out this song by Gil Scott Heron I\'m not sure why Justin Hurwitz is credited with track other than spotify is dumb and prioritizes recency over orginal recordings.  Sorry about that... \n')

        spotify
            .search({ type: 'track', query: song })
            .then(function (response) {

                console.log('The name of the band/artist is: ' + response.tracks.items[0].album.artists[0].name);
                console.log('The name or the song is: ' + response.tracks.items[0].name);
                console.log('Listen to a preview of this track here: ' + response.tracks.items[0].preview_url);
                console.log('This track can be found on the album: ' + response.tracks.items[0].album.name + '\n\nThis concludes the information for your current request.  Thank you for using Liri. \n');

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
                console.log('This track can be found on the album: ' + response.tracks.items[0].album.name + '\n\nThis concludes the information for your current request.  Thank you for using Liri. \n');

            })
            .catch(function (err) {
                console.log(err)
            })
    };
};

// This function takes the user input and searches for concerts that the user wants to see
function findAConcert(artist) {

    console.log('function executed');
    // using the request package to make an api call to the bandsintown api
    request("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp", function (error, response, body) {

        // creating a variable to hold the parsed data returned from the bandsintown api call so that the original data remains intact but changes it from a string into an object so that I can more easily traverse the object and pull the data that I need (I think .split() would work too...)
        let bandsResponse = JSON.parse(body);

        // I am leaving this console log becuase the bands in town response is unpredictable at best and you might want to see what is actually being returned and maybe help me figure out why the response is so unpredictable
        // console.log(bandsResponse);

        // this for loop loops through the array of objects and allows me to pull out what I need becuase NOTHING else actually worked to get this to happen
        for (let i = 0; i < bandsResponse.length; i++) {

            console.log('The venue for this concert is: ' + bandsResponse[i].venue.name);
            console.log('This Venue is located in: ' + bandsResponse[i].venue.city + ', ' + bandsResponse[i].venue.country);
            console.log('This concert will be held on: ' + moment(bandsResponse[i].datetime).format("MM/DD/YYYY") + '\n\nThis concludes the information for your current request.  Thank you for using Liri. \n');

        };

    });

};

// This function takes the user input and returns data for the movie title entered 
function movieData(title) {

    // This conditional statement handles the case where the user does not put a movie by returning a default movie selection
    if (title === undefined) {

        title = 'Do The Right Thing';
        console.log('Since you didn\'t request a specific movie title, I suggest that you watch this one!\n');

        // The request docs provide the sytax for its use which I followed here to make an api call to omdb
        request("http://www.omdbapi.com/?apikey=49544f9c&t=" + title, function (error, response, body) {

            let omdbResponse = JSON.parse(body);

            // this for loop loops through the ratings array (which has three little objects in it) so that i can scope the Ratings key and pull out the Rotten Tomatoes Value
            for (let i = 0; i < omdbResponse.Ratings.length; i++) {

                // I left this console log in here so that you can see what the result of the for loop looks like and why I used it
                // console.log(omdbResponse.Ratings[i])
            }


            // If there is an error display the error message otherwise do not
            if (error == true) {

                console.log('error:', error);

            }

            // These console.logs are printing out different bits of information from the body of the response
            console.log('Movie title: ' + omdbResponse.Title);
            console.log('This movie was released: ' + omdbResponse.Released);
            console.log('The IMDB rating for this movie is: ' + omdbResponse.imdbRating);
            console.log('Rotten Tomatoes gives this move a rating of: ' + (omdbResponse.Ratings[1].Value));
            console.log('This movie was filmed in: ' + omdbResponse.Country);
            console.log('This movie is in: ' + omdbResponse.Language);
            console.log('Here is a brief synopsis of the plot: ' + omdbResponse.Plot);
            console.log('Starring: ' + omdbResponse.Actors + '\n\nThis concludes the information for your current request.  Thank you for using Liri. \n');
        })

    } else {

        // The request docs provide the sytax for its use which I followed here to make an api call to omdb
        request("http://www.omdbapi.com/?apikey=49544f9c&t=" + title, function (error, response, body) {

            let omdbResponse = JSON.parse(body);

            // this for loop loops through the ratings array (which has three little objects in it) so that i can scope the Ratings key and pull out the Rotten Tomatoes Value
            for (let i = 0; i < omdbResponse.Ratings.length; i++) {

                // I left this console log in here so that you can see what the result of the for loop looks like and why I used it
                // console.log(omdbResponse.Ratings[i])
            };

            // If there is an error display the error message otherwise do not
            if (error == true) {

                console.log('error:', error);

            }

            // These console.logs are printing out different bits of information from the body of the response
            console.log('Movie title: ' + omdbResponse.Title);
            console.log('This movie was released: ' + omdbResponse.Released);
            console.log('The IMDB rating for this movie is: ' + omdbResponse.imdbRating);
            console.log('Rotten Tomatoes gives this move a rating of: ' + (omdbResponse.Ratings[1].Value));
            console.log('This movie was filmed in: ' + omdbResponse.Country);
            console.log('This movie is in: ' + omdbResponse.Language);
            console.log('Here is a brief synopsis of the plot: ' + omdbResponse.Plot);
            console.log('Starring: ' + omdbResponse.Actors + '\n\nThis concludes the information for your current request.  Thank you for using Liri. \n');

        })

    }

}

if (whichAPI === 'spotify-this-song') {

    spotification(artistTrackOrMovie);

} else if (whichAPI === 'concert-this') {

    findAConcert(artistTrackOrMovie);

} else if (whichAPI === 'movie-this') {

    movieData(artistTrackOrMovie);

} else if (whichAPI === 'do-what-it-says') {

    console.log('I see you have requested that I pull a random selection from Nathaniel\'s custom curated list of awesome choices.  Here you go\n');

    // this is the readfile package which reads the file placed in the method as the first argument in this case 'random.txt'
    fs.readFile('random.txt', 'utf8', function (error, data) {

        // this takes the data inside my random.txt file and splits it on every line break and stores it in the variable randomText so that each line has argv[2] (whichAPI) and argv[3] (artistTrackOrMovie) needed for use as random inputs to the command line
        let randomText = data.split('\n');

        // this takes the ramdomText variable and selects a random   
        let randomEntertainment = randomItem(randomText).split(',');

        console.log(randomEntertainment[0]);

        console.log(randomEntertainment[1]);

        if (randomEntertainment[0] === 'spotify-this-song') {
            spotification(randomEntertainment[1])

        } else if (randomEntertainment[0] === 'concert-this') {
            findAConcert(randomEntertainment[1])

        } else if (randomEntertainment[0] === 'movie-this') {
            movieData(randomEntertainment[1])

        } else {
            console.log('lean a little bit closer see that roses really smell like Oooh Oooh Ooooh -Andre 3000');
        }
    })
};

// else if (whichAPI == '*') {
//     console.log('I\'m sorry, I do not recognize that command, please try again using the following syntax: spotify-this-song \'song name here\', movie-this \'movie name here\', concert-this \'artist name here\', do-what-it-says');
// };



// This is my psuedo code that I used to try to break down the homework step by step

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