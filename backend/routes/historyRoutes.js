// Express Router
import express from 'express'
const router = express.Router()

// Controllers
import { 
	createHistory, 
	getAllHistory,
	getAllHistoryAllComments,
	getSingleHistory,
	updateHistory,
	deleteHistory,
} from '../controllers/historyController.js'

// Middleware
import { protect } from '../middleware/authMiddleware.js'



// Routes
// Create
router.post('/createHistory', protect, createHistory)

// Read
router.get('/getAllHistory', protect, getAllHistory)
router.get('/getSingleHistory/:historyId', protect, getSingleHistory)
router.get('/getAllHistoryAllComments', protect, getAllHistoryAllComments)

// Update
router.put('/updateHistory/:historyId', protect, updateHistory)

// Delete
router.delete('/deleteHistory/:historyId', protect, deleteHistory)

export default router