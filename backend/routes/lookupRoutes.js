const express = require('express');
const { getCategories, getLevels } = require('../controllers/lookupController');

const router = express.Router();

router.get('/categories', getCategories);
router.get('/levels', getLevels);

module.exports = router;
