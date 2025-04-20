// React
import {useEffect, useState} from 'react'
import {useParams} from 'react-router-dom'

// Redux
import {useSelector, useDispatch} from 'react-redux'
import {getAllHistory} from '../../../features/history/historySlice'

// DayJS
import dayjs from 'dayjs'

// Error Handling
import useErrorHandling from '../../../utilities/useErrorHandling'

// Material UI
import {Avatar, Box, Stack, Typography} from '@mui/material'

// Components
import Spinner from '../../../components/Spinner'



// History
const History = () => {

	const {allHistory} = useSelector((state) => state.history)

	const [isLoading, setIsLoading] = useState(true)

	const dispatch = useDispatch()
	const { ticketId } = useParams()

	const {checkError} = useErrorHandling()

	useEffect(() => {

		const fetchData = async () => {

			setIsLoading(true)

			await dispatch(getAllHistory({query: [
				{ticketId: ticketId},
			]}))
				.unwrap()
				.catch(error => checkError(error))
			
			setIsLoading(false)

		}

		fetchData()

	}, [dispatch])

	if (!allHistory) {
		return <Spinner hidden={true} />
	}



	return (
		<Box sx={{pt: 3}}>
			{allHistory?.slice().reverse().map((history, index) => (
				<Stack key={index} direction="row" alignItems="center" sx={{pb: 2}}>
					{/* Avatar */}
					<Avatar src={`/images/titleLetters/${history.creatorId.name.slice(0,1).toLowerCase()}.png`} alt="" width="45px" />

					<Stack sx={{ml: 1}}>

							{/* Name -  Date*/}
							<Stack direction={{desktop: "row", mobile: "column-reverse"}} spacing={{desktop: 2, mobile: 0}} sx={{mb: `${history.changes.length > 0 ? 1 : 0}`}}>		
								<Typography><strong>{history.creatorId.name}</strong> {history.summary}</Typography>
								<Typography sx={{color: "grey"}}>{history.createdAt.split('T')[0]} {history.createdAt.split('T')[1].slice(0,5)}</Typography>
							</Stack>

							{/* Changes */}
							{history.changes.map((change, index) => (
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
			))}
		</Box>
	)
}
export default History