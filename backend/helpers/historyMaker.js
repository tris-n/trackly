// Models
import History from '../models/History.js'
import Project from '../models/Project.js'
import User from '../models/User.js'



// Saves the history to the database
const historyMaker = async (creator, summary, docType, document, updatedDocument) => {

	// summary types: create, update, delete
	let description = `${summary}d the ${docType}.`
	let changes = []
	
	// UPDATE TICKET INFORMATION
	if (summary === 'update' && docType === 'Ticket') {

		// Trim the objects for comparison
		let documentTrimmed = document.toObject()
		delete documentTrimmed._id
		delete documentTrimmed.createdAt
		delete documentTrimmed.updatedAt
		delete documentTrimmed.__v

		let updatedDocumentTrimmed = updatedDocument
		delete updatedDocumentTrimmed._id
		delete updatedDocumentTrimmed.createdAt
		delete updatedDocumentTrimmed.updatedAt
		delete updatedDocumentTrimmed.__v

		// exclusive to updatedDocumentTrimmed
		delete updatedDocumentTrimmed.projectName
		delete updatedDocumentTrimmed.creatorName
		delete updatedDocumentTrimmed.assignedName
		delete updatedDocumentTrimmed.overDue

		if (updatedDocumentTrimmed.assignedId === null) {
			delete updatedDocumentTrimmed.assignedId
		}

		if (updatedDocumentTrimmed.dueDate.toString().indexOf('1970') !== -1) {
			delete updatedDocumentTrimmed.dueDate
		}

		// Compare Objects
		const compareObjects = async (obj1, obj2) => {
			
			// if original document DOESNT have the changed field
			for (let prop in obj2) {
			
				if (!obj1.hasOwnProperty(prop)) {

					let change

					if (prop === "assignedId") {
						let assignedNew = await User.findById(obj2[prop])
						change = {
							field: "assigned user",
							old: "none",
							new: assignedNew.name,
						}

					} else if (prop === "projectId") {
						let projectNew = await Project.findById(obj2[prop])
						change = {
							field: "project",
							old: "none",
							new: projectNew.name,
						}

					} else if (prop === "dueDate") {
						change = {
							field: "due date",
							old: "none",
							new: obj2[prop],
						}

					} else {
						change = {
							field: prop,
							old: obj1[prop],
							new: obj2[prop],
						}
					}

					changes.push(change)

				} else if (obj1[prop].toString() !== obj2[prop].toString()) {

					let change

					if (prop === "assignedId") {

						let foundUsers = await User.find({_id: {$in: [obj1[prop], obj2[prop]]}})

						let assignedOld = foundUsers.find((user) => user._id.toString() === obj1[prop].toString())
						let assignedNew = foundUsers.find((user) => user._id.toString() === obj2[prop].toString())

						change = {
							field: "assigned user",
							old: assignedOld.name,
							new: assignedNew.name,
						}

					} else if (prop === "projectId") {

						let foundProjects = await Project.find({_id: {$in: [obj1[prop], obj2[prop]]}})

						let projectOld = foundProjects.find((project) => project._id.toString() === obj1[prop].toString())
						let projectNew = foundProjects.find((project) => project._id.toString() === obj2[prop].toString())

						change = {
							field: "project",
							old: projectOld.name,
							new: projectNew.name,
						}

					} else if (prop === "dueDate") {
						change = {
							field: "due date",
							old: obj1[prop],
							new: obj2[prop],
						}

					} else {
						change = {
							field: prop,
							old: obj1[prop],
							new: obj2[prop],
						}
					}

					changes.push(change)

				}
			}
		}

		await compareObjects(documentTrimmed, updatedDocumentTrimmed)

	}



	// FILE UPLOAD
	if (summary === 'upload') {
		description = `attached ${updatedDocument.attachments.length} file${updatedDocument.attachments.length > 1 ? 's' : ""} to the Ticket.`

		let fileNamesArray = updatedDocument.attachments.map((attachment) => attachment.name)
		let fileNames = fileNamesArray.join(", ")

		let change = {
			field: 'attachments',
			old: "",
			new: fileNames
		}

		changes.push(change)
	}



	// DELETE FILE
	if (summary === 'deleteFile') {
		description = `deleted ${updatedDocument.deletedFile} from the Ticket.`
	}

	// create the history document
	const history = await History.create({
		[`${docType.toLowerCase()}Id`]: document._id,
		creatorId: creator._id,
		summary: description,
		changes: changes
	})

	if (history) {
		console.log(`History created:`, history)
	} else {
		throw new Error('There was an error creating history.')
	}

}

export default historyMaker