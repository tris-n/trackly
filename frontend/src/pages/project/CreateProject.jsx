// React
import {useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom'

// Redux
import {useSelector, useDispatch} from 'react-redux'
import {createProject} from '../../features/project/projectSlice'
import {getAllUsers} from '../../features/user/userSlice'

// Helmet Meta Tags
import MetaTags from '../../utilities/MetaTags'

// Toastify
import {toast} from 'react-toastify'

// Error Handling
import useErrorHandling from '../../utilities/useErrorHandling'

// Material UI
import {Box, Container, FormControl, InputLabel, MenuItem, Select, Stack, TextField, Typography} from '@mui/material'

// Components
import Spinner from '../../components/Spinner'
import CustomCard from '../../components/CustomCard'
import CustomLoadingButton from '../../components/CustomLoadingButton'
import RandomImageBox from '../../components/RandomImageBox'



// RegisterUser
const CreateProject = () => {

	const [formData, setFormData] = useState({
		name: '',
		description: '',
		projectManagerId: 'default',
	})

	const {
		name, 
		description, 
		projectManagerId, 
	} = formData

	const dispatch = useDispatch()
	const navigate = useNavigate()

	const {checkError} = useErrorHandling()

	const [isLoading, setIsLoading] = useState(false)

	const {allUsers} = useSelector((state) => state.user)

	useEffect(() => {
		dispatch(getAllUsers())
			.unwrap()
			.catch(error => checkError(error))
	}, [dispatch])

	const onChange = (e) => {

		setFormData((prevState) => ({
			...prevState,
			[e.target.name]: e.target.value,
		}))

	}

	const onSubmit = (e) => {
		e.preventDefault()

		setIsLoading(true)

		let projectData = {...formData}

		if (projectData['projectManagerId'] === 'default') {
			delete projectData['projectManagerId']
		}

		// send the FormData 'data' variable/object to the backend
		dispatch(createProject(projectData))
			.unwrap()
			.then((project) => {
				navigate(`/projects/${project._id}`)
				toast.success(`New project created! - ${project.name}`)
			})
			.catch(error => {
				checkError(error)
				setIsLoading(false)
			})
	}


	
	if (!allUsers) {
		return <Spinner />
	}

	

	return (
		<>
			<MetaTags title="Create A Project" />
		
			<Container maxWidth="laptop">

				{/* Header and Create Button */}
				<Stack direction="row" alignItems="center" justifyContent="space-between" sx={{pb: 2, pt: 1.5}}>
					<Typography variant="h4">Create A New Project</Typography>			
				</Stack>

				{/* Create Box */}
				<CustomCard>
					<Box sx={{ display: "flex"}}>

						<Box sx={{ width: {mobile: "100%", tablet: "50%"}, backgroundColor: "light grey", margin: "auto", pt: 3, pb: 3}}>
							<Container>				

								<Box component="form" autoComplete="off" onSubmit={onSubmit}>

									<Stack spacing={3}>

										{/* Name */}
										<TextField type="text" id="name" name="name" value={name} onChange={onChange} label="Name" required />
										
										{/* Description */}
										<TextField type="text" id="description" name="description" value={description} onChange={onChange} label="Description" required />

										{/* Project Manager */}
										<FormControl>
											<InputLabel id="projectManagerId-label" sx={{backgroundColor: "white", pl: 1, pr: 1, ml: -1}}>Project Manager</InputLabel>
											<Select name="projectManagerId" id="projectManagerId" labelId="projectManagerId-label" value={projectManagerId} onChange={onChange}>
												<MenuItem value={"default"} disabled>Please select a PM</MenuItem>
												{allUsers.filter((user) => user.role === "Project Manager").map((user) => (
													<MenuItem value={user._id} key={user._id}>{user.name}</MenuItem>))}
											</Select>
										</FormControl>

										{/* Submit Button */}
										<CustomLoadingButton loading={isLoading} variant="contained" type="submit" sx={{height: "50px"}}>Create Project</CustomLoadingButton>

									</Stack>


								</Box>

							</Container>
						</Box>

						<RandomImageBox fullWidth={false} />

					</Box>
				</CustomCard>
			</Container>
		</>
	)
}
export default CreateProject