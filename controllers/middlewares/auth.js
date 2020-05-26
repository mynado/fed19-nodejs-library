/**
 * Authentication middleware
 */

const jwt = require('jsonwebtoken');
const { getTokenFromHeaders } = require('../auth_controller')
const { User } = require('../../models');

// just nu används denna inte, den är kvar för att vi ska kunna testa Basic Auth-metoden enkelt
const basic = async (req, res, next) => {
	// check if Authorization header exists, otherwise bail
	if (!req.headers.authorization) {
		res.status(401).send({
			status: 'fail',
			data: 'Authorization required.',
		});
		return;
	}

	// "Basic YWxsZW46aXZlcnNvbg=="
	// =>
	// [0] = "Basic"
	// [1] = "YWxsZW46aXZlcnNvbg=="
	const [ authSchema, base64Payload ] = req.headers.authorization.split(' ')

	if (authSchema.toLowerCase() !== "basic") {
		// not ours to authenticate
		next();
	}

	const decodedPayload = Buffer.from(base64Payload, 'base64').toString('ascii');

	// username:password
	const [ username, password ] = decodedPayload.split(':');

	const user = await User.login(username, password);

	if (!user) {
		res.status(403).send({
			status: 'fail',
			data: 'Authorization failed.',
		});
		return;
	}

	// now that we have authenticated the user and know that they is who they claim to be
	// attach the user object to the request, so that other parts of the api can use the user
	req.user = user;
	req.user.data = {
		id: user.get('id'),
	};

	next();
}

const validateJwtToken = (req, res, next) => {
	const token = getTokenFromHeaders(req);
	if (!token) {
		res.status(401).send({
			status: 'fail',
			data: 'No token found in request headers.',
		})
		return;
	}

	// Validate token and extract payload
	let payload = null;

	try {
		payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
	} catch (error) {
		res.status(403).send({
			status: 'fail',
			data: 'Authentication failed',
		});
		throw error;
	}

	// attach payload to req.user
	req.user = payload;

	next();
}

module.exports = {
	basic,
	validateJwtToken,
}
