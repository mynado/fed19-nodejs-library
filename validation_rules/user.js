/**
 * User Validation Rules
 */

const { body } = require('express-validator');
const models = require('../models');

const createRules = [
	body('username').trim().isLength({ min: 3 }).custom(async value => {
		const user = await new models.User({ username: value }).fetch({ require: false, });
		if (user) {
			return Promise.reject('Username already exists.');
		}
		return Promise.resolve();
	}),
	body('password').trim().isLength({ min: 8 }),
	body('first_name').trim().isLength({ min: 2 }),
	body('last_name').trim().isLength({ min: 2 }),
];

const updateRules = [
	body('password').optional().trim().isLength({ min: 8 }),
	body('first_name').optional().trim().isLength({ min: 2 }),
	body('last_name').optional().trim().isLength({ min: 2 }),
];

module.exports = {
	createRules,
	updateRules,
}
