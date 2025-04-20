// React
import { Outlet, Navigate } from 'react-router-dom'

// Redux
import {useSelector, useDispatch} from 'react-redux'
import {logout} from '../features/user/userSlice'



const PrivateRoutes = ({roles}) => {

	const { user } = useSelector((state) => state.user)
	const dispatch = useDispatch()

	// if not logged in, go to login page
	if (!user) {
		return <Navigate to='/' />
	}

	// verify correct website
	if (user.website !== 'Trackly') {
		dispatch(logout())
		return <Navigate to='/' />
	}

	// if logged in and role matches, go to outlet. otherwise, go back to home page
	if (roles.includes(user.role)) {
		return <Outlet />
	} else {
		return <Navigate to={`/users/${user._id}`} /> 
		// basically, if they are not authorised, we redirect back to the single user page
	}

}

export default PrivateRoutes