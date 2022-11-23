const express = require('express');
const cors = require('cors');
require('dotenv').config();

// port
const port = process.env.PORT;

// App Initialization
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

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
