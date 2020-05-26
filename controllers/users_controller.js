/**
 * User Controller
 */
const bcrypt = require('bcrypt');
const { validationResult, matchedData } = require('express-validator');
const models = require('../models');


// models.User.login(username, password).then((user) => {
// 	res.send({
// 	  status: 'success',
// 	  data: {
// 		  user,
// 	  }
// 	});

// }).catch(model.User.NotFoundError, () => {
// 	res.status(400).send({
// 		status: 'error',
// 		message: ' not found',
// 	})
// }).catch((error) => {
//   console.error(error)
// })

// get index of all users
const index = async (req, res) => {
	const allUsers = await new models.User({}).fetchAll();

	res.send({
		status: 'success',
		data: {
			users: allUsers,
		}
	});
}

// get specific user
const show = async (req, res) => {
	const user = await new models.User({id: req.params.userId}).fetch({ withRelated: ['books'] }); // select * from books where id = req.params.bookId

	res.send({
		status: 'success',
		data: {
			user,
		}
	});
}

/**
 * Store a new resource
 * POST /
 */
const store = async (req, res) => {

	// 1. finds the validation errors in this request and wraps them in an object with handy functions
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		// fail
		res.status(422).send({
			status: 'fail',
			data: errors.array(),
		})
		return;
	}

	// 2. extract valid data
	const validData = matchedData(req);

	// 2.5 generate a hash of `validData.password`
	try {
		validData.password = await bcrypt.hash(validData.password, models.User.hashSaltRounds);
	} catch (error) {
		res.status(500).send({
			status: 'error',
			message: 'Exception thrown when hashing the password.'
		})
		throw error;
	}

	try {
		// 3. insert valid data into database
		const user = await models.User.forge(validData).save();
		res.send({
			status: 'success',
			data: user,
		});

	} catch (error) {
		res.status(500).send({
			status: 'error',
			message: 'Exception thrown in database when creating a new user.'
		})
		throw error;
	}
}

/**
 * update a specific resource
 * POST /:userId
 */
const update = async (req, res) => {
	const userId = req.params.userId;

	// get user
	const user = await new models.User({ id: userId }).fetch({ require: false });

	// check if user exists
	if (!user) {
		console.log('user to update was not found')
		res.status(404).send({
			status: 'fail',
			data: 'User not found',
		});
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
	try {
		// update valid data into specific userId
		const updatedUser = await user.save(validData)

		res.send({
			status: 'success',
			data: {
				user: updatedUser,
			},
		});

	} catch (error) {
		res.status(500).send({
			status: 'error',
			message: 'Exception thrown in database when creating a new user.'
		})
		throw error;
	}
}

/**
 * destroy a specific resource
 * DELETE /
 */
const destroy = (req, res) => {
	res.status(405).send({
		status: 'fail',
		message: 'Method not allowed.',
	})
}

module.exports = {
	index,
	show,
	store,
	update,
	destroy,
}
