import asyncHandler from 'express-async-handler'

// Models
import History from '../models/History.js'
import Comment from '../models/Comment.js'



// @desc 	Create a new history
// @route 	/api/history/createHistory
// @access 	Private
export const createHistory = asyncHandler( async (req, res) => {

	// check that user is authorised to create/modify
	const role = req.user.role

	if (!role) {
		res.status(401)
		throw new Error('Not authorised to create history')
	}

	// get field info from req.body
	let {
		projectId,
		ticketId,
		commentId,
		summary,
	} = req.body

	// Validation
	if (!summary) {
		res.status(400)
		throw new Error('Please include all fields')
	}

	// Create history
	const history = await History.create({
		projectId,
		ticketId,
		commentId,
		creatorId: req.user._id,
		summary,
	})

	if (history) {
		res.status(201).json(history)
	} else {
		res.status(400)
		throw new Error('Invalid history data')
	}

})



export const getAllHistory = asyncHandler( async (req, res) => {

	let query = req.query.query ? { $or: req.query.query } : {}
  
	const history = await History.find(query).populate('creatorId', 'name')

	res.status(200).json(history)

})



export const getAllHistoryAllComments = asyncHandler( async (req, res) => {

	let query = req.query.query ? { $or: req.query.query } : {}
  
	const history = await History.find(query).populate('creatorId', 'name')
	const comments = await Comment.find(query).populate('creatorId', 'name')

	// combine into a single array
	let historyAndComments = history.concat(comments)
	historyAndComments.sort((a, b) => a.createdAt - b.createdAt)

	res.status(200).json(historyAndComments)

})



// @desc 	Get single history
// @route 	/api/history/getSingleHistory
// @access 	Private
export const getSingleHistory = asyncHandler( async (req, res) => {

	// Get history id to search
	const history = await History.findById(req.params.historyId)

	if (!history) {
		res.status(401)
		throw new Error('History not found')
	}

	res.status(200).json(history)

})



// @desc 	Update single history
// @route 	/api/history/updateHistory
// @access 	Private
export const updateHistory = asyncHandler( async (req, res) => {

	// Check if authorised to update
	const role = req.user.role

	if (!role) {
		res.status(401)
		throw new Error('Not authorised to update this history')
	}

	// Get update from req.body
	let update = req.body

	// Update the history
	const updatedHistory = await History.findByIdAndUpdate(req.params.historyId, update, { new: true, runValidators: true })

	// Check if history exists
	if (!updatedHistory) {
		res.status(401)
		throw new Error('History not found')
	}

	res.status(200).json(updatedHistory)

})



// @desc 	Delete single history
// @route 	/api/history/deleteHistory
// @access 	Private
export const deleteHistory = asyncHandler( async (req, res) => {

	// Check if authorised to update/delete
	const role = req.user.role
	if (!role) {
		res.status(401)
		throw new Error('Not authorised to delete this history')
	}

	const deletedHistory = await History.findOneAndDelete({ _id: req.params.historyId })

	if (!deletedHistory) {
		res.status(401)
		throw new Error('History not found')
	}

	res.status(200).json({ history, success: true })

})