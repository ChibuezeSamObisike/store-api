require('dotenv').config();
require('express-async-errors');

const express = require('express');
const app = express();

const notFoundMiddleware = require('./middleware/not-found');
const errorMiddleware = require('./middleware/error-handler');
const connectDB = require('./db/connect');

const productsRouter = require('./routes/products');

app.use(express.json());

//routes
app.get('/', (req, res) => {
    res.send('<h1> Store API <a href="/api/v1/products">products</a></h1>');
});

app.use('/api/v1/products', productsRouter);

//middle-ware-not-found-error
app.use(notFoundMiddleware);
app.use(errorMiddleware);

const port = process.env.PORT || 8000;

const start = async() => {
    try {
        await connectDB(process.env.MONGO_URI);
        app.listen(port, () => console.log(`Server is listening on ${port}...`));
    } catch (error) {
        console.log(error);
    }
};

start();