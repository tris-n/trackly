import mongoose from 'mongoose'



const backupSchema = mongoose.Schema({
	comments: {
		type: Object,
		required: [true, 'Please add comments to the backup object.']
	},
	histories: {
		type: Object,
		required: [true, 'Please add histories to the backup object.']
	},
	projects: {
		type: Object,
		required: [true, 'Please add projects to the backup object.']
	},
	tickets: {
		type: Object,
		required: [true, 'Please add tickets to the backup object.']
	},
	users: {
		type: Object,
		required: [true, 'Please add users to the backup object.']
	},
}, {
	timestamps: true
})



const Backup = mongoose.model('Backup', backupSchema)
export default Backup