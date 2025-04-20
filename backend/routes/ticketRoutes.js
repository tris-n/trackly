// Express Router
import express from 'express'
const router = express.Router()

// Controllers
import { 
	createTicket, 
	getAllTickets,
	getSingleTicket,
	updateTicket,
	deleteTicket,
} from '../controllers/ticketController.js'

// Middleware
import { protect } from '../middleware/authMiddleware.js'



// Routes
// Create
router.post('/createTicket', protect, createTicket)

// Read
router.get('/getAllTickets', protect, getAllTickets)
router.get('/getSingleTicket/:ticketId', protect, getSingleTicket)

// Update
router.put('/updateTicket/:ticketId', protect, updateTicket)

// Delete
router.delete('/deleteTicket/:ticketId', protect, deleteTicket)

export default router