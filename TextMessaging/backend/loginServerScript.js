const express = require('express');
const app = express();
exports.app = app;
const { MongoClient } = require('mongodb');
const cors = require('cors');
const path = require('path')

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "../ui")));

const uri = "mongodb://127.0.0.1:27017";
const client = new MongoClient(uri);

async function connectToDb() {
    try {
        await client.connect();
        console.log("Connected successfully to MongoDB");
    } catch (e) {
        console.error("Could not connect to MongoDB", e);
    }
}
connectToDb();

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../ui/main.html"));
});

app.post('/user/signup', async (req, res) => {
    const db = client.db('messenger');
    const usersCollection = db.collection("users");
    const { email, username, pass } = req.body;

    const existingUser = await usersCollection.findOne({ email: email });
    if (existingUser) {
        return res.json({ 'message': 'User already exists' });
    }

    const result = await usersCollection.insertOne({ email, username: username, pass });
    if (result.insertedId) {
        res.json({ 'message': 'Sign Up Successful' });
    } else {
        res.json({ 'message': 'Sign up Failed' });
    }
});

app.post('/user/login', async (req, res) => {

    const db = client.db('messenger');
    const usersCollection = db.collection("users");
    const { email, pass } = req.body;

    if (!email || !pass) {
        return res.json({ 'message': 'Please enter both email and password' });
    }
    const user = await usersCollection.findOne({ email: email });
    if (user && user.pass === pass) {
        res.json({ 'message': 'Login Successful', username: user.username });
        res.sendFile(path.join(__dirname, "../ui/main.html"));
    } else {
        res.json({ 'message': 'Invalid email or password' });
    }
});

app.post('/chatloader', async (req, res) => {
    const db = client.db('messenger');
    const convoCollection = db.collection('conversations');
    username = req.body.username;
    console.log('Loading Chats...');
    try {
        // Find all chats and sort by creation date, newest first
        const chatdata = await convoCollection.find({ participants: { $in: [username] } }).sort({ createdAt: -1 }).toArray();
        res.json({ chatdata });
        console.log('chats found: ' + chatdata);
    } catch (error) {
        console.error('Error fetching chats:', error);
        res.json({ message: 'Server error while fetching chats' });
    }
});

app.post('/chat/newchat', async (req, res) => {
    const db = client.db('messenger');
    const convoCollection = db.collection('conversations');
    try {
        let chatname = req.body.chatname;
        let username = req.body.username;
        // Find all chats and sort by creation date, newest first
        let existingChat = await convoCollection.findOne({ chatname: chatname });
        if (existingChat)
            res.json({ message: 'Chat room already exists, Please choose another name!' })
        else {
            const newchat = await convoCollection.insertOne({ chatname: chatname, messages: [], createdAt: new Date().toISOString, participants: [username, chatname] });
            res.json({ newchat })
        }
    } catch (error) {
        console.error('Error fetching chats:', error);
        res.json({ message: 'Server error while fetching messages' });
    }
})

app.post('/chat/msg', async (req, res) => {
    const db = client.db('messenger');
    const convoCollection = db.collection('conversations');
    try {
        let msgstring = req.body.message;
        let msg = [`${req.body.username}`, msgstring, new Date().toISOString()]
        let chatname = req.body.chatname;
        // Find all chats and sort by creation date, newest first
        await convoCollection.updateOne({ chatname: chatname }, { $push: { messages: msg } });
        const msgs = await convoCollection.findOne({ chatname: chatname });

        res.json({ msgs });
    } catch (error) {
        console.error('Error fetching chats:', error);
        res.json({ message: 'Server error while fetching messages' });
    }
});

app.post('/chat/addUser', async (req, res) => {
    const db = client.db('messenger');
    const convoCollection = db.collection('conversations');
    username = req.body.newPart;
    chatname = req.body.chatname;
    try {
        console.log(chatname, username);
        // Find all chats and sort by creation date, newest first
        await convoCollection.updateOne(
            { chatname: chatname },
            { $addToSet: { participants: username } }
        );
        res.json({ message: 'Added successfully' });
        console.log('Added participant')
    } catch (error) {
        console.error('Error adding participant: ', error);
        res.json({ message: 'Server error while adding participant' });
    }
});


app.listen(9000, "0.0.0.0", () => {
    console.log(`Server running at http://0.0.0.0:9000}`);
});