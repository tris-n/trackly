import asyncHandler from 'express-async-handler'

// Models
import Comment from '../models/Comment.js'



// @desc 	Create a new comment
// @route 	/api/comments/createComment
// @access 	Private
export const createComment = asyncHandler( async (req, res) => {

	// check that user is authorised to create/modify
	const role = req.user.role

	if (!role) {
		res.status(401)
		throw new Error('Not authorised to create comments')
	}

	// get field info from req.body
	let {
		ticketId,
		description,
	} = req.body

	// Validation
	if (!description) {
		res.status(400)
		throw new Error('Please include all fields')
	}

	// Create comment
	const comment = await Comment.create({
		ticketId,
		description,
		creatorId: req.user._id,
	})

	if (comment) {
		res.status(201).json(comment)
	} else {
		res.status(400)
		throw new Error('Invalid comment data')
	}

})



export const getAllComments = asyncHandler(async (req, res) => {

	let query = req.query.query ? { $or: req.query.query } : {}
  
	const comments = await Comment.find(query).populate('creatorId', 'name')
  
	res.status(200).json(comments)

})



// @desc 	Get single comment
// @route 	/api/comments/getSingleComment
// @access 	Private
export const getSingleComment = asyncHandler( async (req, res) => {

	// Get comment id to search
	const comment = await Comment.findById(req.params.commentId)

	if (!comment) {
		res.status(401)
		throw new Error('Comment not found')
	}

	res.status(200).json(comment)

})



// @desc 	Update single comment
// @route 	/api/comments/updateComment
// @access 	Private
export const updateComment = asyncHandler( async (req, res) => {

	// Check if authorised to update
	const role = req.user.role

	if (!role) {
		res.status(401)
		throw new Error('Not authorised to update this comment')
	}

	// Get update from req.body
	let update = req.body

	// Update the comment
	const updatedComment = await Comment.findByIdAndUpdate(req.params.commentId, update, { new: true, runValidators: true })

	// Check if comment exists
	if (!updatedComment) {
		res.status(401)
		throw new Error('Comment not found')
	}

	res.status(200).json(updatedComment)

})



// @desc 	Delete single comment
// @route 	/api/comments/deleteComment
// @access 	Private
export const deleteComment = asyncHandler( async (req, res) => {

	// Check if authorised to update/delete
	const role = req.user.role
	if (!role) {
		res.status(401)
		throw new Error('Not authorised to delete this comment')
	}

	const deletedComment = await Comment.findOneAndDelete({ _id: req.params.projectId })

	if (!deletedComment) {
		res.status(401)
		throw new Error('Commnet not found')
	}

	res.status(200).json({ deletedComment, success: true })

})