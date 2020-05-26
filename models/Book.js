/**
 * Book model
 */

 module.exports = (bookshelf) => {
	return bookshelf.model('Book', {
		tableName: 'books',
		author() {
			return this.belongsTo('Author'); // books.author_id (single author)
		},
		user() {
			return this.belongsToMany('User');
		}
	}, {
		async fetchById(id, fetchOptions = {}) {
			return new this({ id }).fetch(fetchOptions);
		},
	});
 }
