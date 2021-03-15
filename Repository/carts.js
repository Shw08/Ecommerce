const repository = require('./repository')

class cartRepository extends repository {}

module.exports = new cartRepository('carts.json')