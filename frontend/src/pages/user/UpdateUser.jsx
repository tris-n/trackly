// React
import {useEffect, useState} from 'react'
import {useNavigate, useParams} from 'react-router-dom'

// Redux
import {useSelector, useDispatch} from 'react-redux'
import {getSingleUser, updateLoggedInUser, updateUser, resetSingleUser} from '../../features/user/userSlice'

// Helmet Meta Tags
import MetaTags from '../../utilities/MetaTags'

// Toastify
import {toast} from 'react-toastify'

// Error Handling
import useErrorHandling from '../../utilities/useErrorHandling'

// Material UI
import {Box, Container, MenuItem, Select, Stack, TextField, Typography} from '@mui/material'

// Components
import Spinner from '../../components/Spinner'
import CustomCard from '../../components/CustomCard'
import CustomLoadingButton from '../../components/CustomLoadingButton'
import RandomImageBox from '../../components/RandomImageBox'



// UpdateUser
const UpdateUser = () => {
	
	// get single user via params
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const {userId} = useParams()

	const {checkError} = useErrorHandling()

	const {singleUser, isLoading, user: loggedInUser} = useSelector((state) => state.user)


	const [formData, setFormData] = useState({
		name: '',
		email: '',
		role: '',
	})

	const {name, email, role} = formData


	// get the user and populate the form with their data
	useEffect(() => {
		dispatch(getSingleUser(userId))
			.unwrap()
			.then((user) => {
				setFormData({
					name: user.name ? user.name : '',
					email: user.email ? user.email : '',
					role: user.role ? user.role : '',
				})
			})
			.catch(error => checkError(error))
	}, [userId, dispatch])

	// Clean up on unmount
	useEffect(() => {
		return () => {
			dispatch(resetSingleUser())
		}
	}, [])

	const onChange = (e) => {
		setFormData((prevState) => ({
			...prevState,
			[e.target.name]: e.target.value,
		}))
	}

	const onSubmit = (e) => {
		e.preventDefault()

		// Form validation
		if (!(role === 'Admin' || role === 'Project Manager' || role === 'Developer' || role === 'Submitter')) {
			toast.error(`Please enter a valid role.`)
		} else {

		const userData = {
			userId,
			userUpdate: {
				name,
				email,
				role
			}
		}

		dispatch(updateUser(userData))
			.unwrap()
			.then((user) => {

				if (userId === loggedInUser._id) {
					dispatch(updateLoggedInUser())
				}

				toast.success(`Updated user - ${user.name}`)
				navigate(`/users/${user._id}`)
				
			})
			.catch(error => checkError(error))

		}
	}

	if (!singleUser || !loggedInUser) {
		return <Spinner />
	}



	return (
		<>
			<MetaTags title={`Update User - ${singleUser.name}`} />
		
			<Container maxWidth="laptop">

				{/* Header and Create Button */}
				<Stack direction="row" alignItems="center" justifyContent="space-between" sx={{pb: 2, pt: 1.5}}>
					<Typography variant="h4">Update User</Typography>
				</Stack>

				{/* Create Box */}
				<CustomCard>
					<Box sx={{ display: "flex"}}>

						<Box sx={{ width: {mobile: "100%", tablet: "50%"}, backgroundColor: "light grey", margin: "auto", pt: 3, pb: 3}}>
							<Container>			

								<Box component="form" autoComplete="off" onSubmit={onSubmit}>

									<Stack spacing={3}>

										{/* Name */}
										<TextField type="text" id="name" name="name" value={name} onChange={onChange} label="Full name" required />

										{/* Email Address */}
										<TextField type="email" id="email" name="email" value={email} onChange={onChange} label="Email address" required/>

										{/* Role */}
										{ singleUser.role !== 'studio head' && (
											<Select id="role" name="role" value={role} onChange={onChange} required>
												<MenuItem value={"default"} disabled>Please select a role</MenuItem>
												<MenuItem value={"Admin"}>Admin</MenuItem>
												<MenuItem value={"Project Manager"}>Project Manager</MenuItem>
												<MenuItem value={"Developer"}>Developer</MenuItem>
												<MenuItem value={"Submitter"}>Submitter</MenuItem>
											</Select>
										)}

										{/* Submit Button */}
										<CustomLoadingButton loading={isLoading} variant="contained" type="submit" sx={{height: "50px"}}>Update User</CustomLoadingButton>

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
export default UpdateUser