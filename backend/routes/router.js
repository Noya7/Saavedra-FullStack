const express = require('express');

const authRoutes = require("./auth.routes");
const estateRoutes = require("./estate.routes");

const router = express.Router();

const bootController = async (req, res, next) => {res.status(200).json({message: "The server is up!"})}

router.get('/boot', bootController);
router.use('/auth', authRoutes);
router.use('/estate', estateRoutes);

module.exports = router;