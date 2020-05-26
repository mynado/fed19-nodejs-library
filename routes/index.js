const express = require('express');
const router = express.Router();

const auth = require('../controllers/middlewares/auth')
const authController = require('../controllers/auth_controller');
const userValidationRules = require('../validation_rules/user');

/* GET / */
router.get('/', (req, res) => {
  res.send({ status: 'you had me at hello' });
});

// Protect all routes below with the middleware `basic` from the `auth` module
// router.use(auth.basic);

router.use('/authors', require('./authors'));
router.use('/books', require('./books'));

// add ability to login and get JWT access token and a refresh token
router.post('/login', authController.login);

// add ability to refresh a token
router.post('/refresh', authController.refresh);

// add ability to register
router.post('/register', [userValidationRules.createRules], authController.register);

// add ability to validate JWT's
// router.use('/profile', [auth.basic], require('./profile'));
router.use('/profile', [auth.validateJwtToken], require('./profile'));

// router.use('/users', require('./users'));

module.exports = router;
