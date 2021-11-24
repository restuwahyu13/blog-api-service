const article = require('../../models/article')
const { fileUpload } = require('../../helpers/upload')

module.exports = {
	Query: {
		async resultAllArticle(root, { options }, ctx) {
			try {
				const totalData = await article.find({}).count()
				const limit = options.limit || 10
				const offset = options.offset || 0
				const perPage = Math.ceil(totalData / limit)
				const sort = options.sort === 'asc' ? 1 : -1
				const filter = options.filter.category || ''
				let getArticles

				if (filter !== '') {
					getArticles = await article.aggregate([
						{ $match: { category: filter } },
						{ $sort: { createdAt: sort } },
						{ $limit: limit },
						{ $skip: offset }
					])
				} else {
					getArticles = await article.aggregate([{ $sort: { createdAt: sort } }, { $limit: limit }, { $skip: offset }])
				}

				if (!getArticles.length) {
					throw { code: 404, message: `Articles data not found` }
				}

				return {
					code: 200,
					message: 'Articles data already to use',
					data: {
						total: totalData,
						page: perPage,
						limit: limit,
						offset: offset,
						results: getArticles
					}
				}
			} catch (e) {
				throw { code: e.code, message: e.message }
			}
		},
		async resultArticleById(root, { id }, ctx) {
			try {
				const getArticle = await article.findById(id)

				if (!getArticle) {
					throw { code: 404, message: `Article data is no exist for this id ${id}, or deleted from owner` }
				}

				return { code: 200, message: 'Article data already to use', data: getArticle }
			} catch (e) {
				throw { code: e.code, message: e.message }
			}
		}
	},
	Mutation: {
		async createArticle(root, { input }, ctx) {
			try {
				const checkArticle = await article.findOne({ title: input.title }).lean()

				if (checkArticle) {
					throw { code: 409, message: `Article data already posted` }
				}

				const { filename, createReadStream } = await input.image.promise
				fileUpload({ filename, stream: createReadStream() })

				const addArticle = await article.create({
					title: input.title,
					description: input.description,
					content: input.content,
					category: input.category,
					image: filename,
					tags: input.tags
				})

				if (!addArticle) {
					throw { code: 403, message: `Created new article failed` }
				}

				return { code: 201, message: 'Created  new article success' }
			} catch (e) {
				throw { code: e.code, message: e.message }
			}
		},
		async deleteArticle(root, { id }, ctx) {
			try {
				const checkArticle = await article.findById(id).lean()

				if (!checkArticle) {
					throw { code: 404, message: `Article data is no exist for this id ${id}, or deleted from owner` }
				}

				const deleteArticle = await article.findByIdAndDelete(id).lean()

				if (!deleteArticle) {
					throw { code: 403, message: `Deleted article failed` }
				}

				return { code: 200, message: 'Deleted article success' }
			} catch (e) {
				throw { code: e.code, message: e.message }
			}
		},
		async updateArticle(root, { input, id }, ctx) {
			try {
				const checkArticle = await article.findById(id).lean()

				if (!checkArticle) {
					throw { code: 404, message: `Article data is no exist for this id ${id}, or deleted from owner` }
				}

				const { filename, createReadStream } = await input.image.promise
				fileUpload({ filename, stream: createReadStream() })

				const updateArticle = await article.updateOne(
					{ _id: id },
					{
						title: input.title,
						description: input.description,
						content: input.content,
						category: input.category,
						image: filename,
						tags: input.tags
					}
				)

				if (!updateArticle) {
					throw { code: 403, message: `Updated article failed` }
				}

				return { code: 200, message: 'Updated article success' }
			} catch (e) {
				throw { code: e.code, message: e.message }
			}
		}
	}
}
