import mongoose from 'mongoose'



const historySchema = mongoose.Schema({
	projectId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Project',
	},
	ticketId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Ticket',
	},
	commentId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Comment',
	},
	creatorId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: [true, 'Please assign a creator']
	}, 
	summary: {
		type: String,
		required: [true, 'Please add a summary']
	},
	creatorName: {
		type: String,
	},
	changes: {
		type: Array,
	}
}, {
	timestamps: true
})



const History = mongoose.model('History', historySchema)
export default History