// React
import {useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom'

// Redux
import {useSelector, useDispatch} from 'react-redux'
import {getAllUsers} from '../../features/user/userSlice'

// Helmet Meta Tags
import MetaTags from '../../utilities/MetaTags'

// Error Handling
import useErrorHandling from '../../utilities/useErrorHandling'

// Material UI
import {Box, Container, ListItem, Stack, Typography} from '@mui/material'

// Components
import Spinner from '../../components/Spinner'
import CustomButton from '../../components/CustomListItemButton'
import GetAllUsersTable from './getAllUsers/GetAllUsersTable'



// GetAllUsers
const GetAllUsers = () => {

	const {allUsers, user} = useSelector((state) => state.user)

	const [isLoading, setIsLoading] = useState(true)

	const dispatch = useDispatch()
	const navigate = useNavigate()

	const {checkError} = useErrorHandling()

	useEffect(() => {

		// if there is no data, fetch it
		if (!allUsers) {

			// fetchData
			const fetchData = async () => {

				setIsLoading(true)
				
				await dispatch(getAllUsers())
					.unwrap()
					.catch(error => checkError(error))

				setIsLoading(false)

			}

			fetchData()

		// else, update the data in the background
		} else {

			setIsLoading(false)

			// updateData
			const updateData = async () => {
		
				await dispatch(getAllUsers())
					.unwrap()
					.catch(error => checkError(error))
	
			}
	
			updateData()
		
		}

	}, [dispatch])

	

	return (
		<>

			<MetaTags title="All Users" description="" />
		
			<Container maxWidth="laptop">

				{/* Header and Create Button */}
				<Stack direction={{mobile: "column", tablet: "row"}} alignItems={{mobile: "flex-start", tablet: "center"}} justifyContent="space-between" sx={{pb: 2}}>
					<Typography variant="h4" sx={{width: "200px"}}>Users</Typography>
					
					<ListItem sx={{width: "170px", mr:-2, ml: {mobile: -2, tablet: 0}, mt: {mobile: 1.5, tablet: 0}}}>

						{ (user.role === 'Admin' || user.role === 'Project Manager') && (
							
							<CustomButton labelName="New User" onClick={() => navigate(`/users/create`)} />
							
						)}

					</ListItem>
				</Stack>

				{isLoading ? (
					<Spinner />
				):(
					<>
						{/* Table */}
						{allUsers.length > 0 ? (
							<GetAllUsersTable />
						):(
							<Box>
								<Typography>No users created.</Typography>
							</Box>
						)}
					</>
				)}

			</Container>
		</>
	)
}
export default GetAllUsers