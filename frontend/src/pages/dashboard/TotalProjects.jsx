// React
import {useNavigate} from 'react-router-dom'

// Material UI
import {Box, CardActionArea, Stack, Typography} from '@mui/material'
import FolderSpecialIcon from '@mui/icons-material/FolderSpecial'

// Components
import ComponentBox from "../../components/ComponentBox"



const TotalProjects = ({projects}) => {

	const navigate = useNavigate()

	const handleComponentClick = (e) => {
		navigate(`/projects/`)
	}



	return (
		<ComponentBox onClick={handleComponentClick}>
			<CardActionArea>

			{/* Display the total number of projects */}
			<Box display="flex" justifyContent="center" alignItems="center" sx={{height: "160px"}}>
				<Stack alignItems="center">
					<FolderSpecialIcon fontSize="large" color="primary" />
					<Typography variant="h3">{projects?.length > 0 ? projects.length : "0"}</Typography>
					<Typography>Total Projects</Typography>
				</Stack>
			</Box>

			</CardActionArea>
		</ComponentBox>
	)
}
export default TotalProjects