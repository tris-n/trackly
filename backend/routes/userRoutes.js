// Express Router
import express from 'express'
const router = express.Router()

// Controllers
import { 
	registerUser, 
	createUser, 
	loginUser, 
	getAllUsers, 
	getSingleUser,
	updateUser,
	deleteUser,
} from '../controllers/userController.js'

// Middleware
import { protect } from '../middleware/authMiddleware.js'

// Routes
// Create
router.post('/registerUser', registerUser)
router.post('/createUser', protect, createUser)
router.post('/loginUser', loginUser)

// Read
router.get('/getAllUsers', protect, getAllUsers)
router.get('/getSingleUser/:userId', protect, getSingleUser)

// Update
router.put('/updateUser/:userId', protect, updateUser)

// Delete
router.delete('/deleteUser/:userId', protect, deleteUser)

export default router