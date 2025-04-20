// React
import {useEffect, useState} from 'react'

// Material UI
import {Box} from '@mui/material'



const RandomImageBox = ({fullWidth, children}) => {
	
	const [randomImage, setRandomImage] = useState("default")
	
	useEffect(() => {
		setRandomImage(getRandomNumber(1, 4))
	}, [])

	const getRandomNumber = (min, max) => {
		return Math.floor(Math.random() * (max - min + 1)) + min
	}



	return (
		<Box sx={{ display: {mobile: "none", tablet: "initial"}, width: "50%", backgroundImage: `url(/images/randomUnsplash/${randomImage}.jpg)`, minHeight: `${fullWidth ? "100vh" : "auto" }`, backgroundSize: "cover", backgroundPosition: "center center"}}>{children}</Box>
	)
}
export default RandomImageBox