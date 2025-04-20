import asyncHandler from 'express-async-handler'

// Models
import Backup from '../models/Backup.js'
import Comment from '../models/Comment.js'
import History from '../models/History.js'
import Project from '../models/Project.js'
import Ticket from '../models/Ticket.js'
import User from '../models/User.js'



// Get the current time
export const timeNow = () => {
	return new Date().toLocaleString()
}



// BACKUP COLLECTIONS - ONLY RUN WHEN HAPPY WITH CURRENT DB STATE
export const backupCollections = asyncHandler( async (req, res) => {

	// Get all collections
	const comments = await Comment.find()	
	const histories = await History.find()	
	const projects = await Project.find()	
	const tickets = await Ticket.find()	
	const users = await User.find()	


	// Create backup
	const backup = await Backup.create({
		comments,
		histories,
		projects,
		tickets,
		users
	})

	if (backup) {
		console.log(`Backup successfully created at ${timeNow()}.`)
	} else {
		throw new Error(`There was an error with backup at ${timeNow()}.`)	
	}

})



// ROLLBACK DATABASE - RUN EVERY 24 HOURS TO ROLLBACK TO GOOD DB STATE
export const automatedRollback = asyncHandler( async (req, res) => {

	console.log(`Automated rollback running.`)

	// run once on start
	await repopulateCollections()

	// then run every 24 hours (start with 2 minutes 120,000)
	// 24 * 60 * 60 * 1000 = 86400000
	let updateFrequency = 24 * 60 * 60 * 1000 // 86,400,000 // 1000 = 1second

	setInterval(() => {

		repopulateCollections()

	}, updateFrequency)

})




// DELETE COLLECTIONS
export const deleteCollections = asyncHandler( async (req, res) => {

	// Delete all collections
	const deletedComments = await Comment.deleteMany({})
	if (deletedComments) console.log(`Backup deleted comments at ${timeNow()}.`)

	const deletedHistories = await History.deleteMany({})
	if (deletedHistories) console.log(`Backup deleted history at ${timeNow()}.`)

	const deletedProjects = await Project.deleteMany({})
	if (deletedProjects) console.log(`Backup deleted projects at ${timeNow()}.`)

	const deletedTickets = await Ticket.deleteMany({})
	if (deletedTickets) console.log(`Backup deleted tickets at ${timeNow()}.`)

	const deletedUsers = await User.deleteMany({})
	if (deletedUsers) console.log(`Backup deleted users at ${timeNow()}.`)

	console.log(`\nDeleted all collections at ${timeNow()}.\n`)

})



// POPULATE COLLECTIONS WITH BACKUP
export const repopulateCollections = asyncHandler( async (req, res) => {

	// get latest backup from backup collection
	const backup = await Backup.findOne().sort({ createdAt: -1 })
	if (backup) console.log(`\nBackup grabbed the backup at ${timeNow()}.\n`)

	// delete the collections
	await deleteCollections()

	// repopulate comments
	for (const comment of backup.comments) {
		const savedComment = await Comment.create(comment)
		if (savedComment) console.log(`Comment saved: ${comment.description} at ${timeNow()}.`)
	}
	console.log(`\nRepopulated comments at ${timeNow()}.\n`)



	// repopulate history
	for (const history of backup.histories) {
		const savedHistory = await History.create(history)
		if (savedHistory) console.log(`History saved: ${history.summary} at ${timeNow()}.`)
	}
	console.log(`\nRepopulated histories at ${timeNow()}.\n`)



	// repopulate projects
	for (const project of backup.projects) {
		const savedProject = await Project.create(project)
		if (savedProject) console.log(`Project saved: ${project.name} at ${timeNow()}.`)
	}
	console.log(`\nRepopulated projects at ${timeNow()}.\n`)



	// repopulate tickets
	for (const ticket of backup.tickets) {
		const savedTicket = await Ticket.create(ticket)
		if (savedTicket) console.log(`Ticket saved: ${ticket.name} at ${timeNow()}.`)
	}
	console.log(`\nRepopulated tickets at ${timeNow()}.\n`)



	// repopulate users
	for (const user of backup.users) {
		const savedUser = await User.create(user)
		if (savedUser) console.log(`User saved: ${user.name} at ${timeNow()}.`)
	}
	console.log(`\nRepopulated users at ${timeNow()}.\n`)



	// repopulation complete
	console.log(`\nRepopulation completed at ${timeNow()}.\n`)

})