// React
import {useEffect, useState} from 'react'
import {useNavigate, useParams} from 'react-router-dom'

// Redux
import {useSelector, useDispatch} from 'react-redux'
import {getSingleProject, updateProject, resetSingleProject} from '../../features/project/projectSlice'
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



// UpdateProject
const UpdateProject = () => {
	
	// get single user via params
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const {projectId} = useParams()

	const {checkError} = useErrorHandling()

	const [isLoading, setIsLoading] = useState(false)

	const {singleProject} = useSelector(state => state.projects)
	const {allUsers, user} = useSelector((state) => state.user)

	const [disableCheck, setDisableCheck] = useState({
		name: true,
		description: true,
		projectManagerId: true,
	})


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


	// get all the users, so that the select drop down can have its values
	// get the project and populate the form with its data
	useEffect(() => {
		dispatch(getAllUsers())
		dispatch(getSingleProject(projectId))
			.unwrap()
			.then((project) => {

				setFormData({
					name: project.name, 
					description: project.description, 
					projectManagerId: project.projectManagerId ? project.projectManagerId._id : 'default', 
				})

			})
			.catch(error => checkError(error))
	}, [projectId, dispatch])


	// Reset updateProject on unmount
	// Don't need to unwrap or catch with this
	// It is literally just removing the component from memory
	useEffect(() => {
		return () => {
			dispatch(resetSingleProject())
		}
	}, [])


	// check where to disable form elements
	useEffect(() => {

		if (user.role === 'Admin') setDisableCheck({
			...disableCheck, 
			name: false,
			description: false,
			projectManagerId: false,
		})

		if (user.role === 'Project Manager') setDisableCheck({
			...disableCheck, 
			name: false,
			description: false,
			projectManagerId: false,
		})

		if (user.role === 'Developer') setDisableCheck({
			...disableCheck, 
			name: true,
			description: true,
			projectManagerId: true,
		})

		if (user.role === 'Submitter') setDisableCheck({
			...disableCheck, 
			name: true,
			description: true,
			projectManagerId: true,
		})

	}, [user])

	

	const onChange = (e) => {

			setFormData((prevState) => ({
				...prevState,
				[e.target.name]: e.target.value,
			}))

	}

	const onSubmit = (e) => {
		e.preventDefault()

		setIsLoading(true)

		let projectUpdate = {...formData}

		if (projectUpdate['projectManagerId'] === 'default') {
			delete projectUpdate['projectManagerId']
		}

		let projectData = {
			projectId,
			projectUpdate,
		}

		dispatch(updateProject(projectData))
			.unwrap()
			.then((project) => {
				toast.success(`Updated project - ${project.name}`)
				navigate(`/projects/${project._id}`)
			})
			.catch(error => {
				checkError(error)
				setIsLoading(false)
			})

	}

	if (!singleProject || !allUsers || !user) {
		return <Spinner />
	}

	

	return (
		<>
			<MetaTags title={`Update Project - ${singleProject.name}`} />
		
			<Container maxWidth="laptop">

				{/* Header and Create Button */}
				<Stack direction="row" alignItems="center" justifyContent="space-between" sx={{pb: 2, pt: 1.5}}>
					<Typography variant="h4">Update Project</Typography>
				</Stack>

				{/* Create Box */}
				<CustomCard>
					<Box sx={{ display: "flex"}}>

						<Box sx={{ width: {mobile: "100%", tablet: "50%"}, backgroundColor: "light grey", margin: "auto", pt: 3, pb: 3}}>
							<Container>

								<Box component="form" autoComplete="off" onSubmit={onSubmit}>

									<Stack spacing={3}>

										{/* Name */}
										<TextField type="text" id="name" name="name" value={name} onChange={onChange} label="Name" required disabled={disableCheck.name} />

										{/* Description */}
										<TextField type="text" id="description" name="description" value={description} onChange={onChange} label="Description" required disabled={disableCheck.description} />

										{/* Project Manager */}
										<FormControl>
											<InputLabel id="projectManagerId-label" sx={{backgroundColor: "white", pl: 1, pr: 1, ml: -1}}>Project Manager</InputLabel>
											<Select name="projectManagerId" id="projectManagerId" labelId="projectManagerId-label" value={projectManagerId} onChange={onChange} disabled={disableCheck.projectManagerId}>
												<MenuItem value={"default"} disabled>Please select a project manager</MenuItem>
												{allUsers.filter((user) => user.role === "Project Manager").map((user) => (
													<MenuItem value={user._id} key={user._id}>{user.name}</MenuItem>))}
											</Select>
										</FormControl>

										{/* Submit Button */}
										<CustomLoadingButton loading={isLoading} variant="contained" type="submit" sx={{height: "50px"}}>Update Project</CustomLoadingButton>

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
export default UpdateProject