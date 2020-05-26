/**
 * User model
 */

const bcrypt = require('bcrypt');

module.exports = (bookshelf) => {
	return bookshelf.model('User', {
		tableName: 'users',
		books() {
			return this.belongsToMany('Book');
		}
	}, {
		hashSaltRounds: 10,

		async fetchById(id, fetchOptions = {}) {
			return new this({ id }).fetch(fetchOptions);
		},

		async login(username, password) {
			// check if user exists
			const user = await new this({ username })
				.fetch({ require: false });
			if (!user) {
				return false;
			}
			// get hashed password from db
			const hash = user.get('password');

			// generate hash of cleartect password
			// compare new hash with hash from db
			const result = await bcrypt.compare(password, hash);
			// return user if hashes match, otherwise false
			return (result)
				? user
				: false;
		}
	});
 }
