const express = require('express');
const router = express.Router();
const shiftController = require('../controllers/shift');

router.post('/start', shiftController.startShift);
router.post('/end', shiftController.endShift);
router.post('/startbreak', shiftController.startBreak);
router.post('/endbreak', shiftController.endBreak);
router.post('/comment', shiftController.addComment);
router.get('/get', shiftController.getShifts);

module.exports = router;
