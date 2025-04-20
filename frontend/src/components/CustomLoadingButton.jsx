// Material UI
import LoadingButton from '@mui/lab/LoadingButton'
import { styled } from '@mui/material/styles'



const CustomLoadingButton = styled(LoadingButton)({
	borderRadius: "10px", 
	width: "100%",
	marginTop: "-10px",
	marginBottom: "-10px",
	textTransform: "none",
	fontWeight: "400",
	fontSize: "1rem",
	lineHeight: "1.5rem",
	letterSpacing: "0.00938em",
	color: "white",
	backgroundColor: "#2076CD !important", 
	display: "flex",
	boxShadow: "1px 3px 5px rgba(0,0,0,0)",
	transition: "all 0.3s ease",
	'&:hover': {
		backgroundColor: "#1B65BB !important",
		boxShadow: "2px 4px 6px rgba(0,0,0,0)",
	},
})

export default CustomLoadingButton