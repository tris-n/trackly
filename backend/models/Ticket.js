import mongoose from 'mongoose'



const ticketSchema = mongoose.Schema({
	projectId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Project',
		required: [true, 'Please assigned to a project'],
	},
	projectName: {
		type: String,
	},
	priority: {
		type: String,
		required: [true, 'Please select a priority'],
		enum: ['Low', 'Medium', 'High', 'Urgent'],
		default: 'High'
	},
	status: {
		type: String,
		required: [true, 'Please select a status'],
		enum: ['To Do', 'In Progress', 'In Review', 'Done'],
		default: 'To Do'
	},
	type: {
		type: String,
		required: [true, 'Please select a type'],
		enum: ['Bug', 'Improvement', 'Task', 'Feature'],
		default: 'Bug'
	},
	creatorId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: [true, 'Please add a creator']
	}, 
	creatorName: {
		type: String,
	},
	assignedId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	}, 
	assignedName: {
		type: String,
	},
	name: {
		type: String,
		required: [true, 'Please add a name']
	},
	description: {
		type: String,
		required: [true, 'Please add a description']
	},
	archived: {
		type: Boolean,
		default: false
	},
	dueDate: {
		type: Date,
	},
	overDue: {
		type: Boolean,
		default: false,
	},
	attachments: {
		type: Array,
	}
}, {
	timestamps: true,
	toObject: { virtuals: true },
	toJSON: { virtuals: true }
})



const Ticket = mongoose.model('Ticket', ticketSchema)
export default Ticket