// Express Router
import express from 'express'
const router = express.Router()

// Controllers
import { 
	createComment, 
	getAllComments,
	getSingleComment,
	updateComment,
	deleteComment,
} from '../controllers/commentController.js'

// Middleware
import { protect } from '../middleware/authMiddleware.js'



// Routes
// Create
router.post('/createComment', protect, createComment)

// Read
router.get('/getAllComments', protect, getAllComments)
router.get('/getSingleComment/:commentId', protect, getSingleComment)

// Update
router.put('/updateComment/:commentId', protect, updateComment)

// Delete
router.delete('/deleteComment/:commentId', protect, deleteComment)

export default router