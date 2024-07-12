const express = require('express');
const router = express.Router();
const exportController = require('../controllers/export');

router.get('/:employee_id/:format', exportController.exportFile);

module.exports = router;
