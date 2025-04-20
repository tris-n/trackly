// React
import {useNavigate} from 'react-router-dom'

// Redux
import {useSelector, useDispatch} from 'react-redux'
import {logout} from '../../../features/user/userSlice'

// Material UI
import {Avatar, Box, Card, CardActionArea, Typography} from '@mui/material'
import { styled } from '@mui/material/styles'

// Components
import Spinner from '../../../components/Spinner'

// Custom Styles
const CardBox = styled(Card)({
	borderRadius: "10px", 
	border: "solid 1px #EAEAEA",
	marginTop: "20px", 
	marginBottom: "20px", 
	backgroundColor: "rgba(145, 158, 171, 0.12)"
})



const AccountBox = () => {

	const navigate = useNavigate()
	const dispatch = useDispatch()
	const {user} = useSelector((state) => state.user)

	const onLogout = () => {
		dispatch(logout())
		navigate('/')
	}

	const cardClick = () => {
		navigate(`/users/${user._id}`)
	}

	if (!user) {
		return <Spinner />
	}



	return (
		<CardBox elevation={0}>
			<CardActionArea onClick={cardClick}>
				<Box sx={{display: "flex", alignItems: "center", margin: 1.5}}>

					<Box sx={{ margin: "0 10px 0 0", padding: 0}}>
						<Avatar src={`/images/titleLetters/${user.name.slice(0,1).toLowerCase()}.png`} alt="" width="45px" />
					</Box>

					<Box>
						<Typography sx={{fontWeight: "bold"}}>{user.name.split(" ", 1)}</Typography>
						<Typography>{user.role}</Typography>
					</Box>

				</Box>
			</CardActionArea>
		</CardBox>
	)
}
export default AccountBox