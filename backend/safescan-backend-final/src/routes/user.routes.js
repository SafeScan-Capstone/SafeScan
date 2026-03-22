const router = require('express').Router();
const { getProfile, updateProfile } = require('../controllers/user.controller');

router.get('/profile', getProfile);
router.put('/profile', updateProfile);

module.exports = router;
