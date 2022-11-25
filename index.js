const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

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
        const productCollection = database.collection('products');

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
        /////// Products Endpoint ////////
        */

        // Get all products
        app.get('/products/all', async (req, res) => {
            const query = { isSold: false };
            const products = await productCollection.find(query).toArray();

            res.send(products);
        });

        // Get products by category
        app.get('/products/:category', async (req, res) => {
            const category = req.params.category;
            const query = {
                category: category,
                isSold: false,
            };
            const products = await productCollection.find(query).toArray();

            res.send(products);
        });

        // Get products by seller email
        app.get('/products', async (req, res) => {
            const email = req.query.email;
            const query = { sellerEmail: email };
            const products = await productCollection.find(query).toArray();

            res.send(products);
        });

        // Add a product
        app.post('/products/add', async (req, res) => {
            const product = req.body;
            product.postedAt = new Date();
            const result = await productCollection.insertOne(product);

            res.send(result);
        });

        // Delete a product
        app.delete('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await productCollection.deleteOne(query);

            res.send(result);
        });

        // Advertise a product
        app.put('/advertise/:email/:id', async (req, res) => {
            const email = req.params.email;
            const id = req.params.id;
            const filter = { sellerEmail: email, _id: ObjectId(id) };
            const updatedDoc = {
                $set: {
                    isAdvertised: true,
                },
            };
            const options = { upsert: true };

            const result = await productCollection.updateOne(
                filter,
                updatedDoc,
                options
            );

            res.send(result);
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
        // Get Sellers
        app.get('/users/sellers/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const user = await usersCollection.findOne(query);

            res.send({
                isSeller: user.role === 'seller',
            });
        });
        // Get Buyers
        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const user = await usersCollection.findOne(query);

            res.send({
                isUser: user.role === 'user',
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
