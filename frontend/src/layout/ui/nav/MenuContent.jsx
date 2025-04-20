// Material UI
import {Box} from '@mui/material'
import { styled } from '@mui/material/styles'

// Components
import AccountBox from "./AccountBox"
import LogoBox from "./LogoBox"
import NavLinks from "./NavLinks"

// Custom Styles
const ContentBox = styled(Box)({
	display: "flex",
	flexDirection: "column",
	padding: "0px 20px"
})



const MenuContent = ({closeMenu}) => {
	
	return (
		<ContentBox>

			<LogoBox />

			<AccountBox />

			<NavLinks />
			
		</ContentBox>
	)
}
export default MenuContent