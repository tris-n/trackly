import axios from 'axios'



const API_URL = '/api/tickets'

// Create Ticket
// Private
// Sends ticketData
const createTicket = async (ticketData, token) => {

	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	}

	const response = await axios.post(API_URL + '/createTicket', ticketData, config)

	return response.data

}



// Get All Tickets
// Private - Needs a token
const getAllTickets = async (query, token) => {
	
	const config = {
		headers: {
			Authorization: `Bearer ${token}`
		},
		params: query
	}
	
	const response = await axios.get(API_URL + '/getAllTickets', config)
	
	return response.data

}



// getSingleTicket
// Private - Needs a token
const getSingleTicket = async (ticketId, token) => {

	const config = {
		headers: {
			Authorization: `Bearer ${token}`
		}
	}

	const response = await axios.get(API_URL + '/getSingleTicket/' + ticketId, config)

	return response.data

}



// updateTicket
// Private - Needs a token
// Sends ticketData
const updateTicket = async (ticketId, ticketUpdate, token) => {

	const config = {
		headers: {
			Authorization: `Bearer ${token}`
		}
	}

	const response = await axios.put(API_URL + '/updateTicket/' + ticketId, ticketUpdate, config)
	
	return response.data

}



// deleteTicket
// Private - Needs a token
const deleteTicket = async (ticketId, token) => {

	const config = {
		headers: {
			Authorization: `Bearer ${token}`
		}
	}

	const response = await axios.delete(API_URL + '/deleteTicket/' + ticketId, config)

	return response.data
	
}



const ticketService = {
	createTicket, 
	getAllTickets,
	getSingleTicket,
	updateTicket,
	deleteTicket,
}

export default ticketService