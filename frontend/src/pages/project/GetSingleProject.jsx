// React
import {useEffect, useState} from 'react'
import {useParams, useNavigate} from 'react-router-dom'

// Redux
import {useSelector, useDispatch} from 'react-redux'
import {getSingleProject, deleteProject, resetSingleProject} from '../../features/project/projectSlice'
import {getAllTickets} from '../../features/ticket/ticketSlice'

// Helmet Meta Tags
import MetaTags from '../../utilities/MetaTags'

// Toastify
import {toast} from 'react-toastify'

// React Modal
import Modal from 'react-modal'

// Error Handling
import useErrorHandling from '../../utilities/useErrorHandling'

// Material UI
import {Avatar, Box, Button, Chip, Container, ListItem, Stack, Typography} from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount'
import InboxIcon from '@mui/icons-material/Inbox'
import BarChartIcon from '@mui/icons-material/BarChart'

// Components
import Spinner from '../../components/Spinner'
import CustomButton from '../../components/CustomListItemButton'
import GetSingleProjectTable from './getSingleProject/GetSingleProjectTable'



// GetSingleProject
const GetSingleProject = () => {

	const {singleProject} = useSelector((state) => state.projects)
	const {singleProjectTickets} = useSelector((state) => state.tickets)
	const {user} = useSelector((state) => state.user)

	const [isLoading, setIsLoading] = useState(true)

	const [modalIsOpen, setIsOpen] = useState(false)

	const dispatch = useDispatch()
	const navigate = useNavigate()
	const { projectId } = useParams()

	const {checkError} = useErrorHandling()

	const handleEditProject = () => {
		navigate(`/projects/update/${projectId}`)
	}

	const handleDeleteProject = () => {	
		
		dispatch(deleteProject(projectId))
			.unwrap()
			.then(() => {
				toast.success(`Successfully deleted the project.`)
				dispatch(resetSingleProject())
			})
			.catch(error => checkError(error))

		navigate(`/projects/`)

	}

	// Modal settings
	const openModal = () => {
		setIsOpen(true)
	}
	
	const closeModal = () => {
		setIsOpen(false)
	}

	useEffect(() => {

		// if there is no data, fetch it
		// if there are no tickets, no singleproject
		// or if singleproject id does not equal the params
		if (!singleProjectTickets || !singleProject || projectId !== singleProject._id) {

			const fetchData = async () => {

				setIsLoading(true)

				await dispatch(getAllTickets({query: [
					{queryType: 'singleProject'},
					{projectId: projectId},
				]}))
					.unwrap()
					.catch(error => checkError(error))

				await dispatch(getSingleProject(projectId))
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
		
				await dispatch(getAllTickets({query: [
					{queryType: 'singleProject'},
					{projectId: projectId}
				]}))
					.unwrap()
					.catch(error => checkError(error))

				await dispatch(getSingleProject(projectId))
					.unwrap()
					.catch(error => checkError(error))

			}

			updateData()
		}
			
	}, [projectId, dispatch])


	if (isLoading) {
		return <Spinner />
	}


	return (
		<>
			<MetaTags title={`Get Project - ${singleProject?.name}`} />
		
			<Container maxWidth="laptop">

				<Grid container spacing={0}>

					{/* Top Row */}

					{/* Project Title */}
					<Grid mobile={12} tablet={5}>

							<Stack direction="row" alignItems="center">
								<Avatar src={`/images/titleLetters/${singleProject?.name.slice(0,1).toLowerCase()}.png`} alt="" sx={{mr: 2, height: 50, width: 50}}/>
								
								<Stack>
									<Typography variant="h5">{singleProject?.name}</Typography>
									<Typography variant="subtitle2">{singleProject?.description}</Typography>
								</Stack>
							</Stack>

					</Grid>
					
					{/* Edit buttons */}
					<Grid mobile={12} tablet={7} sx={{backgroundColor: "", pl: {mobile: 0, tablet: 0}, mt: {mobile: 3, tablet: 0}}}>

							<Stack direction={{mobile: "column", tablet: "row"}} alignItems={{mobile: "flex-start", tablet: "flex-start"}} justifyContent="flex-end" flexDirection={!(user.role === 'Admin' || user.role === 'Project Manager') && 'row-reverse'} sx={{backgroundColor: ""}}>

								{/* New Ticket */}
								{ (user.role === 'Admin' || user.role === 'Project Manager' || user.role === 'Developer' || user.role === 'Submitter') && (
								<ListItem sx={{width: "180px", ml: {mobile: -2, tablet: 0}}}>

										<CustomButton labelName="New Ticket" onClick={() => navigate(`/tickets/create?projectId=${projectId}`)} />

								</ListItem>
								)}

								{/* Edit Project */}
								{ user.role === 'Admin' && (
								<ListItem sx={{width: "200px", ml: {mobile: -2, tablet: 0}}}>

										<CustomButton labelName="Update Project" onClick={handleEditProject} />

								</ListItem>
								)}

								{/* Delete Project */}
								{ user.role === 'Admin' && (
								<ListItem sx={{width: "200px", ml: {mobile: -2, tablet: 0}, mr: -2}}>

										<CustomButton labelName="Delete Project" deletion onClick={openModal} />

								</ListItem>
								)}
								
							</Stack>

					</Grid>



					{/* Bottom Row */}

					{/* Left Column - Trailer / Details / Staff */}
					<Grid mobile={12} tablet={7} sx={{backgroundColor: "", pt: 2}}>

						{/* Project Details Row */}
						<Stack direction={{mobile: "column", tablet: "row"}} alignItems="flex-start" justifyContent="flex-start" spacing={2} sx={{mb: 3, mt: 2}}>
							{/* Status */}
							{singleProject?.projectManagerId ? (
								<Chip label={`Project Manager: ${singleProject?.projectManagerId.name}`} color="default" icon={<SupervisorAccountIcon />} component='a' href={`/users/${singleProject?.projectManagerId._id}`} clickable />
							):(
								<Chip label={`Project Manager: unassigned`} color="default" icon={<SupervisorAccountIcon />} />
							)}
							<Chip label={`Total Tickets: ${singleProject?.ticketCount}`} color="default" icon={<BarChartIcon />} />
							<Chip label={`Open Tickets: ${singleProject?.ticketsOpen}`} color="default" icon={<InboxIcon />} />
						</Stack>

						
					</Grid>

					{/* Table */}

					
					{/* Right Column - Poster / Script */}
					<Grid mobile={12} tablet={12} sx={{backgroundColor: ""}}>

					{singleProjectTickets.length > 0 ? (
						<GetSingleProjectTable />
					):(
						<Box>
							<Typography>No tickets created.</Typography>
						</Box>
					)}


					</Grid>

				</Grid>

			</Container>

			{/* Delete modal */}
			<Modal
				isOpen={modalIsOpen}
				onRequestClose={closeModal}
				style={{
					overlay: {
						zIndex: 1000,
						backgroundColor: "rgba(0,0,0,0.4)"
					},
					content: {
						backgroundColor: "#f2f4f8",
						borderRadius: "1rem",
						display: "flex",
						flexDirection: "column",
						height: "160px",
						maxWidth: "400px",
						margin: "auto"
					}
				}}
			>
				<Typography sx={{mb: 2, fontWeight: "bold"}}>
					Are you sure you want to delete? 
				</Typography>
					
				<Typography sx={{mb: 2}}>
					All associated tickets will also be deleted.
				</Typography>
				
				<Stack direction="row" justifyContent="flex-end">
					<Button onClick={closeModal}>Cancel</Button>
					<Button onClick={handleDeleteProject} color="error">Delete</Button>
				</Stack>
			</Modal>
		</>

	)
}
export default GetSingleProject