// React
import { useLocation } from 'react-router-dom'

// Material UI
import { useTheme } from '@mui/material/styles'
import {Box} from '@mui/material'
import { useMediaQuery } from '@mui/material'

// Images
import abstractPattern from '../images/colorful_nature_abstract_pattern_hd_abstract-sml.jpg'



const PatternBox = () => {

	const location = useLocation()
	const theme = useTheme()
	const isMobile = useMediaQuery(theme.breakpoints.only('mobile'))

	const pattern = {
		backgroundColor: "#EFEDE8",
		width: "100%",
		position: "absolute",
		zIndex: "-1",
		top: "0px",
		left: "0px",
		borderBottom: "solid 1px #EAEAEA",
		height: "275px",
		...(location.pathname === '/dashboard' && {
			backgroundImage: `url(${abstractPattern})`,
			opacity: "0.9",
			height: isMobile ? "315px" : "275px",
		}),
		...((location.pathname.includes('/create') || location.pathname.includes('/update')) && {
			height: "215px",
		}),
		...(location.pathname.includes('/projects') && {
			height: isMobile ? "275px" : "220px",
		}),
		...(location.pathname.includes('/tickets') && {
			height: isMobile ? "276px" : "222px",
		}),
		...(location.pathname.includes('/users') && {
			height: isMobile ? "276px" : "222px",
		}),
		...((location.pathname.includes('/projects/') || location.pathname.includes('/users/')) && {
			height: isMobile ? "380px" : "294px",
		}),
		...(location.pathname.includes('/tickets/') && {
			height: isMobile ? "318px" : "295px",
		}),
		
	}

	return (
		<Box sx={pattern} />
	)
}

export default PatternBox