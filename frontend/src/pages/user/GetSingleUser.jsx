// React
import {useEffect, useState} from 'react'
import {Link, useNavigate, useParams} from 'react-router-dom'

// Redux
import {useSelector, useDispatch} from 'react-redux'
import {getSingleUser, deleteUser, resetSingleUser} from '../../features/user/userSlice'
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
import { styled } from '@mui/material/styles'

// MUI Icons
import InboxIcon from '@mui/icons-material/Inbox'
import BarChartIcon from '@mui/icons-material/BarChart'
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle'


// Components
import Spinner from '../../components/Spinner'
import CustomButton from '../../components/CustomListItemButton'
import GetSingleUserTable from './getSingleUser/GetSingleUserTable'

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



// GetSingleUser
const GetSingleUser = () => {

	const {singleUser, user} = useSelector((state) => state.user)
	const {singleUserTickets} = useSelector((state) => state.tickets)

	const [isLoading, setIsLoading] = useState(true)

	const [modalIsOpen, setIsOpen] = useState(false)

	const dispatch = useDispatch()
	const navigate = useNavigate()
	const { userId } = useParams()

	const {checkError} = useErrorHandling()

	// Fetch information
	useEffect(() => {

		// if there is no data, fetch it
		// if there are no tickets, no singleuser
		// or if singleuser id does not equal the params
		if (!singleUserTickets || !singleUser || userId !== singleUser._id) {

			// fetchData
			const fetchData = async () => {

				setIsLoading(true)
				
				await dispatch(getAllTickets({query: [
					{queryType: 'singleUser'},
					{creatorId: userId},
					{assignedId: userId},
				]}))
					.unwrap()
					.catch(error => checkError(error))
				
				await dispatch(getSingleUser(userId))
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
					{queryType: 'singleUser'},
					{creatorId: userId},
					{assignedId: userId},
				]}))
					.unwrap()
					.catch(error => checkError(error))
				
				await dispatch(getSingleUser(userId))
					.unwrap()
					.catch(error => checkError(error))
	
			}
	
			updateData()
		}

	}, [userId, dispatch])

	const handleEditUser = () => {
		navigate(`/users/update/${userId}`)
	}

	const handleDeleteUser = () => {

		dispatch(deleteUser(userId))
			.unwrap()
			.then(() => {
				toast.success(`Successfully deleted the user.`)
				dispatch(resetSingleUser())
			})
			.catch(error => checkError(error))
			navigate(`/users/`)
			
	}


	// Modal settings
	const openModal = () => {
		setIsOpen(true)
	}
	
	const closeModal = () => {
		setIsOpen(false)
	}



	if (isLoading) {
		return <Spinner />
	}


	return (
		<>
			<MetaTags title={`Get User - ${singleUser?.name}`} />

			<Container maxWidth="laptop">

				<Grid container spacing={0}>

					{/* Top Row */}

					{/* User Name */}
					<Grid mobile={12} tablet={5}>

							<Stack direction="row" alignItems="center">
								<Avatar src={`/images/titleLetters/${singleUser?.name.slice(0,1).toLowerCase()}.png`} alt="" sx={{mr: 2, height: 50, width: 50}}/>
								
								<Stack>
									<Typography variant="h5">{singleUser?.name}</Typography>
									<Typography variant="subtitle2"><CustomUserLink to={`mailto:${singleUser?.email}`}>{singleUser?.email}</CustomUserLink></Typography>
								</Stack>
							</Stack>

					</Grid>

					{/* Edit buttons */}
					<Grid mobile={12} tablet={7} sx={{backgroundColor: "", pl: {mobile: 0, tablet: 0}, mt: {mobile: 3, tablet: 0}}}>

						<Stack direction={{mobile: "column", tablet: "row"}} alignItems={{mobile: "flex-start", tablet: "flex-end"}} justifyContent="flex-end" flexDirection={!(user.role === 'Admin' || user.role === 'Project Manager') && 'row-reverse'} sx={{backgroundColor: ""}}>

								{/* New Ticket */}
								{ (user.role === 'Admin' || user.role === 'Project Manager' || user.role === 'Developer' || user.role === 'Submitter') && (
								<ListItem sx={{width: "180px", ml: {mobile: -2, tablet: 0}}}>

										<CustomButton labelName="New Ticket" onClick={() => navigate(`/tickets/create?assignedId=${userId}`)} />

								</ListItem>
								)}

								{/* Edit User */}
								{ (user.role === 'Admin' || user.role === 'Project Manager') && (
								<ListItem sx={{width: "200px", ml: {mobile: -2, tablet: 0}}}>

										<CustomButton labelName="Update User" onClick={handleEditUser} />

								</ListItem>
								)}

								{/* Delete User */}
								{ (user.role === 'Admin' || user.role === 'Project Manager') && (
								<ListItem sx={{width: "200px", ml: {mobile: -2, tablet: 0}, mr: -2}}>

										<CustomButton labelName="Delete User" deletion onClick={openModal} />									

								</ListItem>
								)}
								
							</Stack>

					</Grid>



					{/* Bottom Row */}

					{/* Left Column - Trailer / Details / Staff */}
					<Grid mobile={12} tablet={12} sx={{backgroundColor: "", pt: 2}}>

						{/* Project Details Row */}
						<Stack direction={{mobile: "column", tablet: "row"}} alignItems="flex-start" justifyContent="flex-start" spacing={2} sx={{mb: 3, mt: 2}}>
							{/* Status */}
							<Chip label={`Role: ${singleUser?.role}`} color="default" icon={<SupervisedUserCircleIcon />} />
							<Chip label={`Total Tickets: ${singleUserTickets.length}`} color="default" icon={<BarChartIcon />} />
							<Chip label={`Open Tickets: ${singleUserTickets.filter((ticket) => ticket.status !== "Done").length}`} color="default" icon={<InboxIcon />} />
						</Stack>
			
						{/* Table */}
						{singleUserTickets.length > 0 ? (
							<GetSingleUserTable />
						):(
							<Box>
								<Typography>No tickets assigned or created.</Typography>
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
						height: "210px",
						maxWidth: "400px",
						margin: "auto"
					}
				}}
			>
				<Typography sx={{mb: 2, fontWeight: "bold"}}>
					Are you sure you want to delete? 
				</Typography>
					
				<Typography sx={{mb: 2}}>
					Deletion will remove the user from all tickets they've been assigned to and delete all the tickets they've created.
				</Typography>
				
				<Stack direction="row" justifyContent="flex-end">
					<Button onClick={closeModal}>Cancel</Button>
					<Button onClick={handleDeleteUser} color="error">Delete</Button>
				</Stack>
			</Modal>
		</>
	)
}
export default GetSingleUser