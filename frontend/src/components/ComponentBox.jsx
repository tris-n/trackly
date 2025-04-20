// Material UI
import {Card} from '@mui/material'
import { styled } from '@mui/material/styles'



// Custom Styles
const ComponentBox = styled(Card)({
	borderRadius: "20px", 
	border: "solid 1px #EAEAEA",
	backgroundColor: "#FFFFF !important", 
	boxShadow: "3px 3px 15px rgba(0,0,0,0)",
	cursor: "pointer",
	transition: "all 0.3s ease",
	'&:hover': {
		backgroundColor: "rgba(240, 230, 230, 1)",
		border: "solid 1px rgba(235, 205, 205, 1)",
		boxShadow: "2px 4px 6px rgba(0,0,0,0.0)",
	},
})

export default ComponentBox