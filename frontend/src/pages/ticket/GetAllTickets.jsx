// React
import {useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom'

// Redux
import {useSelector, useDispatch} from 'react-redux'
import {getAllTickets} from '../../features/ticket/ticketSlice'

// Helmet Meta Tags
import MetaTags from '../../utilities/MetaTags'

// Error Handling
import useErrorHandling from '../../utilities/useErrorHandling'

// Material UI
import {Box, Container, ListItem, Stack, Typography} from '@mui/material'

// Components
import Spinner from '../../components/Spinner'
import CustomButton from '../../components/CustomListItemButton'
import GetAllTicketsTable from './getAllTickets/GetAllTicketsTable'



// GetAllTickets
const GetAllTickets = () => {

	const {allTickets} = useSelector((state) => state.tickets)
	const {user} = useSelector((state) => state.user)

	const [isLoading, setIsLoading] = useState(true)

	const dispatch = useDispatch()
	const navigate = useNavigate()

	const {checkError} = useErrorHandling()


	useEffect(() => {

		// if there is no data, fetch it
		if (!allTickets) {

			// fetchData
			const fetchData = async () => {

				setIsLoading(true)

				await dispatch(getAllTickets())
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
		
				await dispatch(getAllTickets())
					.unwrap()
					.catch(error => checkError(error))
	
			}
	
			updateData()
		}
		
	}, [dispatch])



	return (
		<>
			<MetaTags title="All Tickets" />

			<Container maxWidth="laptop">

				{/* Header and Create Button */}
				<Stack direction={{mobile: "column", tablet: "row"}} alignItems={{mobile: "flex-start", tablet: "center"}} justifyContent="space-between" sx={{pb: 2}}>
					<Typography variant="h4" sx={{width: "200px"}}>Tickets</Typography>
					
					<ListItem sx={{width: "180px", mr:-2, ml: {mobile: -2, tablet: 0}, mt: {mobile: 1.5, tablet: 0}}}>

						{ (user.role === 'Admin' || user.role === 'Project Manager' || user.role === 'Developer' || user.role === 'Submitter') && (
							<CustomButton labelName="New Ticket" onClick={() => navigate(`/tickets/create`)} />
						)}

					</ListItem>
				</Stack>


				{isLoading ? (
					<Spinner />
				):(
					<>
						{/* Table */}
						{allTickets.length > 0 ? (
							<GetAllTicketsTable />
						):(
							<Box>
								<Typography>No projects created.</Typography>
							</Box>
						)}
					</>
				)}

			</Container>
		</>
	)
}
export default GetAllTickets