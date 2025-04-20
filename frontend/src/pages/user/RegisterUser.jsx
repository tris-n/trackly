// React
import {useState} from 'react'
import {useNavigate} from 'react-router-dom'

// Redux
import {useDispatch} from 'react-redux'
import {registerUser, loginUser} from '../../features/user/userSlice'

// Helmet Meta Tags
import MetaTags from '../../utilities/MetaTags'

// Toastify
import {toast} from 'react-toastify'

// Error Handling
import useErrorHandling from '../../utilities/useErrorHandling'

// Material UI
import {Box, Container, IconButton, InputAdornment, Link, MenuItem, Select, Stack, TextField, Typography} from '@mui/material'

// MUI Icons
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'

// Logo
import LogoName from '../../layout/logo/LogoName'

// Components
import RandomImageBox from '../../components/RandomImageBox'
import CustomLoadingButton from '../../components/CustomLoadingButton'



// RegisterUser
const RegisterUser = () => {

	const [formData, setFormData] = useState({
		name: '',
		email: '',
		password: '',
		password2: '',
		role: 'default',
	})

	const {name, email, password, role} = formData

	const [showPassword, setShowPassword] = useState(false)

	const dispatch = useDispatch()
	const navigate = useNavigate()

	const {checkError} = useErrorHandling()

	const [isLoading, setIsLoading] = useState(false)


	const onChange = (e) => {
		setFormData((prevState) => ({
			...prevState,
			[e.target.name]: e.target.value,
		}))
	}

	const onSubmit = (e) => {
		e.preventDefault()

		setIsLoading(true)

		// Form validation
		if (!(role === 'Admin' || role === 'Project Manager' || role === 'Developer' || role === 'Submitter')) {
			toast.error(`Please enter a valid role.`)
			setIsLoading(false)
		} else {

			const userData = {
				name,
				email,
				password,
				role
			}
			
			// register user
			dispatch(registerUser(userData))
				.unwrap()
				.then((user) => {

					// if successful, log them in
					const userLoginData = {
						email: userData.email,
						password: userData.password
					}
					
					dispatch(loginUser(userLoginData))
						.unwrap()
						.then((user) => {
							toast.success(`Welcome to Trackly ${user.name}!`)
							navigate('/dashboard')
						})
						.catch((error) => {
							checkError(error)
							setIsLoading(false)
						})

				// if there is an error in registration
				})
				.catch((error) => {
					checkError(error)
					setIsLoading(false)
				})

		}
	}



	return (
		<>
			<MetaTags title="Register" />
		
			<Box sx={{ display: "flex", minHeight: "100vh"}}>

				<RandomImageBox fullWidth={true} />

				<Box sx={{ width: {mobile: "100%", tablet: "633px"}, backgroundColor: "light grey", margin: "auto"}}>
					<Container maxWidth="laptop" sx={{pt: {mobile: 2, tablet: 0}, pb: {mobile: 2, tablet: 0}}}>

						<Typography variant="h5" gutterBottom>
							Get Started With <LogoName />
						</Typography>
						
						<Typography variant="body2" sx={{ mb: 3}}>
							Already have an account? <Link href="/">Sign in</Link>
						</Typography>

						<Box component="form" autoComplete="off" onSubmit={onSubmit}>

							<Stack spacing={3}>

								{/* Name */}
								<TextField type="text" id="name" name="name" value={name} onChange={onChange} label="Your name" required sx={{backgroundColor: "white"}} />

								{/* Email Address */}
								<TextField type="email" id="email" name="email" value={email} onChange={onChange} label="Email address" required sx={{backgroundColor: "white"}} />

								{/* Role */}
								<Select id="role" name="role" value={role} onChange={onChange} required sx={{backgroundColor: "white"}}>
									<MenuItem value={"default"} disabled>Please select a role</MenuItem>
									<MenuItem value={"Admin"}>Admin</MenuItem>
									<MenuItem value={"Project Manager"}>Project Manager</MenuItem>
									<MenuItem value={"Developer"}>Developer</MenuItem>
									<MenuItem value={"Submitter"}>Submitter</MenuItem>
								</Select>

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
								<CustomLoadingButton loading={isLoading} variant="contained" type="submit" sx={{height: "50px"}}>Create Account</CustomLoadingButton>

							</Stack>


						</Box>

					</Container>

					
						
				</Box>

			</Box>
		</>
	)
}
export default RegisterUser