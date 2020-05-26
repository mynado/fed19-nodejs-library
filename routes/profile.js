const express = require('express');
const router = express.Router();
const profileValidationRules = require('../validation_rules/profile');
const { getProfile, getBooks, addBook, updateProfile } = require('../controllers/profile_controller')

/* Get resources */
router.get('/', getProfile );

/* Get resource's books */
router.get('/books', getBooks);

/* Add a book to this user's collection */
router.post('/books', profileValidationRules.addBookRules, addBook);

/* Update a specific resorce */
router.put('/', profileValidationRules.updateProfileRules, updateProfile );

module.exports = router;
