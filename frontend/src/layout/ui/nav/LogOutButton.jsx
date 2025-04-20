// React
import {useNavigate} from 'react-router-dom'

// Redux
import {useSelector, useDispatch} from 'react-redux'
import {logout} from '../../../features/user/userSlice'

// Material UI
import {Button} from '@mui/material'

// Components
import Spinner from '../../../components/Spinner'



const LogOutButton = () => {

	const navigate = useNavigate()
	const dispatch = useDispatch()
	const {user} = useSelector((state) => state.user)

	const onLogout = () => {
		dispatch(logout())
		navigate('/')
	}

	if (!user) {
		return <Spinner />
	}



	return (
		<Button variant="contained" onClick={onLogout} sx={{ borderRadius: 3}}>Logout</Button>	
	)
}
export default LogOutButton