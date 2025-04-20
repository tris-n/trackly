import asyncHandler from 'express-async-handler'

// Models
import Project from '../models/Project.js'
import User from '../models/User.js'
import Ticket from '../models/Ticket.js'



// @desc 	Get dashboard
// @route 	/api/dashboard/getDashboard
// @access 	Private
export const getDashboard = asyncHandler( async (req, res) => {

	const role = req.user.role

	if (role === 'Admin' || role === 'Project Manager' || role === 'Developer' || role === 'Submitter') {

		const [projects, tickets, users] = await Promise.all([
			Project.find(req.query),
			Ticket.find(req.query)
				.populate('projectId', 'name')
				.populate('creatorId', 'name')
				.populate('assignedId', 'name')
				.exec(),
			User.find(req.query),
		])

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

		let dashboardData = {
			projects,
			tickets: populatedTickets,
			users
		}
		
		res.status(200).json(dashboardData)

	} else {
		res.status(401)
		throw new Error('Not authorised to view dashboard data')
	}

})