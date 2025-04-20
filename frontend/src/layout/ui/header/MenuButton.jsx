// React
import {useLocation} from 'react-router-dom'

// Material UI
import {IconButton} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'

// Custom styles
const iconStyle = {
	mr: 1,
	display: {desktop: "none"},
}


const MenuButton = ({openMenu}) => {

	const location = useLocation()

	return (
		<IconButton sx={iconStyle} onClick={openMenu} >
			<MenuIcon sx={{color: `${location.pathname === '/dashboard' ? 'white' : 'inherit'}`, transform: "scale(1.25)"}} />
		</IconButton>
	)
}
export default MenuButton