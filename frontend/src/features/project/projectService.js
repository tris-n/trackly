import axios from 'axios'



const API_URL = '/api/projects'

// Create Project
// Private
// Sends projectData
const createProject = async (projectData, token) => {

	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	}

	const response = await axios.post(API_URL + '/createProject', projectData, config)

	return response.data

}



// Get All Projects
// Private - Needs a token
const getAllProjects = async (token) => {

	const config = {
		headers: {
			Authorization: `Bearer ${token}`
		}
	}
	
	const response = await axios.get(API_URL + '/getAllProjects', config)
	
	return response.data

}



// getSingleProject
// Private - Needs a token
const getSingleProject = async (projectId, token) => {

	const config = {
		headers: {
			Authorization: `Bearer ${token}`
		}
	}

	const response = await axios.get(API_URL + '/getSingleProject/' + projectId, config)

	return response.data

}



// updateProject
// Private - Needs a token
// Sends projectData
const updateProject = async (projectId, projectUpdate, token) => {

	const config = {
		headers: {
			Authorization: `Bearer ${token}`
		}
	}

	const response = await axios.put(API_URL + '/updateProject/' + projectId, projectUpdate, config)
	
	return response.data

}



// deleteProject
// Private - Needs a token
const deleteProject = async (projectId, token) => {

	const config = {
		headers: {
			Authorization: `Bearer ${token}`
		}
	}

	const response = await axios.delete(API_URL + '/deleteProject/' + projectId, config)

	return response.data
	
}



const projectService = {
	createProject, 
	getAllProjects,
	getSingleProject,
	updateProject,
	deleteProject,
}

export default projectService