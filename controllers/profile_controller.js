/**
 * User Controller
 */

const bcrypt = require('bcrypt');
const { validationResult, matchedData } = require('express-validator');
const jwt = require('jsonwebtoken');
const { Book, User } = require('../models');

/**
 *
 * GET /
 */
const getProfile = async (req, res) => {
	// retrieve authenticated user's profile
	let user = null;
	console.log(req.user)
	try {
		user = await User.fetchById(req.user.data.id);
	} catch (error) {
		res.sendStatus(404);
		throw error;
	}

	// send (parts of) profile to requester
	res.send({
		status: 'success',
		data: {
			user: {
				username: user.get('username'),
				first_name: user.get('first_name'),
				last_name: user.get('last_name'),
			},
		}
	});
}

/**
 * Get the authenticated user's books
 * GET /books
 */
const getBooks = async (req, res) => {
	// query db for user and eager load the books relation
	let user = null;
	try {
		user = await User.fetchById(req.user.data.id, { withRelated: 'books' });
	} catch (error) {
		console.error(error);
		res.sendStatus(404);
		return;
	}

	// query db for books this user has
	const books = user.related('books');

	res.send({
		status: 'success',
		data: {
			books,
		},
	});
}

/**
 * Add a book to the authenticated user's collection
 * POST /books
 */
const addBook = async (req, res) => {
	// finds the validation errors in this request and wraps them in an object with handy functions
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		// fail
		res.status(422).send({
			status: 'fail',
			data: errors.array(),
		})
		return;
	}

	try {
		// 1. get book to attach
		const book = await Book.fetchById(req.body.book_id);
		console.log('fetched book', book)

		// 2. attach book to user (create a row in books_users for this book and user)
		// 2.1. fetch User model
		const user = await User.fetchById(req.user.data.id);

		// 2.2. on User model, call attach() on the books() relation and pass the Book model
		const result = await user.books().attach(book);

		// 2.3. Profit?
		res.status(201).send({
			status: 'success',
			data: result,
		});

	} catch (error) {
		console.error(error);
		res.status(500).send({
			status: 'error',
			message: 'Exception thrown when trying to add book to profile.'
		});
		throw error;
	}




	// 3. return 201 Created if successful
	res.sendStatus(500).send({
		status: 'error',
		message: 'Not implemented',
	});
}

/**
 * update a specific resource
 * PUT /
 */
const updateProfile = async (req, res) => {
	// query db for user
	let user = null;
	try {
		user = await User.fetchById(req.user.data.id);
	} catch (error) {
		console.error(error);
		res.sendStatus(404);
		return;
	}

	// finds the validation errors in this request and wraps them in an object with handy functions
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		// fail
		res.status(422).send({
			status: 'fail',
			data: errors.array(),
		})
		return;
	}

	//  extract valid data
	const validData = matchedData(req);

	// if request contains password, hash it
	if (validData.password) {
		try {
			validData.password = await bcrypt.hash(validData.password, User.hashSaltRounds);
		} catch (error) {
			res.status(500).send({
				status: 'error',
				message: 'Exception thrown in database when updating profile.'
			})
			throw error;
		}
	}
	try {
		// update valid data into specific userId
		await user.save(validData);
		res.sendStatus(204); // successfully updated

	} catch (error) {
		res.status(500).send({
			status: 'error',
			message: 'Exception thrown in database when updating profile.'
		})
		throw error;
	}

}

module.exports = {
	getProfile,
	getBooks,
	addBook,
	updateProfile,
}
