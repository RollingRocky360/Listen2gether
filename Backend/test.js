const { MongoClient } = require('mongodb');

const uri = "mongodb://localhost:27017";


async function run() {
    try {
        const client = new MongoClient(uri);
        const db = client.db('test');
        const users = db.collection('users');

        await users.find().forEach(console.log);

    } catch {
        console.log("Error");
    } finally {
        await client.close();
    }
}

run().catch(console.log);
