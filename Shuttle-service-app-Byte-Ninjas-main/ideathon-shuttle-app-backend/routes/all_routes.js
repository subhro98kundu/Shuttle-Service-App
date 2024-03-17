const express = require("express");

// const { pingService } = require('../src/ping');

const router = express.Router();


router.get('./', (req, res) => {
    res.send('Hello');
});

router.get('./health', (req, res) => {
    res.send('Hello');
});

module.exports = router;