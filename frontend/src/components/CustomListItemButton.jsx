// Material UI
import {ListItemButton, ListItemText, Stack} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'

// Custom Style
const buttonStyle = {
	borderRadius: "20px", 
	border: "solid 1px rgba(235, 205, 205, 1)",
	display: "flex",
	backgroundColor: "rgba(250, 225, 225, 1) !important",
	'&:hover': {
		backgroundColor: "rgba(235, 205, 205, 1) !important",
	}
}

const deleteButtonStyle = {
	borderRadius: "20px", 
	border: "solid 1px rgba(235, 205, 205, 1)",
	display: "flex",
	backgroundColor: "rgba(250, 225, 225, 1) !important",
	'&:hover': {
		backgroundColor: "#FF686A !important",
	}
}



const CustomButton = ({labelName, deletion, onClick}) => {

	return (
		<ListItemButton selected variant="contained" sx={deletion ? deleteButtonStyle : buttonStyle} onClick={onClick}>
			<Stack direction="row" alignItems="center" justifyContent="center" sx={{margin: "auto"}}>
				<AddIcon sx={{ml: -1.25, mr: 0.5}} />
				<ListItemText sx={{color: "black"}}>{labelName}</ListItemText>
			</Stack>
		</ListItemButton>

	)
}

export default CustomButton