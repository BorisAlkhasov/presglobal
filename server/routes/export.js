const express = require('express');
const router = express.Router();
const exportController = require('../controllers/export');

router.get('/:format', exportController.exportFile);

module.exports = router;
