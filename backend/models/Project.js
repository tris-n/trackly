import mongoose from 'mongoose'



const projectSchema = mongoose.Schema({
	name: {
		type: String,
		required: [true, 'Please add a project name'],
		unique: true
	},
	description: {
		type: String,
		required: [true, 'Please add a project description']
	},
	creatorId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: [true, 'Please add a creator']
	}, 
	projectManagerId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
	}, 
	projectManager: {
		type: mongoose.Schema.Types.Mixed
	},
	projectManagerName: {
		type: String,
	},
}, {
	timestamps: true,
	toObject: { virtuals: true },
	toJSON: { virtuals: true }
})

// Define virtual properties on the Project schema
projectSchema.virtual('ticketCount', {
	ref: 'Ticket',
	localField: '_id',
	foreignField: 'projectId',
	count: true,
})
  
  // Virtual field for open ticket count
projectSchema.virtual('ticketsOpen', {
	ref: 'Ticket',
	localField: '_id',
	foreignField: 'projectId',
	match: { status: { $ne: 'Done' } },
	count: true,
})



const Project = mongoose.model('Project', projectSchema)
export default Project