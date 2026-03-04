
const router = require('express').Router();
const { register, login, verify } = require('../controllers/auth.controller');
const { validate } = require('../middlewares/validation');

router.post('/register', validate('register'), register);
router.post('/login', validate('login'), login);
router.post('/verify', verify);

module.exports = router;
