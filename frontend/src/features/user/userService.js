import axios from 'axios'



const API_URL = '/api/users'

// Register user
// Public
// Sends userData
const registerUser = async (userData) => {

	const response = await axios.post(API_URL + '/registerUser', userData)

	if (response.data) {
		localStorage.setItem('user', JSON.stringify(response.data))
	}

	return response.data

}



// Create user
// Private
// Sends userData
const createUser = async (userData, token) => {

	const config = {
		headers: {
			Authorization: `Bearer ${token}`
		}
	}

	const response = await axios.post(API_URL + '/createUser', userData, config)

	return response.data

}



// Login user
// Public
// Sends userData
const loginUser = async (userData) => {

	const response = await axios.post(API_URL + '/loginUser', userData)

	if (response.data) {
		localStorage.setItem('user', JSON.stringify(response.data))
	}

	return response.data

}



// Get All Users
// Private - Needs a token
const getAllUsers = async (token) => {

	const config = {
		headers: {
			Authorization: `Bearer ${token}`
		}
	}
	
	const response = await axios.get(API_URL + '/getAllUsers', config)
	
	return response.data

}



// getSingleUser
// Private - Needs a token
// Sends userData
const getSingleUser = async (userId, token) => {

	const config = {
		headers: {
			Authorization: `Bearer ${token}`
		}
	}

	const response = await axios.get(API_URL + '/getSingleUser/' + userId, config)
	
	return response.data

}



// updateUser
// Private - Needs a token
// Sends userData
const updateUser = async (userId, userUpdate, token) => {

	const config = {
		headers: {
			Authorization: `Bearer ${token}`
		}
	}

	const response = await axios.put(API_URL + '/updateUser/' + userId, userUpdate, config)
	
	return response.data

}

// deleteUser
// Private - Needs a token
const deleteUser = async (userId, token) => {

	const config = {
		headers: {
			Authorization: `Bearer ${token}`
		}
	}

	const response = await axios.delete(API_URL + '/deleteUser/' + userId, config)

	return response.data
	
}



// Logout user
const logout = () => {
	localStorage.removeItem('user')
}



const userService = {
	registerUser, 
	createUser,
	loginUser, 
	getAllUsers, 
	getSingleUser,
	updateUser,
	deleteUser,
	logout,
}

export default userService