// react
import { useEffect, useState } from "react"
import {useNavigate} from 'react-router-dom'

// Material UI
import {Box, CardActionArea, Divider, Stack, Typography} from '@mui/material'

// Components
import ComponentBox from "../../components/ComponentBox"



const Assigned = ({tickets, users}) => {

	const [unAssignedTickets, setUnAssignedTickets] = useState()
	const [unAssignedUsers, setUnAssignedUsers] = useState()

	useEffect(() => {

		setUnAssignedTickets(tickets.filter((ticket) => !ticket.assignedId).length)

	}, [tickets])


	useEffect(() => {

		const ticketsWithUsersAssigned = tickets
			.map(ticket => ticket.assignedId)
			.filter(id => id !== null && id !== undefined)		

		const usersNotAssignedToTickets = users.filter(user => !ticketsWithUsersAssigned.includes(user._id))

		setUnAssignedUsers(usersNotAssignedToTickets.length)

	}, [tickets, users])

	const navigate = useNavigate()

	const handleComponentClick = (destination) => {
		if (destination) {
			navigate(`/${destination}/`)
		} else {
			navigate(`/projects/`)
		}
	}



	return (
		<ComponentBox>
			<CardActionArea>

			{/* Display the total number of projects */}
			<Stack alignItems="center">
				<Box display="flex" justifyContent="space-evenly" alignItems="center" sx={{height: "160px", width: "100%", padding: "20px 17px 10px 17px"}}>
					<Stack alignItems="center" onClick={() => handleComponentClick('tickets')}>
						<Typography variant="h3">{unAssignedTickets}</Typography>
						<Typography align="center">Unassigned Tickets</Typography>
					</Stack>
					<Divider orientation="vertical" flexItem variant="middle" />
					<Stack alignItems="center" onClick={() => handleComponentClick('users')}>
						<Typography variant="h3">{unAssignedUsers}</Typography>
						<Typography align="center">Unassigned Users</Typography>
					</Stack>
				</Box>
				<Typography sx={{paddingBottom: "20px"}}>Unassigned</Typography>
			</Stack>

			</CardActionArea>
		</ComponentBox>
	)
}
export default Assigned