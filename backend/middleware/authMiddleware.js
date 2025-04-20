import jwt from 'jsonwebtoken'
import asyncHandler from 'express-async-handler'

// Models
import User from '../models/User.js'



// Checks JWT token, finds the User, passes it on
export const protect = asyncHandler( async (req, res, next) => {

	let token

	if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
		
		try {
			
			// Get token from header
			token = req.headers.authorization.split(' ')[1]

			// Verify token
			const decoded = jwt.verify(token, process.env.JWT_SECRET)

			// Get user from token
			req.user = await User.findById(decoded.id).select('-password')

			if (!req.user) {
				console.log('Not authorised - no user')
				res.status(401)
				throw new Error('Not authorised - no user')
			}

			next()

		} catch (error) {
			console.log(error)
			res.status(401)

			if (error.message === "jwt expired") {
				throw new Error('Session expired')
			} else if (error.message === "invalid signature") {
				throw new Error('Invalid token')
			} else {
				throw new Error('Not authorised')
			}

		}
	}

	if (!token) {
		console.log('Not authorised - no token')
		res.status(401)
		throw new Error('Not authorised - no token')
	}
})