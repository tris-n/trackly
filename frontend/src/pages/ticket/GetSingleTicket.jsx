// React
import {useEffect, useState} from 'react'
import {Link, useParams, useNavigate} from 'react-router-dom'

// Redux
import {useSelector, useDispatch} from 'react-redux'
import {getSingleTicket, deleteTicket, resetTickets, resetSingleTicket} from '../../features/ticket/ticketSlice'
import { resetComments } from '../../features/comment/commentSlice'
import { resetHistory } from '../../features/history/historySlice'

// Helmet Meta Tags
import MetaTags from '../../utilities/MetaTags'

// Toastify
import {toast} from 'react-toastify'

// React Modal
import Modal from 'react-modal'

// DayJS
import dayjs from 'dayjs'

// Error Handling
import useErrorHandling from '../../utilities/useErrorHandling'

// Material UI
import {Box, Button, Chip, Container, Divider, ListItem, Stack, Tabs, Tab, Typography} from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount'
import DynamicFormIcon from '@mui/icons-material/DynamicForm'
import BoltIcon from '@mui/icons-material/Bolt'
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled'
import InfoIcon from '@mui/icons-material/Info'
import { styled } from '@mui/material/styles'

// Components
import Spinner from '../../components/Spinner'
import CustomButton from '../../components/CustomListItemButton'

// Attachments
import Attachments from './getSingleTicket/Attachments'

// Tabs
import Overview from './getSingleTicket/Overview'
import Comments from './getSingleTicket/Comments'
import History from './getSingleTicket/History'

// Custom Styles
const CustomUserLink = styled(Link)({
	color: "black",
	textDecoration: "underline",
	transition: "all 0.3s ease",
	'&:hover': {
		color: "grey",
		textDecoration: "underline",
	},
})

const tabStyle = {
	'@media (max-width: 365px)': {
		fontSize: {
			desktop: "initial",
			mobile: "70%",
		},
		fontWeight: {
			desktop: "initial",
			mobile: "bold",
		},
	},
}



// GetSingleTicket
const GetSingleTicket = () => {

	const {singleTicket} = useSelector((state) => state.tickets)
	const {user} = useSelector((state) => state.user)

	const [isLoading, setIsLoading] = useState(true)

	const [modalIsOpen, setIsOpen] = useState(false)

	const dispatch = useDispatch()
	const navigate = useNavigate()
	const { ticketId } = useParams()

	const {checkError} = useErrorHandling()


	// Tabs
	const [tabValue, setTabValue] = useState("Comments")

	const handleTabChange = (event, newValue) => {
		setTabValue(newValue)
	}

	const handleEditTicket = () => {
		navigate(`/tickets/update/${ticketId}`)
	}

	const handleDeleteTicket = () => {

		dispatch(deleteTicket(ticketId))
			.unwrap()
			.then(() => {
				toast.success(`Successfully deleted the ticket.`)
				dispatch(resetTickets())
			})
			.catch(error => checkError(error))
		navigate(`/tickets/`)
			
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
		// if there are no tickets, no singleuser
		// or if singleuser id does not equal the params
		if (!singleTicket || ticketId !== singleTicket._id) {

			// fetchData
			const fetchData = async () => {

				setIsLoading(true)

				await dispatch(getSingleTicket(ticketId))
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
		
				await dispatch(getSingleTicket(ticketId))
					.unwrap()
					.catch(error => checkError(error))

			}

			updateData()
		}
		
	}, [ticketId, dispatch])

	// on unmount, reset ticket, allHistory, allHistoryAllComments, and allComments
	useEffect(() => {
		return () => {
			// reset single ticket
			dispatch(resetSingleTicket())

			// reset ticket comments
			dispatch(resetComments())

			// reset ticket history and historyAndComments
			dispatch(resetHistory())

		}
	}, [])

	if (isLoading) {
		return <Spinner />
	}


	return (
		<>
			<MetaTags title={`Get Ticket - ${singleTicket?.name}`} />
		
			<Container maxWidth="laptop">

				<Grid container spacing={0}>

					{/* Top Row */}

					{/* Ticket Title */}
					<Grid mobile={12} tablet={5}>

							<Stack direction="row" alignItems="center">					
								
								<Stack>
									<CustomUserLink to={`/projects/${singleTicket?.projectId}`}>{singleTicket?.projectName}</CustomUserLink>									
									<Typography variant="h5">{singleTicket?.name}</Typography>									
								</Stack>
							</Stack>

					</Grid>
					
					{/* Edit buttons */}
					<Grid mobile={12} tablet={7} sx={{backgroundColor: "", pl: {mobile: 0, tablet: 0}, mt: {mobile: 3, tablet: 0}}}>

						<Stack direction={{mobile: "column", tablet: "row"}} alignItems="flex-start" justifyContent="flex-end" flexDirection={!(user.role === 'Admin' || user.role === 'Project Manager') && 'row-reverse'} sx={{backgroundColor: ""}}>

								{/* Edit Ticket */}
								{ (user.role === 'Admin' || user.role === 'Project Manager' || user.role === 'Developer' || user.role === 'Submitter') && (
								<ListItem sx={{width: "200px", ml: {mobile: -2, tablet: 0}}}>

										<CustomButton labelName="Update Ticket" onClick={handleEditTicket} />

								</ListItem>
								)}

								{/* Delete Ticket */}
								{ (user.role === 'Admin' || user.role === 'Project Manager') && (
								<ListItem sx={{width: "200px", ml: {mobile: -2, tablet: 0}, mr: -2}}>

										<CustomButton labelName="Delete Ticket" deletion onClick={openModal} />

								</ListItem>
								)}
								
							</Stack>

					</Grid>



					{/* Bottom Row */}

					{/* Left Column - Trailer / Details / Staff */}
					<Grid mobile={12} tablet={7} sx={{backgroundColor: "", pt: 2}}>					

					{/* Ticket Details Row */}					
						<Stack direction={{mobile: "column", tablet: "row"}} alignItems="flex-start" spacing={2} sx={{mb: 1, mt: 2}}>
							{/* Status */}
							<Chip label={`Type: ${singleTicket?.type}`} color="default" icon={<DynamicFormIcon />} />
							<Chip label={`Status: ${singleTicket?.status}`} color="default" icon={<InfoIcon />} />
							<Chip label={`Priority: ${singleTicket?.priority}`} color="default" icon={<BoltIcon />} />
						</Stack>

						{/* ASSIGNED, SUBMITTED, CREATED, DUE */}						
						<Stack direction={{mobile: "column", tablet: "row"}} alignItems="flex-start" spacing={2} sx={{mb: 3, mt: 2}}>
							{/* Status */}							
							{singleTicket?.assignedName !== 'zzzzz' ? (
								<Chip label={`Assigned: ${singleTicket?.assignedName}`} color="default" icon={<AccountCircleIcon />} component='a' href={`/users/${singleTicket?.assignedId}`} clickable />
								) : (
								<Chip label={`Assigned: not assigned`} color={singleTicket?.assignedName ? 'error' : 'default'} icon={<AccountCircleIcon />} />
							)}
							<Chip label={`Submitted: ${singleTicket?.creatorName}`} color="default" icon={<SupervisorAccountIcon />} component='a' href={`/users/${singleTicket?.creatorId}`} clickable />							
							<Chip label={`Created: ${dayjs(new Date(singleTicket?.createdAt).toLocaleString(), 'DD/MM/YYYY, HH:mm:ss').format('YYYY-MM-DD')}`} color="default" icon={<AccessTimeFilledIcon />} />
							<Chip label={`Due: ${singleTicket?.dueDate === 0 ? "not set" : dayjs(new Date(singleTicket?.dueDate).toLocaleString(), 'DD/MM/YYYY, HH:mm:ss').format('YYYY-MM-DD')}`} color={singleTicket?.dueDate === 0 || singleTicket?.overDue ? 'error' : 'default'} icon={<AccessTimeFilledIcon />} />
						</Stack>

						



						{/* DESCRIPTION */}
						<Box sx={{pt: 2, pb: 5}}>
							<Typography variant='subtitle2'><strong>Description</strong></Typography>
							<Typography>{singleTicket?.description}</Typography>
						</Box>

						
						{/* ATTACHMENTS */}
						<Attachments />

					</Grid>

					<Grid mobile={12} tablet={12} sx={{backgroundColor: "", pl: {mobile: 0, tablet: 0}, pt: 2}}>


						<Divider />

						{/* ACTIVITY */}
						<Box>
							<Tabs value={tabValue} onChange={handleTabChange}>
								<Tab label="Overview" value="Overview" sx={tabStyle} />
								<Tab label="Comments" value="Comments" sx={tabStyle} />
								<Tab label="History" value="History" sx={tabStyle} />
							</Tabs>
						</Box>


						{/* Overview */}
						{ tabValue === "Overview" && (<Overview />)}

						{/* Comments */}
						{ tabValue === "Comments" && (<Comments />)}
						{/* { tabValue === "Comments" && (<Overview />)} */}
						
						{/* History */}
						{ tabValue === "History" && (<History />)}

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
						height: "120px",
						maxWidth: "400px",
						margin: "auto"
					}
				}}
			>
				<Typography sx={{mb: 2}}>
					Are you sure you want to delete? 
				</Typography>
				
				<Stack direction="row" justifyContent="flex-end">
					<Button onClick={closeModal}>Cancel</Button>
					<Button onClick={handleDeleteTicket} color="error">Delete</Button>
				</Stack>
			</Modal>
		</>

	)
}
export default GetSingleTicket