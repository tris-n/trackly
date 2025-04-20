// React
import {useNavigate} from 'react-router-dom'

// Material UI
import {Box, CardActionArea, Stack, Typography} from '@mui/material'
import DescriptionIcon from '@mui/icons-material/Description'

// Components
import ComponentBox from "../../components/ComponentBox"



const TotalTickets = ({tickets}) => {

	const navigate = useNavigate()

	const handleComponentClick = (e) => {
		navigate(`/tickets/`)
	}

	return (
		<ComponentBox onClick={handleComponentClick}>
			<CardActionArea>

			{/* Display the total number of staff */}
			<Box display="flex" justifyContent="center" alignItems="center" sx={{height: "160px"}}>
				<Stack alignItems="center">
					<DescriptionIcon fontSize="large" color="primary" />
					<Typography variant="h3">{tickets?.length > 0 ? tickets.length : "0"}</Typography>
					<Typography>Total Tickets</Typography>
				</Stack>
			</Box>

			</CardActionArea>
		</ComponentBox>
	)
}
export default TotalTickets