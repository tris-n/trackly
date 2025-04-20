// React
import { useState } from 'react'
import {NavLink as RouterLink, useNavigate} from 'react-router-dom'

// Redux
import {useSelector, useDispatch} from 'react-redux'
import {logout} from '../../../features/user/userSlice'

// Material UI
import {Avatar, Box, Divider, IconButton, MenuItem, Popover, Stack, Typography} from '@mui/material'
import { styled } from '@mui/material/styles'

// Components
import Spinner from '../../../components/Spinner'

// Custom Styles
const WhiteUpArrow = styled(Box)({
	width: "11px", 
	height: "11px", 
	backgroundColor: "white",
	position: "absolute",
	top: "-6px",
	right: "21px",
	borderRadius: "20%",
	transform: "rotate(-135deg)",
	zIndex: 2,
})





const DropDownMenu = () => {

	const navigate = useNavigate()
	const dispatch = useDispatch()
	const {user} = useSelector((state) => state.user)

	// Links
	const navConfig = [
		{
			title: 'Dashboard',
			path: '/dashboard',
			icon: 'house'
		},
		{
			title: 'Profile',
			path: `/users/${user._id}`,
			icon: 'three people'
		},
		{
			title: 'Settings',
			path: `/users/update/${user._id}`,
			icon: 'pencil'
		},
	]

	const [isOpen, setIsOpen] = useState(false)

	const openMenu = (event) => {
		setIsOpen(event.currentTarget)
	}

	const closeMenu = () => {
		setIsOpen(false)
	}

	const onLogout = () => {
		setIsOpen(false)
		dispatch(logout())
		navigate('/')
	}

	if (!user) {
		return <Spinner />
	}



	return (
		<>
			<IconButton onClick={openMenu}
				sx={{
					p: 0,
					...(isOpen && {
						'&:before': {
							zIndex: 1,
							content: "''",
							width: '100%',
							height: '100%',
							borderRadius: '50%',
							position: 'absolute',
							bgcolor: 'rgba(0, 0, 0, 0.55)',
						}
					})
				}}
			>
				<Avatar src={`/images/titleLetters/${user.name.slice(0,1).toLowerCase()}.png`} alt="" width="45px" />
			</IconButton>
		
			<Popover
				open={Boolean(isOpen)}
				onClose={closeMenu}
				anchorEl={isOpen}
				anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
				transformOrigin={{ vertical: 'top', horizontal: 'right' }}
				PaperProps={{
					sx: {
						p: 0,
						ml: 0.75,
						overflow: "visible",
					}
				}}
			>
				<WhiteUpArrow />

				<Box sx={{ my: 1.5, px: 2.5 }}>
					<Typography>{user.name}</Typography>
					<Typography>{user.email}</Typography>
				</Box>

				<Divider sx={{ borderStyle: 'dashed' }} />

				<Stack>
					{navConfig.map((link, index) => (
						<MenuItem onClick={closeMenu} component={RouterLink} to={link.path} key={index}>
							{link.title}
						</MenuItem>
					))}
				</Stack>

				<Divider sx={{ borderStyle: 'dashed' }} />

				<MenuItem onClick={onLogout}>
						Logout
				</MenuItem>

			</Popover>
		
		</>
	)
}

export default DropDownMenu