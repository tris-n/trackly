// React
import {useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom'

// Redux
import {useSelector, useDispatch} from 'react-redux'
import {loginUser} from '../../features/user/userSlice'

// Helmet Meta Tags
import MetaTags from '../../utilities/MetaTags'

// Toastify
import {toast} from 'react-toastify'

// Error Handling
import useErrorHandling from '../../utilities/useErrorHandling'

// Material UI
import {Box, Button, Container, Divider, IconButton, InputAdornment, Link, Stack, TextField, Typography} from '@mui/material'
import { styled } from '@mui/material/styles'

// MUI Icons
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'

// React-Icons
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'

// Logo
import LogoName from '../../layout/logo/LogoName'

// Components
import RandomImageBox from '../../components/RandomImageBox'
import CustomLoadingButton from '../../components/CustomLoadingButton'

// // Custom Styles
const CustomAlertBox = styled(Stack)({
	border: "solid 1px #CCDBEF", 
	borderRadius: "10px",
	backgroundColor: "rgba(229, 246, 253, 1)",
	color: "rgba(1, 67, 97, 1)",
	fontSize: "14px",
	fontWeight: "400",
	letterSpacing: "0.15px",
	lineHeight: "20px",
	padding: "13px 16px 13px 16px",
	marginBottom: "15px",
	marginTop: "30px",
	whiteSpace: "nowrap",
	display: "flex",
	alignItems: "center",
	flexDirection: 'row',
	'@media (max-width: 1200px)': {
		flexDirection: 'column',
	},
})

const CustomDemoButton = styled(Button)({
	textTransform: "initial",
	border: "solid 1px #CCDBEF", 
	backgroundColor: "#DFEFFA",
	color: "rgba(1, 67, 97, 1)",
	borderRadius: "10px",
	padding: "3px 8px",
	fontSize: "14px",
	"&:hover": {
		backgroundColor: "rgba(2, 136, 209, 0.1)",
	}
})



// LoginUser
const LoginUser = () => {

	const {user} = useSelector((state) => state.user)

	const [formData, setFormData] = useState({
		email: '',
		password: '',
	})

	const {email, password} = formData

	const [showPassword, setShowPassword] = useState(false)

	const dispatch = useDispatch()
	const navigate = useNavigate()

	const {checkError} = useErrorHandling()

	const [isLoading, setIsLoading] = useState(false)

	// check if user is already logged in
	useEffect(() => {
		if (user) {
			navigate('/dashboard')
		}
	}, [user])

	// on form change
	const onChange = (e) => {
		setFormData((prevState) => ({
			...prevState,
			[e.target.name]: e.target.value,
		}))
	}

	// on form submit
	const onSubmit = (e) => {
		e.preventDefault()

		setIsLoading(true)

		const userData = {
			email,
			password,
		}

		dispatch(loginUser(userData))
			.unwrap()
			.then((user) => {
				toast.success(`Logged in as ${user.name}`)
				navigate('/dashboard')
			})
			.catch((error) => {
				checkError(error)
				setIsLoading(false)
			})

	}

	// handle demo login clicks
	const onDemoLogin = (role) => {
		const adminConfig = JSON.parse(process.env.REACT_APP_DEMO_ADMIN)
		const projectmanagerConfig = JSON.parse(process.env.REACT_APP_DEMO_PROJECTMANAGER)
		const developerConfig = JSON.parse(process.env.REACT_APP_DEMO_DEVELOPER)
		const submitterConfig = JSON.parse(process.env.REACT_APP_DEMO_SUBMITTER)

		let userData

		if (role === "Admin") userData = adminConfig
		if (role === "Project Manager") userData = projectmanagerConfig
		if (role === "Developer") userData = developerConfig
		if (role === "Submitter") userData = submitterConfig

		dispatch(loginUser(userData))
			.unwrap()
			.then((user) => {
				toast.success(`Logged in as ${user.name}`)
				navigate('/dashboard')
			})
			.catch((error) => {
				checkError(error)
				setIsLoading(false)
			})

	}



	return (
		<>
			<MetaTags title="Welcome!" />
		
			<Box sx={{ display: "flex", minHeight: "100vh"}}>

				<RandomImageBox fullWidth={true} />

				<Box sx={{ width: {tablet: "633px", mobile: "100%" }, backgroundColor: "light grey", margin: "auto"}}>
					<Container maxWidth="laptop" sx={{pt: {mobile: 2, tablet: 0}, pb: {mobile: 2, tablet: 0}}}>

						<Typography variant="h5" gutterBottom>
							Sign In To <LogoName />
						</Typography>
						
						<Typography variant="body2" sx={{ mb: 3}}>
							New user? Create an <Link href="/register">account</Link>
						</Typography>

						<Box component="form" autoComplete="off" onSubmit={onSubmit}>

							<Stack spacing={3}>

								{/* Email Address */}
								<TextField id="email" name="email" type="email" value={email} onChange={onChange} label="Email address" required sx={{backgroundColor: "white"}}/>

								{/* Password */}
								<TextField 
									id="password" 
									name="password" 
									type={showPassword ? 'text' : 'password'} 
									InputProps={{
										endAdornment: (
											<InputAdornment position="end">
												<IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
													{showPassword ? <Visibility /> : <VisibilityOff />}
												</IconButton>
											</InputAdornment>
										),
									}}
									value={password} 
									onChange={onChange} 
									label="Password" 
									required
									sx={{backgroundColor: "white"}}
								/>

								{/* Submit Button */}
								<CustomLoadingButton loading={isLoading} variant="contained" type="submit" sx={{height: "50px"}}>Login</CustomLoadingButton>

							</Stack>


						</Box>

						<Divider sx={{marginTop: "30px", opacity: "0.5"}} />

						<CustomAlertBox>

							<Stack direction="row">
								<InfoOutlinedIcon sx={{color: "rgba(2, 136, 209, 1)", fontSize: "22px", fontWeight: "400", opacity: "0.9", marginRight: "12px"}} />
								Demo application as:
							</Stack>

							<Box sx={{
								display: "flex",
								flexDirection: "row",
								gap: 1,
								paddingLeft: {laptop: 1, tablet: 0, mobile: 0},
								paddingTop: {laptop: 0, tablet: 1, mobile: 1},
								'@media (max-width: 450px)': {
									flexDirection: 'column',
								},
							}}>
								<CustomDemoButton onClick={() => onDemoLogin("Admin")}>Admin</CustomDemoButton> 
								<CustomDemoButton onClick={() => onDemoLogin("Project Manager")}>Project Manager</CustomDemoButton> 
								<CustomDemoButton onClick={() => onDemoLogin("Developer")}>Developer</CustomDemoButton> 
								<CustomDemoButton onClick={() => onDemoLogin("Submitter")}>Submitter</CustomDemoButton>
							</Box>

						</CustomAlertBox>

					</Container>

					
						
				</Box>

			</Box>
		</>

	)
}

export default LoginUser