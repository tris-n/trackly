// Material UI
import {Card} from '@mui/material'
import { styled } from '@mui/material/styles'

// Custom Styles
const CustomCard = styled(Card)({
	borderRadius: "20px", 
	border: "solid 1px #EAEAEA",
	backgroundColor: "#FFFFF !important", 
	boxShadow: "3px 3px 15px rgba(0,0,0,0)",
	cursor: "pointer",
})

export default CustomCard