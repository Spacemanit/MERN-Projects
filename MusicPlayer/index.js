const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
app.use('Music', express.static(__dirname + 'Music'));

app.get("/home", (req, res) => {
    let html = "<html><body>";
    for (let i = 65; i <= 90; i++) {
        html += `<a href='/home/movies?movieLetter=${String.fromCharCode(i)}'>${String.fromCharCode(i)}</a>
        &nbsp&nbsp&nbsp`;
    }
    html += "</body></html>";
    res.send(html)
});

app.get("/home/movies", (req, res) => {
    let html = "<html><body>";
    const movieLetter = req.query.movieLetter;
    let movies = fs.readdirSync('Music');
    
    for (let movie of movies) {
        if (movie.startsWith(movieLetter)) {
            html += `<a style="color: black" href='/songs?movie=${movie}'>${movie}</a><br>`;
        }
    }
    
    html += "</body></html>";
    res.send(html); // Send the response!
});

app.get("/songs", (req, res) => {
    html = `<html><body>`
    movie = req.query.movie;
    let songs = fs.readdirSync(`./Music/${movie}`);
    for (let song of songs) {
        html+= `<a style="color: black" href='/play?movie=${movie}&song=${song}'>${song}</a>`;
    }
    html += "</body></html>";
    res.send(html); // Send the response!
});

app.get("/play", (req, res) => {
    song = req.query.song;
    movie = req.query.movie;
    let full = path.join(__dirname, `Music/${movie}/${song}`)
    res.sendFile(full);
})

app.listen(8000);
