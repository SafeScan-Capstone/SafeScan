const router = require('express').Router();
const { getScanHistory, getScanById } = require('../controllers/scanHistory.controller');

router.get('/', getScanHistory);
router.get('/:id', getScanById);

module.exports = router;
