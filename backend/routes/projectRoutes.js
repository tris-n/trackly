// Express Router
import express from 'express'
const router = express.Router()

// Controllers
import { 
	createProject, 
	getAllProjects,
	getSingleProject,
	updateProject,
	deleteProject,
} from '../controllers/projectController.js'

// Middleware
import { protect } from '../middleware/authMiddleware.js'

// Routes
// Create
router.post('/createProject', protect, createProject)

// Read
router.get('/getAllProjects', protect, getAllProjects)
router.get('/getSingleProject/:projectId', protect, getSingleProject)

// Update
router.put('/updateProject/:projectId', protect, updateProject)

// Delete
router.delete('/deleteProject/:projectId', protect, deleteProject)

export default router