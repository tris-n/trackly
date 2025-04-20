// Material UI
import {Container, Stack} from '@mui/material'

// Components
import DropDownMenu from "./header/DropDownMenu"
import MenuButton from './header/MenuButton'


const Header = ({openMenu}) => {
	
	return (
		<Container maxWidth="laptop">
			<Stack direction="row" alignItems="center" justifyContent={{desktop: "flex-end", mobile: "space-between"}} sx={{height: "92px"}}>
				<MenuButton openMenu={openMenu} />
				<DropDownMenu />
			</Stack>
		</Container>
	)
}
export default Header