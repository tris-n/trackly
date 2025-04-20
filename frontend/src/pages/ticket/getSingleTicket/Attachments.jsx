// React
import {useRef, useState} from 'react'
import {useParams} from 'react-router-dom'

// Redux
import {useSelector, useDispatch} from 'react-redux'
import {updateTicket} from '../../../features/ticket/ticketSlice'
import {getAllHistory, getAllHistoryAllComments} from '../../../features/history/historySlice'

// Firebase
import {getAuth} from 'firebase/auth'
import {getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject} from 'firebase/storage'
import {addDoc, collection, serverTimestamp} from 'firebase/firestore'
import {db} from '../../../firebase.config'
import {v4 as uuidv4} from 'uuid'

// Toastify
import {toast} from 'react-toastify'

// Error Handling
import useErrorHandling from '../../../utilities/useErrorHandling'

// Material UI
import {Avatar, Box, FormControl, Link, Stack, Typography} from '@mui/material'
import { styled } from '@mui/material/styles'
import './css/file-input.css'

// Components
import Spinner from '../../../components/Spinner'
import CustomLoadingButton from '../../../components/CustomLoadingButton'

// Images
import jpgFile from './images/jpg.png'
import pdfFile from './images/pdf.png'
import pngFile from './images/png-new.png'

// Custom styles
const CustomUserLink = styled(Link)({
	color: "black",
	fontSize: "0.8rem",
	textDecoration: "underline",
	transition: "all 0.3s ease",
	cursor: "pointer",
	'&:hover': {
		color: "grey",
		textDecoration: "underline",
	},
})



// Attachments
const Attachments = () => {

	const dispatch = useDispatch()
	const {singleTicket} = useSelector((state) => state.tickets)
	const {ticketId} = useParams()
	const filesInputRef = useRef()

	const {checkError} = useErrorHandling()

	// Add auth to metadata
	const metadata = {
		customMetadata: {'authenticated': true}
	}

	
	const [chosenFiles, setChosenFiles] = useState({
		files: null,
	})
	const {files} = chosenFiles
	
	const [isLoading, setIsLoading] = useState(false)



	const onChange = (e) => {
		setChosenFiles((prevState) => ({
			...prevState,
			[e.target.name]: e.target.files,
		}))
	}



	const onSubmit = async (e) => {
		e.preventDefault()

		setIsLoading(true)


		// Function to store a single file in firebase
		const storeFile = async (file) => {

			return new Promise((resolve, reject) => {

				const storage = getStorage()
				
				const fileName = `${ticketId}-${uuidv4()}-${file.name}`
				const storageRef = ref(storage, 'files/' + fileName)

				const uploadTask = uploadBytesResumable(storageRef, file, metadata)

				uploadTask.on(
					'state_changed',
					(snapshot) => {
						const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
						
						// console.log('Upload is ' + progress + '% done')

						switch (snapshot.state) {
							case 'paused':
								console.log('Upload is paused')
								break
							case 'running':
								console.log('Upload is running')
								break
							default:
								break
						}
					},
					(error) => {
						reject(error)
					},
					() => {
					// Handle successful uploads on complete
						getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
							resolve({name: file.name, url: downloadURL})
						})
					}
				)

			})
		}

		// Map through chosen files, save them to firebase using storeFile()
		// Returns an array with the files download Url
		const fileUrls = await Promise.all(
			[...files].map((file) => storeFile(file))
		).catch(() => {
			setIsLoading(false)
			toast.error('There was an error and the files were not uploaded.')
			return
		})

		let ticketUpdate = {
			attachments: fileUrls,
			updateType: 'upload'
		}

		let ticketData = {
			ticketId,
			ticketUpdate,
		}

		// dispatch a ticket update where attachments: fileUrls
		dispatch(updateTicket(ticketData))
			.unwrap()
			.then((ticket) => {
				toast.success(`Successfully uploaded to ${ticket.name}`)
				
				setChosenFiles({files: null})
				filesInputRef.current.value = ""
				setIsLoading(false)

				dispatch(getAllHistory({query: [
					{ticketId: ticketId},
				]}))
				dispatch(getAllHistoryAllComments({query: [
					{ticketId: ticketId},
				]}))
			})
			.catch(error => {
				checkError(error)
				setIsLoading(false)
			})

	}



	// delete file function
	const onDelete = async (file) => {

		// trim url to 'files/filename.jpg'
		let fileName = file.url.split('files%2F')
		fileName = fileName[1].split('?alt')
		fileName = fileName[0]

		// Delete pictures from firebase filestorage
		const storage = getStorage()
		const fileRef = ref(storage, `files/${fileName}`)
		await deleteObject(fileRef, metadata)

		const updatedAttachmentsList = singleTicket.attachments.filter((attachment) => attachment.url !== file.url)

		// update singleTarget
		let ticketUpdate = {
			attachments: updatedAttachmentsList,
			updateType: 'deleteFile',
			deletedFile: file.name
		}

		let ticketData = {
			ticketId,
			ticketUpdate,
		}

		// dispatch a ticket update where attachments: fileUrls
		dispatch(updateTicket(ticketData))
			.unwrap()
			.then((ticket) => {
				toast.success(`Updated ticket - ${ticket.name}`)
				setIsLoading(false)

				dispatch(getAllHistory({query: [
					{ticketId: ticketId},
				]}))
				dispatch(getAllHistoryAllComments({query: [
					{ticketId: ticketId},
				]}))
			})
			.catch(error => {
				checkError(error)
				setIsLoading(false)
			})

	}


	// Handle view file button
	const onView = (file) => {
		window.open(file.url, '_blank')
	}



	if (!singleTicket) {
		return <Spinner />
	}


	return (
		<Box sx={{pb: 5}}>
			<Typography variant='subtitle2'><strong>Attachments</strong></Typography>

			{/* Upload Form */}
				<Box component="form" autoComplete="off" onSubmit={onSubmit} sx={{maxWidth: `calc(100vw - 32px)`}}>

					<Stack spacing={{tablet: 3, mobile: 2}} direction={{tablet: "row", mobile: "column"}}>

						<FormControl fullWidth>
							<input
								className='file-input'
								type='file'
								id='files'
								name='files'
								onChange={onChange}
								ref={filesInputRef}
								max='6'
								accept='.jpg,.png,.jpeg,.pdf'
								multiple
								required
							/>
						</FormControl>					

						{/* Submit Button */}
						<CustomLoadingButton loading={isLoading} variant="contained" type="submit" sx={{height: "50px", width: {tablet: "165px", mobile: "100%"}}}>Upload</CustomLoadingButton>

					</Stack>

				</Box>

			{/* Display Uploaded Files */}
				<Box sx={{pt: 2}}>
					{singleTicket.attachments && (
						singleTicket.attachments.map((file, index) => (
							<div key={index}>
								
								<Stack direction="row" alignItems="center" sx={{pb: 2}}>
									{/* Avatar */}
									{file.name.split('.').pop() === "jpeg" && (
										<Avatar src={jpgFile} alt="" width="45px" variant='square' />
									)}
									{file.name.split('.').pop() === "jpg" && (
										<Avatar src={jpgFile} alt="" width="45px" variant='square' />
									)}
									{file.name.split('.').pop() === "png" && (
										<Avatar src={pngFile} alt="" width="45px" variant='square' />
									)}
									{file.name.split('.').pop() === "pdf" && (
										<Avatar src={pdfFile} alt="" width="45px" variant='square' />
									)}

									<Stack sx={{ml: 1}}>
											{/* Name -  Date*/}
											<Typography><strong>{file.name}</strong></Typography>
											<Stack direction="row" spacing={2}>									
												<CustomUserLink onClick={() => onView(file)}>view file</CustomUserLink>
												<CustomUserLink onClick={() => onDelete(file)}>delete</CustomUserLink>
											</Stack>
									</Stack>

								</Stack>
							</div>
						))
					)}
				</Box>
		
		</Box>
	)
}
export default Attachments