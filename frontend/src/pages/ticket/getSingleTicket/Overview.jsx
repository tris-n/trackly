// React
import {useEffect, useState} from 'react'
import {useParams} from 'react-router-dom'

// Redux
import {useSelector, useDispatch} from 'react-redux'
import {getAllHistoryAllComments} from '../../../features/history/historySlice'

// DayJS
import dayjs from 'dayjs'

// Error Handling
import useErrorHandling from '../../../utilities/useErrorHandling'

// Material UI
import {Avatar, Box, Stack, Typography} from '@mui/material'

// Components
import Spinner from '../../../components/Spinner'



// Overview
const Overview = () => {

	const {allHistoryAllComments} = useSelector((state) => state.history)

	const [isLoading, setIsLoading] = useState(true)

	const dispatch = useDispatch()
	const { ticketId } = useParams()

	const {checkError} = useErrorHandling()

	useEffect(() => {

		const fetchData = async () => {

			setIsLoading(true)

			await dispatch(getAllHistoryAllComments({query: [
				{ticketId: ticketId},
			]}))
				.unwrap()
				.catch(error => checkError(error))
			
			setIsLoading(false)

		}

		fetchData()

	}, [dispatch])
	
	if (!allHistoryAllComments) {
		return <Spinner hidden={true} />
	}



	return (
		<Box sx={{pt: 3}}>
			{allHistoryAllComments?.slice().reverse().map((historyAndComment) => (
				<div key={historyAndComment._id}>

					{/* HISTORY */}
					{historyAndComment.summary && (
						<Stack direction="row" alignItems="center" sx={{pb: 2}}>

							{/* Avatar */}
							<Avatar src={`/images/titleLetters/${historyAndComment.creatorId.name.slice(0,1).toLowerCase()}.png`} alt="" width="45px" />
		
							<Stack sx={{ml: 1}}>

									{/* Name -  Date*/}
									<Stack direction={{desktop: "row", mobile: "column-reverse"}} spacing={{desktop: 2, mobile: 0}} sx={{mb: `${historyAndComment.changes.length > 0 ? 1 : 0}`}}>								
		
										<Typography><strong>{historyAndComment.creatorId.name}</strong> {historyAndComment.summary}</Typography>
										<Typography sx={{color: "grey"}}>{historyAndComment.createdAt.split('T')[0]} {historyAndComment.createdAt.split('T')[1].slice(0,5)}</Typography>
									</Stack>

									{/* Changes */}
									{historyAndComment.changes.map((change, index) => (
										<Stack direction="row" sx={{color: "grey"}} key={index}>
											{ change.field === 'due date' ? (
												<>
													<Typography variant='subtitle2'><strong>{change.field}</strong></Typography>
													<Typography variant='subtitle2' sx={{ml: 1}}>{change.old === "none" ? "none" : dayjs(new Date(change.old).toLocaleString(), 'DD/MM/YYYY, HH:mm:ss').format('YYYY-MM-DD')} &rarr; {dayjs(new Date(change.new).toLocaleString(), 'DD/MM/YYYY, HH:mm:ss').format('YYYY-MM-DD')}</Typography>
												</>
											) : (
												<>
													<Typography variant='subtitle2'><strong>{change.field}</strong></Typography>
													<Typography variant='subtitle2' sx={{ml: 1}}>{change.old} &rarr; {change.new}</Typography>
												</>
											)}
										</Stack>
									))}
									
							</Stack>
						</Stack>
					)}

					{/* COMMENT */}
					{historyAndComment.description && (
						<Stack direction="row" alignItems="center" sx={{pb: 2}}>
							{/* Avatar */}
							<Avatar src={`/images/titleLetters/${historyAndComment.creatorId.name.slice(0,1).toLowerCase()}.png`} alt="" width="45px" />

							<Stack sx={{ml: 1}}>
									{/* Name -  Date*/}
									<Stack direction={{desktop: "row", mobile: "column-reverse"}} spacing={{desktop: 2, mobile: 0}}>
										<Typography><strong>{historyAndComment.creatorId.name}</strong> added a comment.</Typography>
										<Typography sx={{color: "grey"}}>{historyAndComment.createdAt.split('T')[0]} {historyAndComment.createdAt.split('T')[1].slice(0,5)}</Typography>
									</Stack>
									{/* Comment */}
									<Typography variant='subtitle2'>{historyAndComment.description}</Typography>
							</Stack>

						</Stack>
					)}
				</div>
			))}
		</Box>
	)
}
export default Overview