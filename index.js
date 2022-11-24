const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');

// port
const port = process.env.PORT;

// App Initialization
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// MongoDB
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.onfc57d.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
});

async function run() {
    try {
        const database = client.db('lapStoreDB');
        const usersCollection = database.collection('users');
        const categoryCollection = database.collection('categories');

        /*
        ////// Categories Endpoint //////
        */
        // Get all categories
        app.get('/categories', async (req, res) => {
            const query = {};
            const categories = await categoryCollection.find(query).toArray();

            res.send(categories);
        });

        /*
        ////// Users Endpoint //////
        */

        // Get all users
        app.get('/users', async (req, res) => {
            let query = {};
            const users = await usersCollection.find(query).toArray();

            res.send(users);
        });

        // Add user to usersCollection
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);

            res.send(result);
        });

        // Get Admin user
        app.get('/users/admin/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const user = await usersCollection.findOne(query);

            res.send({
                isAdmin: user.role === 'admin',
            });
        });
    } finally {
    }
}

run().catch((err) => console.log(err));

// '/' endpoint
app.get('/', (req, res) => {
    res.send({
        message: 'LapStore Server Root page.',
    });
});

// Listent to PORT
app.listen(port, () => {
    console.log(`
    Listennig to port ${port}
    Open http://localhost:${port} in browser
    `);
});
