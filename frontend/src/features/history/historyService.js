import axios from 'axios'



const API_URL = '/api/history'

// Create History
// Private
// Sends historyData
const createHistory = async (historyData, token) => {

	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	}

	const response = await axios.post(API_URL + '/createHistory', historyData, config)

	return response.data

}



// Get All History
// Private - Needs a token
const getAllHistory = async (query, token) => {

	const config = {
		headers: {
			Authorization: `Bearer ${token}`
		},
		params: query
	}
	
	const response = await axios.get(API_URL + '/getAllHistory', config)
	
	return response.data

}



// Get All History With Comments
// Private - Needs a token
const getAllHistoryAllComments = async (query, token) => {

	const config = {
		headers: {
			Authorization: `Bearer ${token}`
		},
		params: query
	}
	
	const response = await axios.get(API_URL + '/getAllHistoryAllComments', config)
	
	return response.data

}



// getSingleHistory
// Private - Needs a token
const getSingleHistory = async (historyId, token) => {

	const config = {
		headers: {
			Authorization: `Bearer ${token}`
		}
	}

	const response = await axios.get(API_URL + '/getSingleHistory/' + historyId, config)

	return response.data

}



// updateHistory
// Private - Needs a token
// Sends historyData
const updateHistory = async (historyId, historyUpdate, token) => {

	const config = {
		headers: {
			Authorization: `Bearer ${token}`
		}
	}

	const response = await axios.put(API_URL + '/updateHistory/' + historyId, historyUpdate, config)
	
	return response.data

}



// deleteHistory
// Private - Needs a token
const deleteHistory = async (historyId, token) => {

	const config = {
		headers: {
			Authorization: `Bearer ${token}`
		}
	}

	const response = await axios.delete(API_URL + '/deleteHistory/' + historyId, config)

	return response.data
	
}



const historyService = {
	createHistory, 
	getAllHistory,
	getAllHistoryAllComments,
	getSingleHistory,
	updateHistory,
	deleteHistory,
}

export default historyService