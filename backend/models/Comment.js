import mongoose from 'mongoose'



const commentSchema = mongoose.Schema({
	ticketId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Ticket',
		required: [true, 'Please assign to a ticket'],
	},
	creatorId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: [true, 'Please assign a creator']
	}, 
	description: {
		type: String,
		required: [true, 'Please add a comment']
	},
	creatorName: {
		type: String,
	},
}, {
	timestamps: true
})



const Comment = mongoose.model('Comment', commentSchema)
export default Comment