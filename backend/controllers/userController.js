import asyncHandler from 'express-async-handler'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

// Models
import User from '../models/User.js'
import Ticket from '../models/Ticket.js'

// Generate token
const generateToken = (id) => {
	return jwt.sign({id}, process.env.JWT_SECRET, {
		expiresIn: '30d'
	})
}



// @desc 	Register a new user
// @route 	/api/users/register
// @access 	Public
export const registerUser = asyncHandler( async (req, res) => {

	const {name, email, password, role} = req.body

	// Validation
	if (!name || !email || !password || !role) {
		res.status(400)
		throw new Error('Please include all fields')
	}

	// Find if user already exists
	const userExists = await User.findOne({email})

	if (userExists) {
		res.status(400)
		throw new Error('User already exists')
	}

	// Hash password
	const salt = await bcrypt.genSalt(10)
	const hashedPassword = await bcrypt.hash(password, salt)

	// Create user
	const user = await User.create({
		name,
		email,
		password: hashedPassword,
		role,
	})

	if (user) {
		res.status(201).json({
			_id: user._id,
			name: user.name,
			email: user.email,
			role: user.role,
			token: generateToken(user._id),
		})
	} else {
		res.status(400)
		throw new Error('Invalid user data')
	}

})



// @desc 	Create a new user - when a user creates another user - not solo registration
// @route 	/api/users/create
// @access 	Private
export const createUser = asyncHandler( async (req, res) => {

	const {name, email, password, role} = req.body

	// Validation
	if (!name || !email || !password || !role) {
		res.status(400)
		throw new Error('Please include all fields')
	}

	// Find if user already exists
	const userExists = await User.findOne({email})

	if (userExists) {
		res.status(400)
		throw new Error('User already exists')
	}

	// Hash password
	const salt = await bcrypt.genSalt(10)
	const hashedPassword = await bcrypt.hash(password, salt)

	// Create user
	const user = await User.create({
		name,
		email,
		password: hashedPassword,
		role,
	})

	if (user) {
		res.status(201).json({
			_id: user._id,
			name: user.name,
			email: user.email,
			role: user.role,
		})
	} else {
		res.status(400)
		throw new Error('Invalid user data')
	}

})



// @desc 	Login a user
// @route 	/api/users/login
// @access 	Public
export const loginUser = asyncHandler( async (req, res) => {

	const {email, password} = req.body

	const user = await User.findOne({email})
	
	// Check user and passwords match
	if (user && (await bcrypt.compare(password, user.password))) {
		res.status(200).json({
			_id: user._id,
			name: user.name,
			email: user.email,
			role: user.role,
			website: process.env.WEBSITE,
			token: generateToken(user._id),
		})
	} else {
		res.status(401)
		throw new Error('Invalid credentials')
	}
})



// @desc 	Get all users
// @route 	/api/users/getAllUsers
// @access 	Private
// requests 1
export const getAllUsers = asyncHandler( async (req, res) => {

	const role = req.user.role

	if (role === 'Admin' || role === 'Project Manager' || role === 'Developer' || role === 'Submitter') {

		let users = await User.find(req.query)
			.select('-password -createdAt -updatedAt')
			.populate('ticketsCreated')
			.populate('ticketsAssigned')
			.sort({ name: 1 })
		
		res.status(200).json(users)

	} else {
		res.status(401)
		throw new Error('Not authorised to view all users')
	}

})



// @desc 	Get single user
// @route 	/api/users/getSingleUser
// @access 	Private
// requests 1
export const getSingleUser = asyncHandler( async (req, res) => {
	
	// Get user id to search
	const user = await User.findById(req.params.userId)
		.select('-password -createdAt -updatedAt')

	if (!user) {
		res.status(401)
		throw new Error('User not found')
	}

	res.status(200).json(user)

})



// @desc 	Update a single user
// @route 	/api/users/updateUser
// @access 	Private
export const updateUser = asyncHandler( async (req, res) => {

	// check if authorised to update/delete
	const role = req.user.role
	if (!(role === 'Admin' || role === 'Project Manager' || req.user.id === req.params.userId)) {
		res.status(401)
		throw new Error('Not authorised to update this user')
	}

	const update = {
		name: req.body.name,
		email: req.body.email,
		role: req.body.role,
	}

	// Update the User document
	const updatedUser = await User.findByIdAndUpdate(req.params.userId, update, { new: true, runValidators: true })
		.select('-password -createdAt -updatedAt')

	if (!updatedUser) {
		res.status(401)
		throw new Error('User not found')
	}

	res.status(200).json(updatedUser)

})



// @desc 	Delete a single user
// @route 	/api/users/deleteUser
// @access 	Private
export const deleteUser = asyncHandler( async (req, res) => {

	// check if authorised to update/delete
	const role = req.user.role
	if (!(role === 'Admin' || role === 'Project Manager' || req.user.id === req.params.userId)) {
		res.status(401)
		throw new Error('Not authorised to delete this user')
	}

	// Get the userId to delete
	const { userId } = req.params

	// Delete user and get deleted user details
	const deletedUser = await User.findOneAndDelete({ _id: userId })

	if (!deletedUser) {
		res.status(401)
		throw new Error('User not found')
	}

	// Delete tickets created by the user or assigned to them
	const [deletedTicketsResult, updatedTicketsResult] = await Promise.all([
		Ticket.deleteMany({ creatorId: userId }),
		Ticket.updateMany({ assignedId: userId }, { assignedId: null })
	])

	const deletedUserInfo = {
		user: deletedUser,
		deletedTickets: deletedTicketsResult.deletedCount,
		updatedTickets: updatedTicketsResult.matchedCount,
		success: true 
	}

	res.status(200).json(deletedUserInfo)

})