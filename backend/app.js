require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const router = require('./routes/router');
const errorHandler = require('./middleware/error-handler')

const { checkAuth } = require('./middleware/check-auth');

const app = express();

const corsOptions = {
    origin: [process.env.FRONTEND_URL],
    credentials: true,
    optionsSuccessStatus: 200
};

app.options('*', cors(corsOptions));
app.use(express.json(), cors(corsOptions), cookieParser(), checkAuth)
app.use('/api', router)
app.use(errorHandler)

const bootServer = async () => {
    try {
        await mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0.rtdordu.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`);
        app.listen(process.env.PORT || 3000, () => console.log('server up!'))
    } catch (err) {
        console.error('Error starting server: ', err.message);
        return {error: 'Server Error', message: 'Ha ocurrido un error al iniciar el servidor. Err: '+ err.message}
    }
}

bootServer();