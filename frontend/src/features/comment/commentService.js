import axios from 'axios'



const API_URL = '/api/comments'

// Create Comment
// Private
// Sends commentData
const createComment = async (commentData, token) => {

	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	}

	const response = await axios.post(API_URL + '/createComment', commentData, config)

	return response.data

}



// Get All Comments
// Private - Needs a token
const getAllComments = async (query, token) => {

	const config = {
		headers: {
			Authorization: `Bearer ${token}`
		},
		params: query
	}
	
	const response = await axios.get(API_URL + '/getAllComments', config)
	
	return response.data

}



// getSingleComment
// Private - Needs a token
const getSingleComment = async (commentId, token) => {

	const config = {
		headers: {
			Authorization: `Bearer ${token}`
		}
	}

	const response = await axios.get(API_URL + '/getSingleComment/' + commentId, config)

	return response.data

}



// updateComment
// Private - Needs a token
// Sends commentData
const updateComment = async (commentId, commentUpdate, token) => {

	// Display the values
	for (const value in commentUpdate) {
		console.log(value);
	}

	const config = {
		headers: {
			Authorization: `Bearer ${token}`
		}
	}

	const response = await axios.put(API_URL + '/updateComment/' + commentId, commentUpdate, config)
	
	return response.data

}



// deleteComment
// Private - Needs a token
const deleteComment = async (commentId, token) => {

	const config = {
		headers: {
			Authorization: `Bearer ${token}`
		}
	}

	const response = await axios.delete(API_URL + '/deleteComment/' + commentId, config)

	return response.data
	
}



const commentService = {
	createComment, 
	getAllComments,
	getSingleComment,
	updateComment,
	deleteComment,
}

export default commentService