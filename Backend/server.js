const SECRET = 'rThcexYrtlHBRQ'
const HOST = '192.168.240.136'


const express = require('express')
const cors = require('cors')

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const { MongoClient, ObjectId } = require('mongodb')

const db_uri = 'mongodb://localhost:27017';
const client = new MongoClient(db_uri);
const db = client.db('test');
const users = db.collection('users');

const app = express()


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

    console.log('here: ', id);

    const { password, ...user} = await users.findOne({ _id: new ObjectId(id) });
    console.log(user);
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

    const user = await users.findOne({ _id: insertedId }, { projection: {
        email: 1,
        username: 1
    }})

    const token = jwt.sign({ id: insertedId.toString() }, SECRET);

    res.json({ ...user, token });
})

app.listen(3000, HOST)
