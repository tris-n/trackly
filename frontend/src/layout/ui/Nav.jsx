// Material UI
import {Drawer} from '@mui/material'
import { useMediaQuery } from '@mui/material'
import { styled, useTheme } from '@mui/material/styles'

// Components
import MenuContent from './nav/MenuContent'

// Custom Style
const DrawerStyled = styled(Drawer)({
	width: "240px",
})

const paperPropsStyles = {
	width: "240px",
	borderRight: "solid 1px #EAEAEA"
}



const Nav = ({isOpen, closeMenu}) => {

	// setting media queries
	const theme = useTheme();
	const isDesktop = useMediaQuery(theme.breakpoints.up('desktop'))

	

	return (
		<>
			{ isDesktop ? (
				<DrawerStyled 
					variant="permanent" 
					PaperProps={{ sx: paperPropsStyles }}
				>
					<MenuContent />
				</DrawerStyled>
			) : (
				<DrawerStyled 
					variant="temporary" 
					open={isOpen} onClose={closeMenu}
					PaperProps={{ sx: paperPropsStyles }}
				>
					<MenuContent closeMenu={closeMenu} />
				</DrawerStyled>
			)}
		</>
	)
}
export default Nav