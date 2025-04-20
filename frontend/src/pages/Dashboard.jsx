// React
import { useEffect, useState } from 'react'
import {useNavigate} from 'react-router-dom'

// Redux
import {useSelector, useDispatch} from 'react-redux'
import {getDashboard} from '../features/dashboard/dashboardSlice'

// Error Handling
import useErrorHandling from '../utilities/useErrorHandling'

// Helmet Meta Tags
import MetaTags from '../utilities/MetaTags'

// Material UI
import {Container, ListItem, Stack, Typography} from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'

// Components
import Spinner from '../components/Spinner'
import CustomButton from '../components/CustomListItemButton'
import logo from '../layout/logo/logo-white.png'

// Widgets
import Assigned from './dashboard/Assigned'
import DueDates from './dashboard/DueDates'
import TicketPriority from './dashboard/TicketPriority'
import TicketStatus from './dashboard/TicketStatus'
import TicketType from './dashboard/TicketType'
import TotalProjects from './dashboard/TotalProjects'
import TotalTickets from './dashboard/TotalTickets'
import TotalUsers from './dashboard/TotalUsers'
import UserRoles from './dashboard/UserRoles'



// Dashboard
const Dashboard = () => {
	
	const { user } = useSelector((state) => state.user)
	const { dashboardData } = useSelector((state) => state.dashboard)
	
	const [isLoading, setIsLoading] = useState(true)
	
	const dispatch = useDispatch()
	const navigate = useNavigate()

	const {checkError} = useErrorHandling()



	useEffect(() => {

		// if there is no data, fetch it
		if (!dashboardData) {

			// fetchData
			const fetchData = async () => {
	
				setIsLoading(true)
	
				await dispatch(getDashboard())
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
		
				await dispatch(getDashboard())
					.unwrap()
					.catch(error => checkError(error))
	
			}
	
			updateData()
		}

	}, [dispatch])



	return (
		<>
			<MetaTags title="Dashboard" description="" />

			<Container maxWidth="laptop">

				{/* Header and Create Button */}
				<Stack direction={{mobile: "column", tablet: "row"}} alignItems={{mobile: "flex-start", tablet: "center"}} justifyContent="space-between" sx={{pb: 4}}>
					<Typography variant="h4"><span style={{color: "white"}}>Welcome to <img src={logo} alt="Trackly" height="30px" style={{position: "relative", top: "3px", paddingRight: "3px"}} /><strong>Trackly</strong></span></Typography>
					
					<ListItem sx={{width: "180px", mr:-2, ml: {mobile: -2, tablet: 0}, mt: {mobile: 1.5, tablet: 0}, mb: {mobile: -1.5, tablet: 0}}}>

						{ (user.role === 'Admin' || user.role === 'Project Manager' || user.role === 'Developer' || user.role === 'Submitter') && (
							<CustomButton labelName="New Ticket" onClick={() => navigate(`/tickets/create`)} />
						)}

					</ListItem>
				</Stack>


				{isLoading ? (
					<Spinner />
				):(
					<Grid container spacing={5}>
						


						{/* Top Row */}

						<Grid mobile={12} tablet={4}>
							<TotalProjects projects={dashboardData.projects} />
						</Grid>

						<Grid mobile={12} tablet={4}>
							<TotalTickets tickets={dashboardData.tickets} />
						</Grid>

						<Grid mobile={12} tablet={4}>
							<TotalUsers users={dashboardData.users} />
						</Grid>



						{dashboardData && (
							<>
								{/* Second Row */}
								
								<Grid mobile={12} tablet={4}>
									<DueDates tickets={dashboardData.tickets} />
								</Grid>

								<Grid mobile={12} tablet={4}>
									<Assigned tickets={dashboardData.tickets} users={dashboardData.users} />
								</Grid>

								<Grid mobile={12} tablet={4}>
									<UserRoles users={dashboardData.users} />
								</Grid>



								{/* Third Row */}

								<Grid mobile={12} tablet={4}>
									<TicketPriority tickets={dashboardData.tickets} />
								</Grid>

								<Grid mobile={12} tablet={4}>
									<TicketType tickets={dashboardData.tickets} />
								</Grid>

								<Grid mobile={12} tablet={4}>
									<TicketStatus tickets={dashboardData.tickets} />
								</Grid>
							</>
						)}




					</Grid>

				)}
			</Container>
		</>
	)
}
export default Dashboard