require('dotenv/config')
const mongoose = require('mongoose')
const http = require('http')
const express = require('express')
const { ApolloServer } = require('apollo-server-express')
const { applyMiddleware } = require('graphql-middleware')
const { makeExecutableSchema } = require('@graphql-tools/schema')
const { graphqlUploadExpress } = require('graphql-upload')
const { gtl } = require('gtl-node')
const bodyParser = require('body-parser')
const helmet = require('helmet')
const cors = require('cors')
const compression = require('compression')
const zlib = require('zlib')
const logger = require('morgan')

;(async function () {
	/**
	 * @description initialize typedefs and resolvers
	 */

	const resolvers = require('./graphql/resolvers')
	const typeDefs = gtl({ directory: 'graphql/typedefs', pattern: '**/*', extension: 'graphql' })

	/**
	 * @description initialize application here
	 */

	const app = express()
	const server = http.createServer(app)
	const apollo = new ApolloServer({
		schema: applyMiddleware(makeExecutableSchema({ typeDefs, resolvers })),
		formatError: ({ name, message, path }) => ({
			name,
			message: message.replace('Unexpected error value: ', ''),
			path
		})
	})

	/**
	 * @description init database connection
	 */
	mongoose.Promise = global.Promise
	mongoose
		.connect(process.env.MONGO_URI)
		.then(() => {
			if (process.env.NODE_ENV !== 'production') console.info('Database connected')
		})
		.catch((e) => {
			if (process.env.NODE_ENV !== 'production') console.error(`Database not connected: ${e.message}`)
		})

	/**
	 * @description initialize express middleware here
	 */

	app.use(bodyParser.json({ limit: '5mb' }))
	app.use(bodyParser.urlencoded({ extended: false }))
	app.use(helmet({ contentSecurityPolicy: false }))
	app.use(
		cors({
			allowedHeaders: ['Content-Type', 'Accept', 'Authorization'],
			exposedHeaders: ['Content-Type', 'Accept', 'Authorization'],
			methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
			credentials: true
		})
	)
	app.use(
		compression({
			level: zlib.constants.Z_BEST_COMPRESSION,
			memLevel: zlib.constants.Z_BEST_COMPRESSION,
			strategy: zlib.constants.Z_RLE
		})
	)
	app.use(graphqlUploadExpress({ maxFiles: 1, maxFieldSize: 2000000 }))
	if (process.env.NODE_ENV !== 'production') {
		app.use(logger('dev'))
	}

	/**
	 * @description initialize run server here
	 */

	await apollo.start()
	apollo.applyMiddleware({ app })
	server.listen(process.env.PORT || 3000, () => console.log(`Apollo server running on ${server.address().port}`))
})()
