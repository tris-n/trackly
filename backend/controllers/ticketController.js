import asyncHandler from 'express-async-handler'

// Models
import Ticket from '../models/Ticket.js'

// Helpers
import historyMaker from '../helpers/historyMaker.js'



// @desc 	Create a new ticket
// @route 	/api/tickets/createTicket
// @access 	Private
export const createTicket = asyncHandler( async (req, res) => {

	// check that user is authorised to create/modify
	const role = req.user.role

	if (!role) {
		res.status(401)
		throw new Error('Not authorised to create tickets')
	}

	// get field info from req.body
	let {
		projectId,
		priority,
		status,
		type,
		assignedId,
		name, 
		description,
		archived,
		dueDate,
	} = req.body


	// Validation
	if (!name || !description) {
		res.status(400)
		throw new Error('Please include all fields')
	}

	// Create ticket
	const ticket = await Ticket.create({
		projectId,
		priority,
		status,
		type,
		creatorId: req.user._id,
		assignedId,
		name, 
		description,
		archived,
		dueDate,
	})

	if (ticket) {

		// // Create history
		await historyMaker(req.user, 'create', 'Ticket', ticket)
		res.status(201).json(ticket)

	} else {
		res.status(400)
		throw new Error('Invalid ticket data')
	}

})



// @desc 	Get all tickets
// @route 	/api/tickets/getAllTickets
// @access 	Private
// requests 1
export const getAllTickets = asyncHandler(async (req, res) => {

	const role = req.user.role
		
	if (role === 'Admin' || role === 'Project Manager' || role === 'Developer' || role === 'Submitter') {
		
		let query = {}
		let queryType = 'all'
		
		if (req.query.query) {
			queryType = req.query.query[0].queryType
			query = { $or: req.query.query }
		}
		
		const tickets = await Ticket.find(query)
			.populate('projectId', 'name')
			.populate('creatorId', 'name')
			.populate('assignedId', 'name')
			.exec()
				
		const populatedTickets = tickets.map((ticket) => {
			return {
				...ticket.toObject(),
				projectId: ticket.projectId._id,
				projectName: ticket.projectId.name,
				creatorId: ticket.creatorId._id,
				creatorName: ticket.creatorId.name,
				assignedId: ticket.assignedId ? ticket.assignedId._id : null,
				assignedName: ticket.assignedId ? ticket.assignedId.name : 'zzzzz',
				dueDate: ticket.dueDate || 0,
				overDue: ticket.dueDate < new Date(),
			}
		})

		// attach the query type
		populatedTickets.unshift({
			queryType: queryType
		})
		
		res.status(200).json(populatedTickets)

	} else {
		res.status(401)
		throw new Error('Not authorized to view all tickets')
	}
})



export const getSingleTicket = asyncHandler(async (req, res) => {

	const ticketId = req.params.ticketId
	
	const ticket = await Ticket.findById(ticketId)
		.populate('projectId', 'name')
		.populate('creatorId', 'name')
		.populate('assignedId', 'name')
	
	const populatedTicket = {
		...ticket.toObject(),
		projectId: ticket.projectId._id,
		projectName: ticket.projectId.name,
		creatorId: ticket.creatorId._id,
		creatorName: ticket.creatorId.name,
		assignedId: ticket.assignedId ? ticket.assignedId._id : null,
		assignedName: ticket.assignedId ? ticket.assignedId.name : 'zzzzz',
		dueDate: ticket.dueDate || 0,
		overDue: ticket.dueDate < new Date(),
	}
  
	if (!populatedTicket || populatedTicket.length === 0) {
		res.status(404)
		throw new Error("Ticket not found")
	}

	res.status(200).json(populatedTicket)
})



export const updateTicket = asyncHandler( async (req, res) => {

	// Get ticket id to update
	const ticket = await Ticket.findById(req.params.ticketId)

	// Check if ticket exists
	if (!ticket) {
		res.status(401)
		throw new Error('Ticket not found')
	}

	// Check if authorised to update
	const role = req.user.role

	if (!role) {
		res.status(401)
		throw new Error('Not authorised to update this ticket')
	}

	// Get update from req.body
	let update = req.body

	// Create updated Ticket
	let updatedTicket
	
	// check the update type
	if (update.updateType === "upload") {
		// Add file attachments
		let attachments = update.attachments
		updatedTicket = await Ticket.findByIdAndUpdate(ticket, { $push: { attachments: { $each: attachments}} }, { new: true, runValidators: true })
			.populate('projectId', 'name')
			.populate('creatorId', 'name')
			.populate('assignedId', 'name')
	} else {
		// Update the ticket
		updatedTicket = await Ticket.findByIdAndUpdate(ticket, update, { new: true, runValidators: true })
			.populate('projectId', 'name')
			.populate('creatorId', 'name')
			.populate('assignedId', 'name')
	}
	
	const populatedTicket = {
		...updatedTicket.toObject(),
		projectId: updatedTicket.projectId._id,
		projectName: updatedTicket.projectId.name,
		creatorId: updatedTicket.creatorId._id,
		creatorName: updatedTicket.creatorId.name,
		assignedId: updatedTicket.assignedId ? updatedTicket.assignedId._id : null,
		assignedName: updatedTicket.assignedId ? updatedTicket.assignedId.name : 'zzzzz',
		dueDate: updatedTicket.dueDate || '1970-01-01',
		overDue: updatedTicket.dueDate < new Date(),
	}

	// Create history
	if (update.updateType === "upload" || update.updateType === "deleteFile") {
		await historyMaker(req.user, update.updateType, 'Ticket', ticket, update)
	} else {
		await historyMaker(req.user, update.updateType, 'Ticket', ticket, populatedTicket)
	}
	
	res.status(200).json(populatedTicket)
})



// @desc 	Delete single ticket
// @route 	/api/tickets/deleteTicket
// @access 	Private
export const deleteTicket = asyncHandler( async (req, res) => {

	// Check if authorised to update/delete
	const role = req.user.role
	if (!(role === 'Admin' || role === 'Project Manager')) {
		res.status(401)
		throw new Error('Not authorised to delete this ticket')
	}

	const deletedTicket = await Ticket.findOneAndDelete({ _id: req.params.ticketId })

	if (!deletedTicket) {
		res.status(401)
		throw new Error('Ticket not found')
	}

	res.status(200).json({ deletedTicket, success: true })

})