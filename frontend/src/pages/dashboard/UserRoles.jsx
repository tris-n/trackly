// react
import { useEffect, useState } from "react"
import {useNavigate} from 'react-router-dom'

// Material UI
import {CardActionArea, Stack, Typography} from '@mui/material'

// Components
import ComponentBox from "../../components/ComponentBox"



const UserRoles = ({users}) => {

	const [adminUsers, setAdminUsers] = useState()
	const [projectManagerUsers, setProjectManagerUsers] = useState()
	const [developerUsers, setDeveloperUsers] = useState()
	const [submitterUsers, setSubmitterUsers] = useState()
  
	useEffect(() => {
  
		setAdminUsers(users.filter((user) => user.role === "Admin").length)
		setProjectManagerUsers(users.filter((user) => user.role === "Project Manager").length)
		setDeveloperUsers(users.filter((user) => user.role === "Developer").length)
		setSubmitterUsers(users.filter((user) => user.role === "Submitter").length)
  
	}, [users])

	const navigate = useNavigate()

	const handleComponentClick = (destination) => {
		if (destination) {
			navigate(`/${destination}/`)
		} else {
			navigate(`/projects/`)
		}
	}



	return (
		<ComponentBox onClick={() => handleComponentClick('users')}>
			<CardActionArea>

			{/* Display the total number of projects */}
			<Stack alignItems="center">

				<Stack justifyContent="space-evenly" alignItems="center" sx={{height: "160px", width: "100%", padding: "20px 17px 10px 17px"}}>

					<Stack alignItems="center" onClick={() => handleComponentClick('users')}>
						<Typography variant="h6">{adminUsers} Admin</Typography>
					</Stack>

					<Stack alignItems="center" onClick={() => handleComponentClick('users')}>
						<Typography variant="h6">{projectManagerUsers} Project Managers</Typography>
					</Stack>

					<Stack alignItems="center" onClick={() => handleComponentClick('users')}>
						<Typography variant="h6">{developerUsers} Developers</Typography>
					</Stack>
	
					<Stack alignItems="center" onClick={() => handleComponentClick('users')}>
						<Typography variant="h6">{submitterUsers} Submitters</Typography>
					</Stack>

				</Stack>
				

				<Typography sx={{paddingBottom: "20px"}}>User Roles</Typography>

			</Stack>

			</CardActionArea>
		</ComponentBox>
	)
}
export default UserRoles