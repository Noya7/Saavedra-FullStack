require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const router = require('./routes/router');
const errorHandler = require('./middleware/error-handler')

const SUCCCESS_STR = require('./content/text/success/app.success')
const ERROR_OBJ = require('./content/text/error/app.error');

const app = express();

app.use(express.json(), cors(), cookieParser())
app.use('/api', router)
app.use(errorHandler)

const bootServer = async () => {
    try {
        await mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0.rtdordu.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`);
        app.listen(process.env.PORT || 3000, () => console.log(SUCCCESS_STR))
    } catch (err) {
        console.error(ERROR_OBJ.headline, err.message);
        return {error: ERROR_OBJ.title, message: ERROR_OBJ.message}
    }
}

bootServer();