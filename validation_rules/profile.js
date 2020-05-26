/**
 * User Validation Rules
 */

const { body } = require('express-validator');
const { Book } = require('../models');

const addBookRules = [
	body('book_id').custom(value => Book.fetchById(value)), // check if book_id exists as a book
];

const updateProfileRules = [
	body('password').optional().trim().isLength({ min: 8 }),
	body('first_name').optional().trim().isLength({ min: 2 }),
	body('last_name').optional().trim().isLength({ min: 2 }),
];

module.exports = {
	addBookRules,
	updateProfileRules,
}
