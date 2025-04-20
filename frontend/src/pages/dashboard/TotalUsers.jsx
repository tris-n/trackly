// React
import {useNavigate} from 'react-router-dom'

// Material UI
import {Box, CardActionArea, Stack, Typography} from '@mui/material'
import GroupsIcon from '@mui/icons-material/Groups'

// Components
import ComponentBox from "../../components/ComponentBox"



const TotalUsers = ({users}) => {

	const navigate = useNavigate()

	const handleComponentClick = (e) => {
		navigate(`/users/`)
	}

	return (
		<ComponentBox onClick={handleComponentClick}>
			<CardActionArea>

			{/* Display the total number of staff */}
			<Box display="flex" justifyContent="center" alignItems="center" sx={{height: "160px"}}>
				<Stack alignItems="center">
					<GroupsIcon fontSize="large" color="primary" />
					<Typography variant="h3">{users?.length > 0 ? users.length : "0"}</Typography>
					<Typography>Total Users</Typography>
				</Stack>
			</Box>

			</CardActionArea>
		</ComponentBox>
	)
}
export default TotalUsers