// React
import { useEffect, useState } from 'react'
import {NavLink as RouterLink, useNavigate, useLocation} from 'react-router-dom'

// Redux
import {useSelector, useDispatch} from 'react-redux'
import {logout} from '../../../features/user/userSlice'

// Material UI
import {Box, Collapse, List, ListItem, ListItemButton, ListItemText} from '@mui/material'
import { styled } from '@mui/material/styles'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'

// Components
import Spinner from '../../../components/Spinner'

// Custom Styles
const ListItemButtonStyled = styled(ListItemButton)({
	borderRadius: "10px", 
	color: "rgba(0,0,0,0.8)",
	marginTop: "5px",
	'&.Mui-selected': {
		backgroundColor: "rgba(250, 225, 225, 1)",
		border: "solid 1px rgba(235, 205, 205, 1)",
	},
	'&.Mui-selected:hover': {
		backgroundColor: "rgba(235, 205, 205, 1)",
	},
})



const ListBox = () => {

	const {pathname} = useLocation()

	const navigate = useNavigate()
	const dispatch = useDispatch()
	const {user} = useSelector((state) => state.user)

	// Handle Nested Menu Items
	const [open, setOpen] = useState(null)

	// Set the value of the open state based on navConfig
	useEffect(() => {
		let visibleState = []

		for (const value of navConfig.filter(link => link.sublinks)) {
			visibleState.push({visible: false})
		}

		setOpen(visibleState)
	}, []) 

	// Handle menu drawer clicks
	const handleClick = (index) => {
		setOpen((prevState) => {
			const updatedOpen = [...prevState]
			updatedOpen[index] = { visible: !updatedOpen[index].visible }
			return updatedOpen
		})
	}	

	// Links
	const navConfig = [
		// home
		{
			title: 'Dashboard',
			path: '/dashboard',
			icon: 'house',
			visible: "initial",
		},
		// projects
		{
			title: 'Projects',
			path: null,
			icon: 'film clapper',
			visible: "initial",
			sublinks: [
				{
					title: 'All Projects',
					path: '/projects',
					icon: 'film clapper',
					visible: "initial",
				},
				{
					title: 'Create Project',
					path: '/projects/create',
					icon: 'palette',
					visible: user.role === 'Admin' ? "initial" : "none"
				},
			]
		},
		// tickets
		{
			title: 'Tickets',
			path: null,
			icon: 'film clapper',
			visible: "initial",
			sublinks: [
				{
					title: 'All Tickets',
					path: '/tickets',
					icon: 'film clapper',
					visible: "initial",
				},
				{
					title: 'My Tickets',
					path: `/users/${user._id}`,
					icon: 'film clapper',
					visible: "initial",
				},
				{
					title: 'Create Ticket',
					path: '/tickets/create',
					icon: 'palette',
					visible: "initial",
				},
			]
		},
		// users
		{
			title: 'Users',
			path: null,
			icon: 'three people',
			visible: user.role === 'Admin' || user.role === 'Project Manager' ? "initial" : "none",
			sublinks: [
				{
					title: 'All Users',
					path: '/users',
					icon: 'three people',
					visible: user.role === 'Admin' || user.role === 'Project Manager' ? "initial" : "none",
				},
				{
					title: 'Create User',
					path: '/users/create',
					icon: 'pencil',
					visible: user.role === 'Admin' || user.role === 'Project Manager' ? "initial" : "none"
				},
			]
		},
	]

	const onLogout = () => {
		dispatch(logout())
		navigate('/')
	}

	if (!user) {
		return <Spinner />
	}



	return (
		<Box>
			{open && (

			
			<List>
				{/* Cycle through the navConfig */}
				{navConfig.map((link, index) =>
				
					link.sublinks ? (
						<div key={index}>
							{/* Main category button */}
							<ListItem disablePadding component={RouterLink} to={link.path} key={index} sx={{display: `${link.visible}`}} onClick={() => handleClick(index -1)}>
								<ListItemButtonStyled selected={pathname === link.path}>
									<ListItemText>{link.title}</ListItemText>
									{open[index -1].visible ? <ExpandLess /> : <ExpandMore />}
								</ListItemButtonStyled>
							</ListItem>

							{/* Category sublinks */}
							<Collapse in={open ? open[index -1].visible : false} timeout="auto" unmountOnExit>
								{link.sublinks.map((sublink, index) => (
									<ListItem disablePadding component={RouterLink} to={sublink.path} key={index} sx={{display: `${sublink.visible}`}}>
										<ListItemButtonStyled selected={pathname === sublink.path} sx={{color: "rgba(0,0,0,0.6)", ml: 0}}>
											<ListItemText>{sublink.title}</ListItemText>
										</ListItemButtonStyled>
									</ListItem>
								))}
							</Collapse>
						</div>

					):(
					// these items have no sublinks
						<ListItem disablePadding component={RouterLink} to={link.path} key={index} sx={{display: `${link.visible}`}}>
							<ListItemButtonStyled selected={pathname === link.path} sx={{color: "rgba(0,0,0,0.8)"}}>
								<ListItemText>{link.title}</ListItemText>
							</ListItemButtonStyled>
						</ListItem>
					)
				)}

				<ListItem disablePadding sx={{pt: 6}} >
					<ListItemButtonStyled sx={{backgroundColor: "rgba(145, 158, 171, 0.12)", border: "solid 1px #EAEAEA"}} onClick={onLogout}>
						<ListItemText sx={{color: "rgba(0,0,0,0.8)"}}>Logout</ListItemText>
					</ListItemButtonStyled>
				</ListItem>

			</List>

			)}
		</Box>
	)
}
export default ListBox