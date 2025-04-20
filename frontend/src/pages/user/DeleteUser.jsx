// React
import {useEffect} from 'react'
import {Link} from 'react-router-dom'

// Redux
import {useSelector, useDispatch} from 'react-redux'
import {getAllUsers, deleteUser} from '../../features/user/userSlice'

// Error Handling
import useErrorHandling from '../../utilities/useErrorHandling'

// Components
import Spinner from '../../components/Spinner'
import BackButton from '../../components/BackButton'



// DeleteUser
const DeleteUser = () => {

	const {allUsers} = useSelector((state) => state.user)

	const dispatch = useDispatch()

	const {checkError} = useErrorHandling()

	useEffect(() => {
		dispatch(getAllUsers())
			.unwrap()
			.catch(error => checkError(error))
	}, [dispatch])

	// onClick
	const onDelete = (id) => {
		if (window.confirm(`Are you sure you want to delete?`)) {
			dispatch(deleteUser(id))
				.unwrap()
				.then(() => {
					dispatch(getAllUsers())
				})
				.catch(error => checkError(error))
		}
	}

	if (!allUsers) {
		return <Spinner />
	}


	return (
		<>
			<BackButton />
			<h1>Delete User</h1>
			<ul>
				{allUsers.map((user) => (
					<li key={user._id}>
						{user._id}: {user.name}: {user.role}: {user.email}
						<button onClick={() => onDelete(user._id)}>Delete</button>
						<Link to={`/users/update/${user._id}`}><button>Update</button></Link>
						<Link to={`/users/${user._id}`}><button>Get info</button></Link>
					</li>
				))}
			</ul>
		</>
	)
}
export default DeleteUser