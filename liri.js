// code to read and set any environment variables with the dotenv package (I think this is so that process.env works in the keys.js file?)
require("dotenv").config();

// creating a variable to hold my API keys retireved from the .env by keys.js using the dotenv package? 
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

    // conditional statement that handles the case where a user does not put in a song to spotify and returns the data for Whitey On The Moon 
    if (song === undefined) {

        song = 'whitey on the moon';
        console.log('You should check out this song by Gil Scott Heron I\'m not sure why Justin Hurwitz is credited with track other than spotify is dumb and prioritizes recency over orginal recordings.  Sorry about that... \n')

    };

    // using the .search method supplied by the npm-spotify-api package to return an object and then traverse through it to pull the data from it
    spotify
        .search({ type: 'track', query: song })
        .then(function (response) {

            console.log(`The name of the band/artist is: ${response.tracks.items[0].album.artists[0].name}`);
            console.log(`The name or the song is: ${response.tracks.items[0].name}`);
            console.log(`Listen to a preview of this track here: ${response.tracks.items[0].preview_url}`);
            console.log(`This track can be found on the album: ${response.tracks.items[0].album.name} \n\nThis concludes the information for your current request.  Thank you for using Liri. \n`);

        })
        .catch(function (err) {
            console.log(err)
        })
};

// This function takes the user input and searches for concerts that the user wants to see
function findAConcert(artist) {

    // this console log was crucial for figuring out why my do-what-it-says bands in town api call was nopt working.  If you want to see the difference between the concert-this '<artist name>' and the do what it says remove .trim() from line 170 and remove all but one concert-this from the random.txt file, then put '' marks around the artist name in the random.txt.  Then, concert-this the remaining artist from the random.txt file.  Finally, do the do-what-it-says and compare the difference in what line 60 returns.  WHY does this happen??! 
    // console.log(`findAConcert|${artist}|`);

    // If the user does not request concerts for a certain band it will search for father john misty
    if (artist === undefined) {
        artist = 'Father John Misty'
        console.log('you did not request concerts for a specific artist how about going to see Father John Misty?\n')
    };

    // console.log('function executed');
    // using the request package to make an api call to the bandsintown api
    request(`https://rest.bandsintown.com/artists/${artist}/events?app_id=codingbootcamp`, function (error, response, body) {

        // creating a variable to hold the parsed data returned from the bandsintown api call so that the original data remains intact but changes it from a string into an object so that I can more easily traverse the object and pull the data that I need (I think .split() would work too...)
        let bandsResponse = JSON.parse(body);

        // this for loop loops through the array of objects and allows me to pull out what I need becuase NOTHING else actually worked to get this to happen
        for (let i = 0; i < bandsResponse.length; i++) {

            console.log(`The venue for this concert is: ${bandsResponse[i].venue.name}`);
            console.log(`This Venue is located in: ${bandsResponse[i].venue.city}, ${bandsResponse[i].venue.region}, ${bandsResponse[i].venue.country}`);
            console.log(`This concert will be held on: ${moment(bandsResponse[i].datetime).format("MM/DD/YYYY")} \n\nThis concludes the information for this event. \n`);

        };

    });

};

// This function takes the user input and returns data for the movie title entered 
function movieData(title) {

    // This conditional statement handles the case where the user does not put a movie by returning the default movie selection: Do The Right Thing
    if (title === undefined) {

        title = 'Do The Right Thing';
        console.log('Since you didn\'t request a specific movie title, I suggest that you watch this one!\n');

    };

    // The request docs provide the sytax for its use which I followed here to make an api call to omdb
    request("http://www.omdbapi.com/?apikey=49544f9c&t=" + title, function (error, response, body) {

        // If there is an error display the error message otherwise do not
        if (error == true) {
            console.log('error:', error);
        };

        let omdbResponse = JSON.parse(body);
        console.log(omdbResponse);

        if (omdbResponse.Error === 'Movie not found!') {
            console.log(`Movie not found.  Sorry about that!\n`)
        } else {
            // this for loop loops through the ratings array (which has three little objects in it) so that i can scope the Ratings key and pull out the Rotten Tomatoes Value
            for (let i = 0; i < omdbResponse.Ratings.length; i++) {

                // I left this console log in here so that you can see what the result of the for loop looks like and why I used it
                // console.log(omdbResponse.Ratings[i])

            };

            // These console.logs are printing out different bits of information from the body of the response
            console.log(`Movie title: ${omdbResponse.Title}`);
            console.log(`This movie was released: ${omdbResponse.Released}`);
            console.log(`The IMDB rating for this movie is: ${omdbResponse.imdbRating}`);
            console.log(`Rotten Tomatoes gives this move a rating of: ${omdbResponse.Ratings[1].Value}`);
            console.log(`This movie was filmed in: ${omdbResponse.Country}`);
            console.log(`This movie is in: ${omdbResponse.Language}`);
            console.log(`Here is a brief synopsis of the plot: ${omdbResponse.Plot}`);
            console.log(`Starring: ${omdbResponse.Actors} \n\nThis concludes the information for your current request.  Thank you for using Liri. \n`);
        }

    });

};

// This switch statement runs one of four functions for a spotify api call, a bands in town api call or a omdb api call based on what the user types and passes in the the artist track or movie they are searching for as the argument.  The fourth option takes a random selection from the random.txt file and uses index[0] of the randomEntertianment to decide which api to call and index[1] as the artist song or movie to be searched for.  
switch (whichAPI) {

    default:
        console.log(`MY name is Larry.  I'm sorry I did not recognize ytour command.  Please type one of the following:
    \n
    spotify-this-song 'name of song here'
    \n
    concert-this 'name of band or artist here'
    \n
    movie-this 'name of movie here'
    \n
    do-what-it-says
    \n
I wish I could do more but... if wishes were horse's all poor men would ride and if turnips were pocket watches, I would keep one by my side.  Mmmmm turnips...\n`);
        break;

    case 'spotify-this-song':
        spotification(artistTrackOrMovie);
        break;

    case 'concert-this':
        findAConcert(artistTrackOrMovie);
        break;

    case 'movie-this':
        movieData(artistTrackOrMovie);
        break;

    case 'do-what-it-says':
        console.log('I see you have requested that I pull a random selection from Nathaniel\'s custom curated list of awesome choices!  Here you go, enjoy!\n');

        // this is the readfile package which reads the file placed in the method as the first argument in this case 'random.txt'
        fs.readFile('random.txt', 'utf8', function (error, data) {

            // this takes the data inside my random.txt file and splits it on every line break and stores it in the variable randomText so that each line has argv[2] (whichAPI) and argv[3] (artistTrackOrMovie) needed for use as random inputs to the command line
            let randomText = data.split('\n');

            // this takes the ramdomText variable and selects a random line of text from the array that it created and puts that line into a new array and splits it by the comma into two new indexes in a new array  
            let randomEntertainment = randomItem(randomText).split(',');

            // these conditional statement block takes the the first index of the random input array and uses it to make the appropirate api call for the random artist track or movie that accompanies it.  I didn't use a switch statement here becuase I found that the last else was not as easy to get working.  I beleive that what this shows is that 'if else' statements are better suited for error handling... actually  I figured out how to do error the error handling with the switch statement but I am keeping this as an if else just to have one of each in my code
            if (randomEntertainment[0] === 'spotify-this-song') {
                spotification(randomEntertainment[1])

            } else if (randomEntertainment[0] === 'concert-this') {

                // this console.log helped me troubleshoot for why the do-what-it-says was not working for concerts
                // console.log("About to find a concert for:", randomEntertainment[1]); it's because the bands in town api did not like the space or the quotation marks but the other API's handled those fine so I took out the '' and I used .trim() to get rid of the space...
                findAConcert(randomEntertainment[1].trim())

            } else if (randomEntertainment[0] === 'movie-this') {
                movieData(randomEntertainment[1])

            } else {
                console.log('lean a little bit closer see that roses really smell like Oooh Oooh Ooooh -Andre 3000');
            };
        });
};