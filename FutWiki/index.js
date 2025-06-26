const fs = require('fs');
const express = require('express');
let currentYear = 2025;

const app = express();

//========================/home==========================================

app.get('/home', (req, res) => {
    let players = fs.readdirSync('Players'); 
    let html = `<html><body>`;
    for (let player of players) {
        console.log(player)
        html += `<a href='/player?pid=${player}'>${player}</a> <br>`;
    }
    html += `</body></html>`;
    res.send(html);
});

//========================/player==========================================

app.get('/player', (req, res) => {
    player = req.query.pid;
    let data = fs.readFileSync('Players/'+player+'/details.json');
    const bio = JSON.parse(data);
    let age = currentYear - bio.birthYear;
    let html = `<html><body'>`;
    html += `<p>Name: ${bio.pname}`
    html += `<p>DOB: ${bio.dob}`
    html += `<p>Age: ${age}`
    html += `<p>Height: ${bio.hieght}`
    html += `<p>Shirt: ${bio.shirt}`
    html += `<p>Country: ${bio.country}`
    html += `<p>Matches Played: ${bio.matches}`
    html += `<p>Goals Scored: ${bio.goals}`
    html += `<p>Assists Made: ${bio.assist}`
    html += `<p>Primary Position: ${bio.position}`
    html += `<p>Current Team: ${bio.team}`
    
    html += `</body></html>`;
    res.send(html);
});

app.listen(5000);