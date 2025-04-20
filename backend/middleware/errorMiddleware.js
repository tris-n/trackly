export const errorHandler = (error, req, res, next) => {

	const statusCode = res.statusCode < 400 ? 500 : res.statusCode
	res.status(statusCode)

	res.json({
		message: error.message,
		stack: process.env.NODE_ENV === 'production' ? null : error.stack
	})
	
}