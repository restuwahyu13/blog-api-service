const { resolve } = require('path')
const { createWriteStream } = require('fs')

const uploadFile = ({ filename, stream }) => {
	let linux = '/tmp'
	let window = process.env.TEMP || ''

	if (process.platform !== 'win32') {
		stream.pipe(createWriteStream(resolve(process.cwd(), `${linux}/${filename}`)))
	} else {
		stream.pipe(createWriteStream(resolve(process.cwd(), `${window}/${filename}`)))
	}
}

const validateFile = ({ filename, stream }) => {
	const extFile = filename.replace('.', '')
	const extPattern = /(jpg|jpeg|png|gif)/gi.test(extFile)

	if (!extPattern) throw new TypeError('Image format is not valid')
	else return uploadFile({ filename, stream })
}

exports.fileUpload = ({ filename, stream }) => (filename ? validateFile({ filename, stream }) : new Error('Image is required'))
