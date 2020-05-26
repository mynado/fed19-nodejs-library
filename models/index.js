/**
 * Index Model
 */

// Setting up the database connection
const knex = require('knex')({
	client: 'mysql',
	connection: {
		host: process.env.DB_HOST || 'localhost', // om env inte finns så körs default-värdet
		port: process.env.DB_PORT || 3306,
		user: process.env.DB_USER || 'root', // AMPPS mySQL default user: root
		password: process.env.DB_PASSWORD || 'mysql', // AMPPS mySQL default password: mysql
		database: process.env.DB_NAME || 'library',
	},
})

const bookshelf = require('bookshelf')(knex);

const Author = require('./Author')(bookshelf);
const Book = require('./Book')(bookshelf);
const User = require('./User')(bookshelf);

// destructuring-alternativ, då behöver man inte tänka på att exportera varenda modell
// const models = {};
// models.Author = require('./Author')(bookshelf);
// models.Book = require('./Book')(bookshelf);
// models.User = require('./User')(bookshelf);

module.exports = {
	// ...models, // destructuring-alternativ
	bookshelf,
	Author,
	Book,
	User,
}
