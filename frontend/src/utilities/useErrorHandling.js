// React
import {useNavigate} from 'react-router-dom'

// Redux
import {useDispatch} from 'react-redux'
import {logout} from '../features/user/userSlice'

// Toastify
import {toast} from 'react-toastify'



const useErrorHandling = (error) => {
	
	const dispatch = useDispatch()
	const navigate = useNavigate()
	
	const checkError = (error) => {

		// If the JWT Token expires and the backend throws an error
		// Log the current user out
		if (error === 'Session expired' || error === 'Invalid token' || error === 'Not authorised') {
			dispatch(logout())
			navigate('/')
		}

		return toast.error(error)
	}

	return {checkError}

}

export default useErrorHandling