// React
import {useLocation} from 'react-router-dom'



const FileImage = () => {

	let location = useLocation()

	return (
		<img src={location.pathname} alt="" />
	)
}

export default FileImage