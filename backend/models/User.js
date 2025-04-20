import mongoose from 'mongoose'



const userSchema = mongoose.Schema({
	name: {
		type: String,
		required: [true, 'Please add a name']
	},
	email: {
		type: String,
		required: [true, 'Please add an email'],
		unique: true
	},
	password: {
		type: String,
		required: [true, 'Please add a password']
	},
	role: {
		type: String,
		required: [true, 'Please select a role'],
		enum: ['Admin', 'Project Manager', 'Developer', 'Submitter'],
	},
}, {
	timestamps: true,
	toObject: { virtuals: true },
	toJSON: { virtuals: true }
})

// Define virtual properties on the User schema
userSchema.virtual('ticketsCreated', {
	ref: 'Ticket',
	localField: '_id',
	foreignField: 'creatorId',
	count: true
})
  
userSchema.virtual('ticketsAssigned', {
	ref: 'Ticket',
	localField: '_id',
	foreignField: 'assignedId',
	count: true
})



const User = mongoose.model('User', userSchema)
export default User