const mongoose = require('mongoose')

const CommentSchema = new mongoose.Schema(
	{
		text: {
			type: String,
			required: true
		},
		articleId: {
			type: String,
			required: true,
			ref: 'article'
		}
	},
	{ timestamps: true }
)

module.exports = mongoose.model('comment', CommentSchema)
