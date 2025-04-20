import asyncHandler from 'express-async-handler'

// Models
import Project from '../models/Project.js'
import Ticket from '../models/Ticket.js'



// @desc 	Create a new project
// @route 	/api/projects/createProject
// @access 	Private
export const createProject = asyncHandler( async (req, res) => {

	// check that user is authorised to create/modify
	const role = req.user.role

	if (!(role === 'Admin' || role === 'Project Manager')) {
		res.status(401)
		throw new Error('Not authorised to create projects')
	}

	// get field info from req.body
	let {
		name, 
		description, 
		projectManagerId,
	} = req.body

	// Validation
	if (!name || !description) {
		res.status(400)
		throw new Error('Please include all fields')
	}

	// Create project
	const project = await Project.create({
		name, 
		description, 
		projectManagerId,
		creatorId: req.user._id,
	})

	if (project) {
		res.status(201).json(project)
	} else {
		res.status(400)
		throw new Error('Invalid project data')
	}

})



// @desc 	Get all projects
// @route 	/api/projects/getAllProjects
// @access 	Private
export const getAllProjects = asyncHandler( async (req, res) => {

	const role = req.user.role

	if (role === 'Admin' || role === 'Project Manager' || role === 'Developer' || role === 'Submitter') {

		const projects = await Project.find(req.query)
			.populate('projectManagerId', 'name')

		// find tickets based on project Ids
		// get project ids
		const projectIds = projects.map((project) => project._id)
		
		// create list of tickets using those project ids
		const ticketCounts = await Ticket.find({ projectId: { $in: projectIds}})
			.select('projectId')

		// sort the tickets based on projectId
		const ticketCountMap = {}
		ticketCounts.forEach((ticket) => {
			const projectId = ticket.projectId.toString()
			ticketCountMap[projectId] = (ticketCountMap[projectId] || 0) + 1
		})

		// add ticket count to project and set the project manager name
		projects.forEach((project) => {
			project.ticketCount = ticketCountMap[project._id.toString()] || 0
			project.projectManagerName = project.projectManagerId ? project.projectManagerId.name : 'zzzzz'
		})
		
		res.status(200).json(projects)

	} else {
		res.status(401)
		throw new Error('Not authorised to view all projects')
	}

})



export const getSingleProject = asyncHandler( async (req, res) => {

	const project = await Project.findById(req.params.projectId)
		.populate('projectManagerId', 'name')
		.populate('ticketCount')
		.populate('ticketsOpen')
	
	if (!project) {
		res.status(401)
		throw new Error('Project not found')
	}

	res.status(200).json(project)

})



// @desc 	Update single project
// @route 	/api/projects/updateProject
// @access 	Private
export const updateProject = asyncHandler( async (req, res) => {

	// Check if authorised to update
	const role = req.user.role

	if (!( role === 'Admin' || role === 'Project Manager')) {
		res.status(401)
		throw new Error('Not authorised to update this project')
	}

	let update = req.body

	// Update the project
	const updatedProject = await Project.findByIdAndUpdate(req.params.projectId, update, { new: true, runValidators: true })

	// Check if project exists
	if (!updatedProject) {
		res.status(401)
		throw new Error('Project not found')
	}

	res.status(200).json(updatedProject)

})



// @desc 	Delete single project
// @route 	/api/projects/deleteProject
// @access 	Private
export const deleteProject = asyncHandler( async (req, res) => {

	// Check if authorised to update/delete
	const role = req.user.role
	if (!(role === 'Admin' || role === 'Project Manager')) {
		res.status(401)
		throw new Error('Not authorised to delete this project')
	}

	const deletedProject = await Project.findOneAndDelete({ _id: req.params.projectId })

	if (!deletedProject) {
		res.status(401)
		throw new Error('Project not found')
	}

	// Delete associated Tickets
	const deletedTickets = await Ticket.deleteMany({ projectId: req.params.projectId })

	res.status(200).json({ deletedProject, deletedTickets, success: true })

})