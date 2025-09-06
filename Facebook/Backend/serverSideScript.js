const express = require('express');
const app = express();
exports.app = app;
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');
const path = require('path')
const jwt = require('jsonwebtoken')
const multer = require("multer");

const secretkey = "This is ssecret key"

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "../Frontend")));
app.use('/uploads', express.static(path.join(__dirname, "../uploads")));

const uri = "mongodb://127.0.0.1:27017";
const client = new MongoClient(uri);

const MAX_SIZE = 20 * 1024 * 1024

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "../uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/") || file.mimetype.startsWith("video/")) {
        cb(null, true);
    } else {
        cb(new Error("Only image and video files are allowed"), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: MAX_SIZE }
});

async function connectToDb() {
    try {
        await client.connect();
        console.log("Connected successfully to MongoDB");
    } catch (e) {
        console.error("Could not connect to MongoDB", e);
    }
}
connectToDb();

app.post('/login', async (req, res) => {
    const db = client.db('facebook');
    const collection = db.collection('users');
    let email = req.body.email;
    let password = req.body.password;

    try {
        const existingUser = await collection.findOne({ email: email });
        let correctemail = existingUser.email
        let correctpassword = existingUser.password
        if (email === correctemail && password === correctpassword) {
            let payLoad = { email: email, password: password };
            const token = jwt.sign(payLoad, secretkey, { expiresIn: "2w" });
            res.json({ message: 'Login Successful', token: token });
        } else {
            res.json({ message: 'Incorrect email or password' })
        }
    } catch {
        res.json({ message: 'Error while fetching data from server' })
    }
})

app.post('/signup', async (req, res) => {
    const db = client.db('facebook');
    const collection = db.collection('users');
    let email = req.body.email;
    let username = req.body.username;
    let password = req.body.password;

    try {
        const existingUser = await collection.findOne({ email: email })
        if (existingUser === null) {
            await collection.insertOne({ email: email, username: username, password: password })
            res.json({ message: 'Succesfully signed up' });
        } else {
            res.json({ message: 'Existing User' })
        }
    } catch {
        res.json({ message: 'Error while fetching data from server' })
    }
})

async function getUsername(email) {
    const db = client.db('facebook')
    const collection = db.collection('users')
    let userdata = await collection.findOne({ email: email });
    return userdata.username;
}

async function getEmail(username) {
    const db = client.db('facebook')
    const collection = db.collection('users')
    let userdata = await collection.findOne({ username: username });
    return userdata.email;
}

app.post('/sendRequest', async (req, res) => {
    const db = client.db('facebook');
    const collection = db.collection('friends');
    let token = req.body.token;
    let recieveruser = req.body.reciever;
    let reciever = await getEmail(recieveruser)
    let payLoad = jwt.verify(token, secretkey)
    let sender = payLoad.email;

    try {
        const friendList = await collection.findOne({ $or: [{ $and: [{ reciever: reciever }, { sender: sender }] }, { $and: [{ reciever: sender }, { sender: reciever }] }] })
        if (friendList == null) {
            await collection.insertOne({ sender: sender, reciever: reciever, status: 0, sentOn: (new Date()).toISOString(), updatedOn: (new Date()).toISOString() })
            res.json({ message: 'Sent Successfully' })
        } else {
            res.json({ message: 'Already Requested' })
        }
    } catch {
        res.json({ message: 'Error while fetching data from server' })
    }
})

app.post('/pendingRequest', async (req, res) => {
    const db = client.db('facebook');
    const collection = db.collection('friends');
    let token = req.body.token;
    try {
        let payLoad = jwt.verify(token, secretkey)
        let reciever = payLoad.email;
        let pfriends = await collection.find({ $and: [{ reciever: reciever }, { status: 0 }] }).toArray();
        let pemail = [];
        for (let friend of pfriends) {
            puser = await getUsername(friend.sender)
            pemail.push([puser, friend.sender])
        }
        res.json({ pemail: pemail, message: 'Fetched Successfully' })
    } catch {
        res.json({ message: 'Error while fetching data from server' })
    }
})

app.post('/handleRequest', async (req, res) => {
    const db = client.db('facebook');
    const collection = db.collection('friends');
    let token = req.body.token;
    let payLoad = jwt.verify(token, secretkey)
    let reciever = payLoad.email;
    let status = req.body.status;
    let sender = req.body.sender;
    console.log('verified')
    console.log(sender)
    console.log(reciever)
    try {
        await collection.updateOne({ $and: [{ status: 0 }, { reciever: reciever }, { sender: sender }] }, { $set: { status: status, updatedOn: (new Date()).toISOString() } })
        res.json({ message: 'Updated Successfully' })
    } catch {
        res.json({ message: 'Error while fetching data from server' })
    }
})

app.post('/removeFriend', async (req, res) => {
    const db = client.db('facebook');
    const collection = db.collection('friends');
    let token = req.body.token;
    let payLoad = jwt.verify(token, secretkey)
    let reciever = payLoad.email;
    let status = req.body.status;
    let sender = req.body.sender;
    console.log('verified')
    console.log(sender)
    console.log(reciever)
    try {
        await collection.deleteOne({ $or: [{ $and: [{ reciever: reciever }, { sender: sender }] }, { $and: [{ reciever: sender }, { sender: reciever }] }] })
        res.json({ message: 'Updated Successfully' })
    } catch {
        res.json({ message: 'Error while fetching data from server' })
    }
})

app.post('/getFriends', async (req, res) => {
    const db = client.db('facebook');
    const collection = db.collection('friends');
    let token = req.body.token;
    let payLoad = jwt.verify(token, secretkey);
    let sender = payLoad.email;

    try {
        const friendList = await collection.find({ $and: [{ status: 1 }, { $or: [{ sender: sender }, { reciever: sender }] }] }).toArray();
        let friends = [];
        let friend;
        for (let frienddata of friendList) {
            if (frienddata.reciever === sender) {
                friend = await getUsername(frienddata.sender)
                friends.push([friend, frienddata.sender]);
            } else {
                friend = await getUsername(frienddata.reciever)
                friends.push([friend, frienddata.reciever]);
            }
        }
        if (friends.length === 0) {
            res.json({ message: 'No Friends Found!' });
        } else {
            res.json({ friends: friends });
        }
    } catch {
        res.json({ message: 'Error while fetching data from server' });
    }
})

app.post('/getPosts', async (req, res) => {
    let db = client.db('facebook');
    let collection = db.collection('friends');

    let postId = req.query.postId
    if (!(postId == "All")) {
        posts = []
        let postcollection = db.collection('posts');
        let postdata = await postcollection.findOne({ _id: new ObjectId(postId) });
        senderuser = await getUsername(postdata.sender)
        postdata.post.push(senderuser)
        postdata.post.push(postdata.sender)
        postdata.post.push(postdata._id)

        res.json({ post: postdata.post })
        return;
    }

    let token = req.body.token;
    let payLoad = jwt.verify(token, secretkey)
    let currentUser = payLoad.email;
    let friends = [];

    try {
        const friendList = await collection.find({ $or: [{ $and: [{ sender: currentUser }, { status: 1 }] }, { $and: [{ reciever: currentUser }, { status: 1 }] }] }).toArray();

        for (let friendData of friendList) {
            if (friendData.reciever === currentUser)
                friends.push(friendData.sender);
            else
                friends.push(friendData.reciever);
        }

        friends.push(currentUser);
    } catch {
        res.json({ message: 'Error while fetching data from server' });
        return;
    }

    let postcollection = db.collection('posts');
    try {
        // const postsList = await postcollection.find({ $and: [{ sender: { $in: friends } }, { viewedBy: { $not: { $in: friends } } }] }).toArray();
        let postsList = await postcollection.find({ sender: { $in: friends } }).sort({ sentOn: -1 }).toArray();
        let posts = [];
        if (postsList.length === 0) {
            res.json({ message: 'No Posts Available', posts: [] })
        } else {
            for (let postdata of postsList) {
                senderuser = await getUsername(postdata.sender)
                postdata.post.push(senderuser)
                postdata.post.push(postdata.sender)
                postdata.post.push(postdata._id)
                posts.push(postdata.post)
                console.log(posts)
            }
            res.json({ posts: posts })
        }
    } catch {
        res.json({ message: 'Error while fetching data from server', posts: [] })
    }
})

app.post('/addPost', upload.array("images", 5), async (req, res) => {
    const db = client.db('facebook');
    const collection = db.collection('posts');

    try {
        const token = req.body.token;
        const payLoad = jwt.verify(token, secretkey);
        const sender = payLoad.email;
        const post = JSON.parse(req.body.post);

        if (!req.files || req.files.length === 0) {
            return res.json({ message: "Invalid file type. Only images and videos are allowed." });
        }

        const imageUrls = req.files.map(file => `/uploads/${file.filename}`);

        let postfinal = [post[0], imageUrls]
        await collection.insertOne({
            post: postfinal,
            sender,
            sentOn: (new Date()).toISOString(),
            viewedBy: [],
            likedBy: [],
            comments: []
        });

        res.json({ message: 'Sent Successfully' });

    } catch {
        res.json({ message: 'Error while uploading' });
    }
})

app.post('/likePost', async (req, res) => {
    const db = client.db('facebook');
    const collection = db.collection('posts');
    let token = req.body.token;
    let payLoad = jwt.verify(token, secretkey)
    let sender = payLoad.email;
    let post = req.body.post;

    try {
        let postdata = await collection.findOne({ post: post })
        if (!postdata.likedBy.includes(sender))
            await collection.updateOne({ post: post }, { $push: { likedBy: sender } })
        else
            await collection.updateOne({ post: post }, { $pull: { likedBy: sender } })
        res.json({ message: 'Successfully Done' })
    } catch {
        res.json({ message: 'Error while fetching data from server' })
    }
})

app.post('/getLikes', async (req, res) => {
    const db = client.db('facebook');
    const collection = db.collection('posts');
    let token = req.body.token;
    let payLoad = jwt.verify(token, secretkey)
    let sender = payLoad.email;
    let post = req.body.post;
    try {
        let postdata = await collection.findOne({ post: post })
        let number = postdata.likedBy.length
        let liked = false;
        if (postdata.likedBy.includes(sender))
            liked = true
        res.json({ number: number, liked: liked, message: 'Fetched Successfully' })
    } catch {
        res.json({ message: 'Error while fetching data from server' })
    }
})

app.post('/commentOnPost', async (req, res) => {
    const db = client.db('facebook');
    const collection = db.collection('posts');
    let token = req.body.token;
    let payLoad = jwt.verify(token, secretkey)
    let sender = payLoad.email;
    let post = req.body.post;
    let comment = req.body.comment;
    let commentdata = [sender, comment, (new Date()).toISOString()]

    try {
        await collection.updateOne({ post: post }, { $push: { comments: commentdata } })
        res.json({ message: 'Commented Successfully' })
    } catch {
        res.json({ message: 'Error while fetching data from server' })
    }
})

app.post('/getComments', async (req, res) => {
    const db = client.db('facebook');
    const collection = db.collection('posts');
    let postId = req.body.postId;

    try {
        let postdata = await collection.findOne({ _id: new ObjectId(postId) })
        res.json({ commentdata: postdata.comments, message: 'Commented Successfully' })
    } catch {
        res.json({ message: 'Error while fetching data from server' })
    }
})

app.listen(9000, "0.0.0.0", () => {
    console.log(`Server running at http://0.0.0.0:9000}`);
})
