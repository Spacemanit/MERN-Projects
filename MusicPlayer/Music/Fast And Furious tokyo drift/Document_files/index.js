const express = require('express');
const app = express();
const {MongoClient} = require('mongodb');

let divemail = document.querySelector('#divEmail');
let divPassword = document.querySelector('#divPassword');
let loginbutton = document.querySelector('#loginbutton');
let divUsername = document.querySelector('#divUsername');
let signupbutton = document.querySelector('#signupbutton');

loginbutton.addEventListener('click', (e) => {
    data = {[divemail.name]:divemail.value, [divPassword.name]:divPassword.value}
    fetch('http://localhost:8000/user/login')
    .then(response=>response.json())
    .then(data=>{
        console.log(data)
    })
    .catch(error=>console.log(error))
});

signupbutton.addEventListener('click', (e) => {
    data = {[divemail.name]:divemail.value, [divPassword.name]:divPassword.value, [divUsername.name]:divUsername.value}
    fetch('http://localhost:8000/user/signup')
    .then(response=>response.json())
    .then(data=>{
        console.log(data)
    })
    .catch(error=>console.log(error))
});

app.use(express.urlencoded({extended:true}));

app.post('/user/signup', async(req, res) => {
    const uri = "mongodb://127.0.0.1/";
    let client = new MongoClient(uri);
    await client.connect();
    let db = client.db('messenger');
    let logindetail = db.collection("users");

    let email = req.body.email;
    let name = req.body.name;
    let pass = req.body.pass;
    let data = [{email: email, name: name, pass:pass}];
    await logindetail.insertOne(data);
});

app.post('/user/login', async(req, res) => {
    const uri = "mongodb://127.0.0.1/";
    let client = new MongoClient(uri);
    await client.connect();
    let db = client.db('messenger');
    let logindetail = db.collection("users");

    let email = req.body.email;
    let pass = req.body.pass;
    let data = [{email: email, pass: pass}];

    if (!user) {
        let correctuser = await logindetail.findOne({email:email});
        let correctpass = await logindetail.findOne({pass:pass});
        if (correctuser == email && correctpass == pass) {
            alert("Succesful")
        } else {
            alert("Invalid Username or password");
        }
    } else {
        alert("Enter username and password!")
    }

});

app.listen(8000);