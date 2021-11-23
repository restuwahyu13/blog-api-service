const mongoose = require('mongoose')
const shortid = require('shortid')

const ArticleSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true
		},
		description: {
			type: String,
			required: true
		},
		content: {
			type: String,
			required: true
		},
		category: {
			type: String,
			required: true
		},
		image: {
			type: String,
			required: true
		},
		tags: {
			type: Array,
			required: true
		},
		postBy: {
			type: String,
			default: shortid.generate() // for generate fake id user, for get created article by specific user
		}
	},
	{ timestamps: true }
)

module.exports = mongoose.model('article', ArticleSchema)
