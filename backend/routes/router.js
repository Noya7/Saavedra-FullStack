const express = require('express');

const authRoutes = require("./auth.routes");
const estateRoutes = require("./estate.routes");

const router = express.Router();

router.use('/auth', authRoutes)
router.use('/estate', estateRoutes)

module.exports = router;