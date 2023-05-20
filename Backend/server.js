require('dotenv').config()

const JWT_SECRET = process.env.JWT_SECRET
const DB_USER = process.env.DB_USER
const DB_PASSWORD = process.env.DB_PASSWORD

const express = require('express')
const cors = require('cors')
const multer = require('multer')
const sharp = require('sharp')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const http = require('http')


// DB initialization

const { MongoClient, ObjectId } = require('mongodb')
const db_uri = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@cluster0.wkngwm2.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(db_uri);
const db = client.db('test');
const users = db.collection('users');


// Express app initialization

const app = express()
const upload = multer();


// middleware

app.use(cors({
    origin: '*'
}))

app.use(express.json())


// endpoints

app.get('/login', async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    let id;

    try {
        id = jwt.verify(token, SECRET);
    } catch(err) {
        res.status(403).json({
            error: 'access forbidden'
        });
        return;
    }

    const { password, ...user } = await users.findOne({ _id: new ObjectId(id) });
    res.json(user);
})

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const user = await users.findOne({ email });
    if (!user) {
        errors = {
            email: 'does not exist',
            password: ''
        }

        res.status(401).json(errors);
        return;
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
        errors = {
            email: '',
            password: 'is incorrect',
        }

        res.status(401).json(errors);
        return;
    }

    const token = jwt.sign({ id: user._id }, SECRET);

    res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        token
    })
})

app.post('/signup', async (req, res) => {
    const { email, username, password } = req.body;

    if (await users.findOne({ email })) {
        errors = {
            email: 'already exists',
            password: '',
        }
        res.status(401).json(errors)
        return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);

    const { insertedId } = await users.insertOne({
        email, username, password: hashedPassword
    })

    const user = await users.findOne (
        { _id: insertedId }, 
        { projection: {
            email: 1,
            username: 1
        }}
    )

    const token = jwt.sign({ id: insertedId.toString() }, JWT_SECRET);

    res.json({ ...user, token });
})

app.post('/pfp-upload', upload.single('pfp'), async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    let id;

    try {
        id = jwt.verify(token, SECRET);
    } catch(err) {
        res.status(403).json({
            error: 'access forbidden'
        });
        return;
    }

    const img = (
        await sharp(req.file.buffer)
                .resize(100, 100)
                .toFormat('jpg')
                .toBuffer()
    ).toString('base64');

    const pfpEncoded = 'data:image/jpg;base64, ' + img;
    await users.updateOne({ _id: new ObjectId(id) }, { $set: { pfp: pfpEncoded }});

    const {password, ...user} = await users.findOne({ _id: new ObjectId(id) });
    console.log('file = ', pfpEncoded.length);
    res.json(user);
})

app.post('/pfp-delete', async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    let id;

    try {
        id = jwt.verify(token, SECRET);
    } catch(err) {
        res.status(403).json({
            error: 'access forbidden'
        });
        return;
    }

    await users.updateOne({ _id: new ObjectId(id) }, { $set: { pfp: null }});

    const {password, ...user} = await users.findOne({ _id: new ObjectId(id) });
    res.json(user);
})

app.post('/username-update', async (req, res) => {
    
    const token = req.headers.authorization.split(' ')[1];
    let id;

    try {
        id = jwt.verify(token, SECRET);
    } catch(err) {
        res.status(403).json({
            error: 'access forbidden'
        });
        return;
    }

    const { username } = req.body;
    await users.updateOne({ _id: new ObjectId(id) }, { $set: { username }});

    const {password, ...user} = await users.findOne({ _id: new ObjectId(id) });
    res.json(user);
})

app.get('/test', (req, res) => {
    res.json({ hello: 1 })
})
// app.listen(3000, HOST)

const httpServer = http.createServer(app)
module.exports = httpServer