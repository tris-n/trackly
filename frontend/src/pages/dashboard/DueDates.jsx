// react
import { useEffect, useState } from "react"
import {useNavigate} from 'react-router-dom'

// Material UI
import {Box, CardActionArea, Divider, Stack, Typography} from '@mui/material'

// Components
import ComponentBox from "../../components/ComponentBox"



const DueDates = ({tickets}) => {

	const [overdueTickets, setOverdueTickets] = useState(0)
	const [onscheduleTickets, setOnscheduleTickets] = useState(null)

	useEffect(() => {
		setOverdueTickets(tickets.filter((ticket) => ticket.overDue).length)
	}, [tickets])

	useEffect(() => {
		setOnscheduleTickets(tickets.length - overdueTickets)
	}, [tickets, overdueTickets])

	const navigate = useNavigate()

	const handleComponentClick = (destination) => {
		if (destination) {
			navigate(`/${destination}/`)
		} else {
			navigate(`/projects/`)
		}
	}



	return (
		<ComponentBox onClick={() => handleComponentClick('tickets')}>
			<CardActionArea>

			{/* Display the total number of projects */}
			<Stack alignItems="center">
				<Box display="flex" justifyContent="space-evenly" alignItems="center" sx={{height: "160px", width: "100%", padding: "20px 17px 10px 17px"}}>
					<Stack alignItems="center" onClick={() => handleComponentClick('tickets')}>
						<Typography variant="h3" color="error">{overdueTickets}</Typography>
						<Typography color="error">Overdue</Typography>
					</Stack>
					<Divider orientation="vertical" flexItem variant="middle" />
					<Stack alignItems="center" onClick={() => handleComponentClick('tickets')}>
						<Typography variant="h3">{onscheduleTickets}</Typography>
						<Typography>On schedule</Typography>
					</Stack>
				</Box>
				<Typography sx={{paddingBottom: "20px"}}>Ticket Progress</Typography>
			</Stack>

			</CardActionArea>
		</ComponentBox>
	)
}

export default DueDates