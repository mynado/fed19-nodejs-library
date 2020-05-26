/**
 * Book Controller
 */

const models = require('../models');

/**
 * Get all resources
 * GET /
 */
const index = async (req, res) => {
	// const allBooks = await models.Book.fetchAll(); // denna är en genväg till den undre
	const allBooks = await new models.Book({}).fetchAll();

	res.send({
		status: 'success',
		data: {
			books: allBooks,
		}
	});
}

/**
 * Get a specific resource
 * GET /:bookId
 */
const show = async (req, res) => {
	const book = await models.Book.fetchById(req.params.bookId, { withRelated: ['author'] }) // select * from books where id = req.params.bookId

	res.send({
		status: 'success',
		data: {
			book,
		}
	});
}

/**
 * Store a new resource
 * POST /
 */
const store = (req, res) => {
	res.status(405).send({
		status: 'fail',
		message: 'Method not allowed.',
	})
}

/**
 * Update a specific resource
 * PUT /:bookId
 */
const update = (req, res) => {
	res.status(405).send({
		status: 'fail',
		message: 'Method not allowed.',
	})
}

/**
 * Destroy a specific resource
 * DELETE /:bookId
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
