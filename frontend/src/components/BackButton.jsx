import { FaArrowCircleLeft } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'



const BackButton = ({url}) => {

	const navigate = useNavigate()

	if (!url) {
		// url = -1
		url = '/'
	}

	return (
		<button onClick={() => navigate(url)}>
			<FaArrowCircleLeft /> Back
		</button>
	)
}

export default BackButton
