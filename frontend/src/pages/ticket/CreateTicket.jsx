// React
import {useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom'

// Redux
import {useSelector, useDispatch} from 'react-redux'
import {createTicket} from '../../features/ticket/ticketSlice'
import {getAllUsers} from '../../features/user/userSlice'
import {getAllProjects} from '../../features/project/projectSlice'

// Helmet Meta Tags
import MetaTags from '../../utilities/MetaTags'

// Toastify
import {toast} from 'react-toastify'

// Error Handling
import useErrorHandling from '../../utilities/useErrorHandling'

// Material UI
import {Box, Container, FormControl, InputLabel, MenuItem, Select, Stack, TextField, Typography} from '@mui/material'

// Date Picker
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import dayjs from 'dayjs'

// Components
import Spinner from '../../components/Spinner'
import CustomCard from '../../components/CustomCard'
import CustomLoadingButton from '../../components/CustomLoadingButton'
import RandomImageBox from '../../components/RandomImageBox'



// Create Ticket
const CreateTicket = () => {

	// Check if query param
	// if any issues for setting it as formData
	// put it into a .then() after dispatching getAllProjects
	const queryParams = new URLSearchParams(window.location.search)
	const projectQueryParam = queryParams.get('projectId')
	const userQueryParam = queryParams.get('assignedId')

	const [formData, setFormData] = useState({
		name: '',
		description: '',
		projectId: projectQueryParam ? projectQueryParam : 'default',
		assignedId: userQueryParam? userQueryParam : 'default',
		priority: 'default',
		status: 'default',
		type: 'default',
		dueDate: null,
	})

	const {
		name,
		description,
		projectId,
		assignedId,
		priority,
		status,
		type,
		dueDate,
	} = formData

	const dispatch = useDispatch()
	const navigate = useNavigate()

	

	const {checkError} = useErrorHandling()

	const [isLoading, setIsLoading] = useState(false)

	const {allUsers} = useSelector((state) => state.user)
	const {allProjects} = useSelector((state) => state.projects)

	useEffect(() => {
		dispatch(getAllUsers())
			.unwrap()
			.catch(error => checkError(error))
		dispatch(getAllProjects())
			.unwrap()
			.catch(error => checkError(error))
	}, [dispatch])

	const onChange = (e) => {

		setFormData((prevState) => ({
			...prevState,
			[e.target.name]: e.target.value,
		}))

	}

	const handleDatePicker = (newValue) => {

		setFormData((prevState) => ({
			...prevState,
			dueDate: dayjs(newValue)
		}))
	}

	const onSubmit = (e) => {
		e.preventDefault()

		setIsLoading(true)

		// Form validation
		if (projectId === 'default') {
			toast.error(`Please select a project.`)
			setIsLoading(false)
			return
		}


		let ticketData = {...formData}

		// remove empty fields from formData
		for (const field in ticketData) {
			if (!ticketData[field] || ticketData[field] === 'default') {
				delete ticketData[field]
			}
		}

		// send the FormData 'data' variable/object to the backend
		dispatch(createTicket(ticketData))
			.unwrap()
			.then((ticket) => {
				toast.success(`New ticket created! - ${ticket.name}`)
				if (projectQueryParam) {
					navigate(`/projects/${projectQueryParam}`)
				} else {
					navigate(`/tickets/${ticket._id}`)
				}
			})
			.catch(error => {
				checkError(error)
				setIsLoading(false)
			})

	}
	
	if (!allUsers || !allProjects) {
		return <Spinner />
	}

	

	return (
		<>
			<MetaTags title="Create A Ticket" />
		
			<Container maxWidth="laptop">

				{/* Header and Create Button */}
				<Stack direction="row" alignItems="center" justifyContent="space-between" sx={{pb: 2, pt: 1.5}}>
					<Typography variant="h4">Create A New Ticket</Typography>
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

										{/* Project Id */}
										<FormControl>
											<InputLabel id="projectId-label" sx={{backgroundColor: "white", pl: 1, pr: 1, ml: -1}}>Project</InputLabel>
											<Select name="projectId" id="projectId" labelId="projectId-label" value={projectId} onChange={onChange} required>
												<MenuItem value={"default"} disabled>Please select a project</MenuItem>
												{allProjects.map((project) => (
													<MenuItem value={project._id} key={project._id}>{project.name}</MenuItem>))}
											</Select>
										</FormControl>
										
										{/* Assigned Id */}
										<FormControl>
											<InputLabel id="assignedId-label" sx={{backgroundColor: "white", pl: 1, pr: 1, ml: -1}}>Assign To</InputLabel>
											<Select name="assignedId" id="assignedId" labelId="assignedId-label" value={assignedId} onChange={onChange} required>
												<MenuItem value={"default"} disabled>Please select a user</MenuItem>
												{allUsers.map((user) => (
													<MenuItem value={user._id} key={user._id}>{user.name}</MenuItem>))}
											</Select>
										</FormControl>

										{/* Priority */}
										<FormControl>
											<InputLabel id="priority-label" sx={{backgroundColor: "white", pl: 1, pr: 1, ml: -1}}>Priority</InputLabel>
											<Select id="priority" name="priority" value={priority} onChange={onChange}>
												<MenuItem value={"default"} disabled>Please select a priority</MenuItem>
												<MenuItem value={"Low"}>Low</MenuItem>
												<MenuItem value={"Medium"}>Medium</MenuItem>
												<MenuItem value={"High"}>High</MenuItem>
												<MenuItem value={"Urgent"}>Urgent</MenuItem>
											</Select>
										</FormControl>

										{/* Status */}
										<FormControl>
											<InputLabel id="status-label" sx={{backgroundColor: "white", pl: 1, pr: 1, ml: -1}}>Status</InputLabel>
											<Select id="status" name="status" value={status} onChange={onChange}>
												<MenuItem value={"default"} disabled>Please select a status</MenuItem>
												<MenuItem value={"To Do"}>To Do</MenuItem>
												<MenuItem value={"In Progress"}>In Progress</MenuItem>
												<MenuItem value={"In Review"}>In Review</MenuItem>
												<MenuItem value={"Done"}>Done</MenuItem>
											</Select>
										</FormControl>
										
										{/* Type */}
										<FormControl>
											<InputLabel id="type-label" sx={{backgroundColor: "white", pl: 1, pr: 1, ml: -1}}>Type</InputLabel>
											<Select id="type" name="type" value={type} onChange={onChange}>
												<MenuItem value={"default"} disabled>Please select a type</MenuItem>
												<MenuItem value={"Bug"}>Bug</MenuItem>
												<MenuItem value={"Improvement"}>Improvement</MenuItem>
												<MenuItem value={"Task"}>Task</MenuItem>
												<MenuItem value={"Feature"}>Feature</MenuItem>
											</Select>
										</FormControl>

										{/* Due Date */}
										<LocalizationProvider dateAdapter={AdapterDayjs}>
											<DatePicker
												label="Due Date"
												value={dayjs(dueDate)}
												name="dueDate"
												onChange={handleDatePicker}
											/>
										</LocalizationProvider>

										{/* Submit Button */}
										<CustomLoadingButton loading={isLoading} variant="contained" type="submit" sx={{height: "50px"}}>Create Ticket</CustomLoadingButton>

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
export default CreateTicket