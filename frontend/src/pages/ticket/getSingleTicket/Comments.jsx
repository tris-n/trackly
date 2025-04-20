// React
import {useEffect, useState} from 'react'
import {useParams} from 'react-router-dom'

// Redux
import {useSelector, useDispatch} from 'react-redux'
import {createComment, getAllComments} from '../../../features/comment/commentSlice'

// Error Handling
import useErrorHandling from '../../../utilities/useErrorHandling'

// Material UI
import {Avatar, Box, Stack, TextField, Typography} from '@mui/material'

// Components
import Spinner from '../../../components/Spinner'
import CustomLoadingButton from '../../../components/CustomLoadingButton'


// Comments
const Comments = () => {

	const {user} = useSelector((state) => state.user)
	const {allComments} = useSelector((state) => state.comments)

	const [commentsLoading, setCommentsLoading] = useState(true)

	const [formData, setFormData] = useState({
		description: '',
	})

	const {description} = formData

	const dispatch = useDispatch()
	const { ticketId } = useParams()

	const {checkError} = useErrorHandling()

	const [isLoading, setIsLoading] = useState(false)

	useEffect(() => {

		const fetchData = async () => {

			setCommentsLoading(true)

			await dispatch(getAllComments({query: [
				{ticketId: ticketId},
			]}))
				.unwrap()
				.catch(error => checkError(error))
			
			setCommentsLoading(false)

		}

		fetchData()
		
	}, [dispatch])


	const onChange = (e) => {
		setFormData((prevState) => ({
			...prevState,
			[e.target.name]: e.target.value,
		}))
	}

	const onSubmit = (e) => {
		e.preventDefault()

		setIsLoading(true)

			// attach the ticketId
			let commentData = {
				description,
				ticketId
			}

			dispatch(createComment(commentData))
				.unwrap()
				.then((ticket) => {
					setFormData({description: ''})
					setIsLoading(false)

					const fetchData = async () => {

						setCommentsLoading(true)
			
						await dispatch(getAllComments({query: [
							{ticketId: ticketId},
						]}))
							.unwrap()
							.catch(error => checkError(error))
						
						setCommentsLoading(false)
			
					}
			
					fetchData()

				})
				.catch((error) => {
					checkError(error)
					setIsLoading(false)
				})


	}
	
	if (!allComments || !user) {
		return <Spinner hidden={true} />
	}


	return (
		<>
			<Box component="form" autoComplete="off" onSubmit={onSubmit}>
				<Stack direction={{tablet: "row", mobile: "column"}} alignItems={{tablet: "center", mobile: "flex-start"}} justifyContent="space-between" sx={{pt: 3, pb: 3}}>

					<Stack direction="row" alignItems="center" sx={{width: `calc(100% + 16px)`}}>
						{/* Avatar */}
						<Avatar src={`/images/titleLetters/${user.name.slice(0,1).toLowerCase()}.png`} alt="" width="45px" />

						{/* Name */}
						<TextField type="text" id="description" name="description" value={description} onChange={onChange} label="Add a comment..." required fullWidth sx={{ml: 1, mr: 2, backgroundColor: "white"}} />
					</Stack>

					{/* Submit Button */}
					<CustomLoadingButton loading={isLoading} variant="contained" type="submit" sx={{height: "50px", maxWidth: {tablet: "185px", mobile: "100%"}, mt: {tablet: -1.5, mobile: 2}}}>Save</CustomLoadingButton>

				</Stack>
			</Box>

			<Box>
				{allComments?.slice().reverse().map((comment, index) => (
					<Stack key={index} direction="row" alignItems="center" sx={{pb: 2}}>
						{/* Avatar */}
						<Avatar src={`/images/titleLetters/${comment.creatorId.name.slice(0,1).toLowerCase()}.png`} alt="" width="45px" />

						<Stack sx={{ml: 1}}>
								{/* Name -  Date*/}
								<Stack direction={{desktop: "row", mobile: "column-reverse"}} spacing={{desktop: 2, mobile: 0}}>
									<Typography><strong>{comment.creatorId.name}</strong></Typography>
									<Typography sx={{color: "grey"}}>{comment.createdAt.split('T')[0]} {comment.createdAt.split('T')[1].slice(0,5)}</Typography>
								</Stack>
								{/* Comment */}
								<Typography variant='subtitle2'>{comment.description}</Typography>
						</Stack>

					</Stack>
				))}
			</Box>
		</>
	)
}

export default Comments