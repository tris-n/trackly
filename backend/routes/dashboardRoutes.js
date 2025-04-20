// Express Router
import express from 'express'
const router = express.Router()

// Controllers
import { 
	getDashboard,
} from '../controllers/dashboardController.js'

// Middleware
import { protect } from '../middleware/authMiddleware.js'

// Routes
// Read
router.get('/getDashboard', protect, getDashboard)

export default router