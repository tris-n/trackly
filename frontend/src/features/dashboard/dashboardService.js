import axios from 'axios'



const API_URL = '/api/dashboard'

// Get All Dashboard Data
// Private - Needs a token
const getDashboard = async (token) => {

	const config = {
		headers: {
			Authorization: `Bearer ${token}`
		}
	}
	
	const response = await axios.get(API_URL + '/getDashboard', config)
	
	return response.data

}



const dashboardService = {
	getDashboard,
}

export default dashboardService