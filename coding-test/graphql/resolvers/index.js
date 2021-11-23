const resolversArticle = require('./article')
const resolversComment = require('./comment')

/**
 * @description all defination resolvers here
 */

module.exports = {
	Query: {
		...resolversArticle.Query,
		...resolversComment.Query
	},
	Mutation: {
		...resolversArticle.Mutation,
		...resolversComment.Mutation
	}
}
