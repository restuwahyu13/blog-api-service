const comment = require('../../models/comment')

module.exports = {
	Query: {
		async resultAllComment(root, args, ctx) {
			try {
				const getComments = await comment
					.find()
					.populate('articleId', ['_id', 'title', 'description', 'content', 'category', 'image', 'tags'])
					.lean()

				if (!getComments.length) {
					throw { code: 404, message: `Comments data not found` }
				}

				return { code: 200, message: 'Comments data already to use', data: getComments }
			} catch (e) {
				throw { code: e.code, message: e.message }
			}
		},
		async resultAllCommentById(root, { id }, ctx) {
			try {
				const getComments = await comment
					.find({ $and: [{ articleId: id }] })
					.populate('articleId', ['_id', 'title', 'description', 'content', 'category', 'image', 'tags'])
					.lean()

				if (!getComments.length) {
					throw { code: 404, message: `Comments data not found` }
				}

				return { code: 200, message: 'Comments data already to use', data: getComments }
			} catch (e) {
				throw { code: e.code, message: e.message }
			}
		},
		async resultCommentById(root, { id }, ctx) {
			try {
				const getComment = await comment
					.findById(id)
					.populate('articleId', ['_id', 'title', 'description', 'content', 'category', 'image', 'tags'])
					.lean()

				if (!getComment) {
					throw { code: 404, message: `Comment data is no exist for this id ${id}, or deleted from owner` }
				}

				return { code: 200, message: 'Comment data already to use', data: getComment }
			} catch (e) {
				throw { code: e.code, message: e.message }
			}
		}
	},
	Mutation: {
		async createComment(root, { input }, ctx) {
			try {
				const addComment = await comment.create({ text: input.text, articleId: input.articleId })

				if (!addComment) {
					throw { code: 403, message: `Created new comment failed` }
				}

				return { code: 201, message: 'Created new comment success' }
			} catch (e) {
				throw { code: e.code, message: e.message }
			}
		},
		async deleteComment(root, { id }, ctx) {
			try {
				const checkComment = await comment.findById(id).lean()

				if (!checkComment) {
					throw { code: 404, message: `Comment data is no exist for this id ${id}, or deleted from owner` }
				}

				const deleteComment = await comment.findByIdAndDelete(id).lean()

				if (!deleteComment) {
					throw { code: 403, message: `Deleted comment failed` }
				}

				return { code: 200, message: 'Deleted comment success' }
			} catch (e) {
				throw { code: e.code, message: e.message }
			}
		},
		async updateComment(root, { input, id }, ctx) {
			try {
				const checkComment = await comment.findById(id).lean()

				if (!checkComment) {
					throw { code: 404, message: `Comment data is no exist for this id ${id}, or deleted from owner` }
				}

				const updateComment = await comment.updateOne({ _id: id }, { text: input.text, articleId: input.articleId })

				if (!updateComment) {
					throw { code: 403, message: `Updated comment failed` }
				}

				return { code: 200, message: 'Updated comment success' }
			} catch (e) {
				throw { code: e.code, message: e.message }
			}
		}
	}
}
