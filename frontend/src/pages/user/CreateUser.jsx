// React
import {useState} from 'react'
import {useNavigate} from 'react-router-dom'

// Redux
import {useDispatch} from 'react-redux'
import {createUser} from '../../features/user/userSlice'

// Helmet Meta Tags
import MetaTags from '../../utilities/MetaTags'

// Toastify
import {toast} from 'react-toastify'

// Error Handling
import useErrorHandling from '../../utilities/useErrorHandling'

// Material UI
import {Box, Container, IconButton, InputAdornment, MenuItem, Select, Stack, TextField, Typography} from '@mui/material'

// MUI Icons
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'

// Components
import RandomImageBox from '../../components/RandomImageBox'
import CustomCard from '../../components/CustomCard'
import CustomLoadingButton from '../../components/CustomLoadingButton'



// CreateUser
const CreateUser = () => {

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
			toast.error(`Please select a role.`)
			setIsLoading(false)
		} else {

			const userData = {
				name,
				email,
				password,
				role
			}
			
			dispatch(createUser(userData))
				.unwrap()
				.then((user) => {
					toast.success(`Registered new user - ${user.name}`)
					navigate(`/users/${user._id}`)
				})
				.catch((error) => {
					checkError(error)
					setIsLoading(false)
				})
		}
	}



	return (
		<>
			<MetaTags title="Create A User" />
		
			<Container maxWidth="laptop">

				{/* Header and Create Button */}
				<Stack direction="row" alignItems="center" justifyContent="space-between" sx={{pb: 2, pt: 1.5}}>
					<Typography variant="h4">Create A New User</Typography>
				</Stack>

				{/* Create Box */}
				<CustomCard>
					<Box sx={{ display: "flex"}}>

						<Box sx={{ width: {mobile: "100%", tablet: "50%"}, backgroundColor: "light grey", margin: "auto", pt: 3, pb: 3, borderRight: "solid 1px #EAEAEA"}}>
							<Container>

								<Box component="form" autoComplete="off" onSubmit={onSubmit}>

									<Stack spacing={3}>

										{/* Name */}
										<TextField type="text" id="name" name="name" value={name} onChange={onChange} label="Full name" required />

										{/* Email Address */}
										<TextField type="email" id="email" name="email" value={email} onChange={onChange} label="Email address" required/>

										{/* Role */}
										<Select id="role" name="role" value={role} onChange={onChange} required>
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
										/>

										{/* Submit Button */}
										<CustomLoadingButton loading={isLoading} variant="contained" type="submit" sx={{height: "50px"}}>Create User</CustomLoadingButton>

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
export default CreateUser