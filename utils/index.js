const crypto = require('crypto')

function encryptPassword(password, salt) {
	const hash = crypto.createHash('sha256')
	hash.update(password + salt)
	return hash.digest('hex')
}