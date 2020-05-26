/**
 * Login controller
 */

const bcrypt = require('bcrypt');
const { validationResult, matchedData } = require('express-validator');
const jwt = require('jsonwebtoken');
const { User } = require('../models')

/**
 * Issue a access token and a refresh token for a user (by username and password)
 * POST /login
 */
const login = async (req, res) => {
	const user = await User.login(req.body.username, req.body.password);

	if (!user) {
		res.status(401).send({
			status: 'Fail',
			data: 'Authentication Required',
		});
		return;
	}

	// construct jwt payload
	const payload = {
		data: {
			id : user.get('id'),
			username: user.get('username'),
			is_admin: user.get('is_admin'),
		},
	}

	// sign payload and get access-token
	const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_LIFETIME || '1h'});

	// sign payload and get refresh-token
	const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_LIFETIME || '1w' });

	res.send({
		status: 'success',
		data: {
			accessToken,
			refreshToken,
		},
	});
}

/**
 * Issue a new access token using a refresh token
 * POST /refresh
 */
const refresh = (req, res) => {
	const token = getTokenFromHeaders(req);
	if (!token) {
		res.status(401).send({
			status: 'fail',
			data: 'No token found in request headers.'
		});
		return
	}

	try {
		// verify token using the refresh token secret
		const { data } = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

		// construct new payload
		const payload = {
			data,
		}

		// issue a new token using the access token secret
		const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_LIFETIME || '1h' });

		// send the access token to the client
		res.send({
			status: 'success',
			data: {
				accessToken,
			}
		})

	} catch (error) {
		res.status(403).send({
			status: 'fail',
			data: 'Invalid token.',
		});
		return;
	}

}

/**
 * Register account
 * POST /register
*/
const register = async (req, res) => {
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
		validData.password = await bcrypt.hash(validData.password, User.hashSaltRounds);
	} catch (error) {
		res.status(500).send({
			status: 'error',
			message: 'Exception thrown when hashing the password.'
		})
		throw error;
	}

	try {
		// 3. insert valid data into database
		const user = await User.forge(validData).save();
		res.status(201).send({
			status: 'success',
			data: null,
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
 * Get token from HTTP headers
 */
const getTokenFromHeaders = (req) => {
	// Check that we have authorization header
	if (!req.headers.authorization) {
		return false;
	}
	// Split authorization header into its pieces
	// "Bearer hfjdskkeJKJ[...]shdhjwTH"
	const [authType, token] = req.headers.authorization.split(' ');

	// Check that the authorization type is Bearer
	if (authType.toLowerCase() !== "bearer") {
		return false;
	}

	return token;
}

module.exports = {
	login,
	refresh,
	register,
	getTokenFromHeaders,
}
