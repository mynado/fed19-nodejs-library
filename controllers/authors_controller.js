const models = require('../models');

// get index of all authors
const index = async (req, res) => {
	const allAuthors = await new models.Author({}).fetchAll();

	res.send({
		status: 'success',
		data: {
			authors: allAuthors,
		}
	});
}

// get specific author
const show = async (req, res) => {
	const author = await new models.Author({id: req.params.authorId}).fetch({ withRelated: ['books'] }); // select * from books where id = req.params.bookId

	res.send({
		status: 'success',
		data: {
			author,
		}
	});
}

// store a new resource
// POST /
const store = (req, res) => {
	res.status(405).send({
		status: 'fail',
		message: 'Method not allowed.',
	})
}

// update a specific resource
// PUT /
const update = (req, res) => {
	res.status(405).send({
		status: 'fail',
		message: 'Method not allowed.',
	})
}

// destroy a specific resource
// DELETE /
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
