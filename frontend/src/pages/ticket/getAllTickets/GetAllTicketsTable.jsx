// React
import {useState} from 'react'
import {Link, useNavigate} from 'react-router-dom'

// Redux
import {useSelector, useDispatch} from 'react-redux'
import {getAllTickets, deleteTicket, deleteTickets} from '../../../features/ticket/ticketSlice'

// Toastify
import {toast} from 'react-toastify'

// React Modal
import Modal from 'react-modal'

// DayJS
import dayjs from 'dayjs'

// Material UI
import { Box, Button, Checkbox, FormControl, IconButton, InputLabel, MenuItem, OutlinedInput, Paper, Popover, Select, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TableSortLabel, Tabs, Tab, Toolbar, Tooltip, Typography } from "@mui/material"
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { styled } from '@mui/material/styles'
import { visuallyHidden } from '@mui/utils'

// Components
import Spinner from '../../../components/Spinner'
import CustomCard from '../../../components/CustomCard'

// Custom Styles
const CustomUserLink = styled(Link)({
	color: "black",
	textDecoration: "underline",
	transition: "all 0.3s ease",
	'&:hover': {
		color: "grey",
		textDecoration: "underline",
	},
})



// Table Sorting Functions
function descendingComparator(a, b, orderBy) {
	if (b[orderBy] < a[orderBy]) {
		return -1
	}
	if (b[orderBy] > a[orderBy]) {
		return 1
	}
	return 0
}

function getComparator(order, orderBy) {
	return order === 'desc' ? (a, b) => descendingComparator(a, b, orderBy) : (a, b) => -descendingComparator(a, b, orderBy)
}

function applySortFilter(array, comparator, query, prioritySort, statusSort) {

	let stabilizedThis = array.filter(ticket => {
		if (prioritySort !== "All" && ticket.priority !== prioritySort) {
			return false;
		}
		if (statusSort !== "Overview" && ticket.status !== statusSort) {
			return false;
		}
		return true;
	})

	stabilizedThis = stabilizedThis.map((el, index) => [el, index])
	stabilizedThis.sort((a, b) => {
		const order = comparator(a[0], b[0])
		if (order !== 0) {
			return order
		}
		return a[1] - b[1]
	})
	if (query) {
		// this fixes the search bar sorting
		let queryList = stabilizedThis.filter((ticket) => {
			return ticket[0].name.toLowerCase().indexOf(query.toLowerCase()) !== -1
		})
		return queryList.map((el) => el[0])
	}
	return stabilizedThis.map((el) => el[0])
}



// Table Head
const headCells = [
	{
		id: 'name',
		number: false,
		disablePadding: false,
		label: 'Name',
	},
	{
		id: 'projectId',
		number: true,
		disablePadding: false,
		label: 'Project',
	},
	{
		id: 'priority',
		number: true,
		disablePadding: false,
		label: 'Priority',
	},
	{
		id: 'status',
		number: true,
		disablePadding: false,
		label: 'Status',
	},
	{
		id: 'type',
		number: true,
		disablePadding: false,
		label: 'Type',
	},
	{
		id: 'assignedName',
		number: true,
		disablePadding: false,
		label: 'Assigned',
	},
	{
		id: 'creatorName',
		number: true,
		disablePadding: false,
		label: 'Submitted',
	},
	{
		id: 'dueDate',
		number: false,
		disablePadding: false,
		label: 'Due',
	},
]



const CustomTableHead = (props) => {

	const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props

	const createSortHandler = (property) => (event) => {
		onRequestSort(event, property)
	}



	return (
		<TableHead sx={{backgroundColor: "#E4E0D9"}}>
			<TableRow sx={{height: "30px !important"}}>
				
				<TableCell padding="checkbox">
					<Checkbox 
						color="primary"
						indeterminate={numSelected > 0 && numSelected < rowCount}
						checked={rowCount > 0 && numSelected === rowCount}
						onChange={onSelectAllClick}
						inputProps={{
							'aria-label': 'select all tickets',
						}}
					/>
				</TableCell>

				{headCells.map((headCell) => (
					<TableCell 
						key={headCell.id}
						align={headCell.numeric ? 'right' : 'left'}
						padding={headCell.disablePadding ? 'none' : 'normal'}
						sortDirection={orderBy === headCell.id ? order : false}
					>
						<TableSortLabel
							active={orderBy === headCell.id}
							direction={orderBy === headCell.id ? order : 'asc'}
							onClick={createSortHandler(headCell.id)}
						>
							{headCell.label}
							{orderBy === headCell.id ? (
								<Box component="span" sx={visuallyHidden}>
									{order === 'desc' ? 'sorted descending' : 'sorted ascending'}
								</Box>
							) : null}
						</TableSortLabel>
					</TableCell>
				))}

				<TableCell sx={{ width: "30px"}}></TableCell>
			</TableRow>
		</TableHead>
	)
}



// Table ToolBar
const CustomTableToolBar = (props) => {

	const {user} = useSelector((state) => state.user)

	const {numSelected, filterName, onFilterName, prioritySort, handleDeleteTickets, handlePrioritySort, openModal} = props


	return (
		<Toolbar sx={{
			pt: 2,
			pb: 2,
			pl: { sm: 2 },
			pr: { xs: 1, sm: 2 },
			...(numSelected > 0 && {
				bgcolor: "#D2E9FB"
				})
			}}
		>

			{numSelected > 0 ? (
				<Typography
					sx={{ flex: '1 1 100%' }}
					color="inherit"
					variant="subtitle1"
					component="div"
				>
					{numSelected} selected
				</Typography>
			) : (
				<FormControl sx={{width: "250px", mr: 2}}>
					<InputLabel id="priority-select-label">Priority</InputLabel>
					<Select 
						labelId="priority-select-label" 
						id="priority-select"
						value={prioritySort}
						label="Priority"
						onChange={handlePrioritySort}
					>
						<MenuItem value={"All"}>All</MenuItem>
						<MenuItem value={"Low"}>Low</MenuItem>
						<MenuItem value={"Medium"}>Medium</MenuItem>
						<MenuItem value={"High"}>High</MenuItem>
						<MenuItem value={"Urgent"}>Urgent</MenuItem>
					</Select>
				</FormControl>
				
			)}

			{numSelected > 0 ? user.role === 'Admin' && (
				<Tooltip title="Delete">
					<IconButton onClick={() => openModal("many")}>
						<DeleteIcon />
					</IconButton>
				</Tooltip>
			) : (
				<OutlinedInput 
					fullWidth
					value={filterName}
					onChange={onFilterName}
					placeholder="Search tickets..."
				/>
			)}

		</Toolbar>
	)
}



// Table Body
const GetAllTicketsTable = () => {

	const {user} = useSelector((state) => state.user)
	const {allTickets} = useSelector((state) => state.tickets)

	const dispatch = useDispatch()
	const navigate = useNavigate()

	const [open, setOpen] = useState(null)
	const [currentId, setCurrentId] = useState(null)

	const [modalIsOpen, setIsOpen] = useState(false)
	const [deletionType, setDeletionType] = useState(null)

	const [order, setOrder] = useState('desc')
	const [orderBy, setOrderBy] = useState('dueDate')
	const [selected, setSelected] = useState([])
	const [filterName, setFilterName] = useState('')
	const [page, setPage] = useState(0)
	const [dense, setDense] = useState(false)
	const [rowsPerPage, setRowsPerPage] = useState(25)

	const [prioritySort, setPrioritySort] = useState('All')
	const [statusSort, setStatusSort] = useState('Overview')

	// Modal settings
	const openModal = (deletionType) => {
		setOpen(null)
		setDeletionType(deletionType)
		setIsOpen(true)
	}
	
	const closeModal = () => {
		setDeletionType(null)
		setIsOpen(false)
	}

	const handleRequestSort = (event, property) => {
		const isAsc = orderBy === property && order === 'asc'
		setOrder(isAsc ? 'desc' : 'asc')
		setOrderBy(property)
	}

	const handleSelectAllClick = (event) => {
		if (event.target.checked) {
			const newSelected = allTickets.map((n) => n._id)
			setSelected(newSelected)
			return
		}
		setSelected([])
	}

	const handleClick = (event, _id) => {
		const selectedIndex = selected.indexOf(_id)

		let newSelected = []

		if (selectedIndex === -1) {
			newSelected = newSelected.concat(selected, _id)
		} else if (selectedIndex === 0) {
			newSelected = newSelected.concat(selected.slice(1))
		} else if (selectedIndex === selected.length - 1) {
			newSelected = newSelected.concat(selected.slice(0, -1))
		} else if (selectedIndex > 0) {
			newSelected = newSelected.concat(
				selected.slice(0, selectedIndex),
				selected.slice(selectedIndex + 1),
			)
		}

		setSelected(newSelected)
	}

	const handleOpenMenu = (event, id) => {
		setOpen(event.currentTarget)
		setCurrentId(id)
	}

	const handleCloseMenu = () => {
		setOpen(null)
	}

	const handleMenuEditClick = () => {
		navigate(`/tickets/update/${currentId}`)
	}

	const handleMenuDeleteClick = () => {

		setIsOpen(false)
			
		dispatch(deleteTicket(currentId))
			.unwrap()
			.then(() => {
				toast.success(`Successfully deleted the ticket.`)
				setSelected([])
				setPage(0)
				dispatch(getAllTickets())
			})
			.catch(toast.error)
		
	}

	const handleDeleteTickets = () => {

		setIsOpen(false)

		dispatch(deleteTickets(selected))
			.unwrap()
			.then(() => {
				toast.success(`Successfully deleted the ticket${selected.length > 1 ? 's' : ""}.`)
				setSelected([])
				setPage(0)
				dispatch(getAllTickets())
			})
			.catch(toast.error)
		
	}

	const handleChangePage = (event, newPage) => {
		setPage(newPage)
	}

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10))
		setPage(0)
	}


	const handleFilterByName = (event) => {
		setPage(0)
		setFilterName(event.target.value)
	}

	const handlePrioritySort = (event) => {
		setPage(0)
		setPrioritySort(event.target.value)
	}

	const handleStatusSort = (event, newValue) => {
		setPage(0)
		setStatusSort(newValue)
	}

	const handleRowClick = (event, id) => {
		if (event.target.tagName !== "INPUT" && event.target.tagName !== "svg") {
			navigate(`/tickets/${id}`)
		}
	}

	const isSelected = (_id) => selected.indexOf(_id) !== -1

	// Avoid a layout jump when reaching the last page with empty rows.
	const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - allTickets.length) : 0

	const filteredTickets = applySortFilter(allTickets, getComparator(order, orderBy), filterName, prioritySort, statusSort)

	const isNotFound = !filteredTickets.length && !!filterName

	if (!allTickets || !user) {
		return <Spinner />
	}



	return (
		<>
			<CustomCard sx={{maxWidth: `calc(100vw - 32px)`}}>

				<Box>
					<Tabs value={statusSort} onChange={handleStatusSort}>
						<Tab label="Overview" value="Overview" />
						<Tab label="To Do" value="To Do" />
						<Tab label="In Progress" value="In Progress" />
						<Tab label="In Review" value="In Review" />
						<Tab label="Done" value="Done" />
					</Tabs>
				</Box>
				
				<CustomTableToolBar 
					numSelected={selected.length} 
					filterName={filterName} 
					onFilterName={handleFilterByName} 
					prioritySort={prioritySort} 
					setPrioritySort={setPrioritySort} 
					handlePrioritySort={handlePrioritySort}
					handleDeleteTickets={handleDeleteTickets}
					openModal={openModal}
				/>

				<TableContainer>
					<Table sx={{width: {mobile: "max-content", tablet: "100%"}}}>

						<CustomTableHead 
							numSelected={selected.length}
							order={order}
							orderBy={orderBy}
							onSelectAllClick={handleSelectAllClick}
							onRequestSort={handleRequestSort}
							rowCount={allTickets.length}
							statusSort={statusSort}
						/>

						<TableBody>

							{filteredTickets.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((ticket, index) => {

								const isItemSelected = isSelected(ticket._id)
								const labelId = `enhanced-table-checkbox-${index}`

								return (		
									
									<TableRow
										hover
										role="checkbox"
										aria-checked={isItemSelected}
										tabIndex={-1}
										key={ticket._id}
										selected={isItemSelected}
										sx={{ 
											cursor: "pointer",
											height: "100px",
										}}
									>

										<TableCell padding="checkbox">
											<Checkbox
												onClick={(event) => handleClick(event, ticket._id)}
												color="primary"
												checked={isItemSelected}
												inputProps={{'aria-labelledby': labelId,}}
											/>
										</TableCell>

										<TableCell
											component="th"
											id={labelId}
											scope="row"
											onClick={(event) => handleRowClick(event, ticket._id)}
											sx={{
												width: {tablet: "100%", mobile: "260px"},
											}}
										>
											<Stack direction="row" alignItems="center">
												<strong>{ticket.name}</strong>
											</Stack>
										</TableCell>
					
										<TableCell align="left"><CustomUserLink to={`/projects/${ticket.projectId}`}>{ticket.projectName}</CustomUserLink></TableCell>
										<TableCell align="left" onClick={(event) => handleRowClick(event, ticket._id)}>
											{ticket.priority === "Low" && (<span style={{color: "blue"}}>Low</span>)}
											{ticket.priority === "Medium" && (<span style={{color: "green"}}>Medium</span>)}
											{ticket.priority === "High" && (<span style={{color: "orange"}}>High</span>)}
											{ticket.priority === "Urgent" && (<span style={{color: "red"}}>Urgent</span>)}
										</TableCell>
										<TableCell align="left" onClick={(event) => handleRowClick(event, ticket._id)}>{ticket.status}</TableCell>
										<TableCell align="left" onClick={(event) => handleRowClick(event, ticket._id)}>{ticket.type}</TableCell>
										
										<TableCell align="left">{ticket.assignedName === 'zzzzz' ? <span style={{color: "red"}}> unassigned </span> : <CustomUserLink to={`/users/${ticket.assignedId}`}>{ticket.assignedName}</CustomUserLink>}</TableCell>
										<TableCell align="left"><CustomUserLink to={`/users/${ticket.creatorId}`}>{ticket.creatorName}</CustomUserLink></TableCell>
										
										<TableCell align="left" onClick={(event) => handleRowClick(event, ticket._id)} sx={{color: `${ticket.overDue ? 'red' : 'default'}`, whiteSpace: 'nowrap'}}>{ticket.dueDate === 0 ? " " : dayjs(new Date(ticket.dueDate).toLocaleString(), 'DD/MM/YYYY, HH:mm:ss').format('YYYY-MM-DD')}</TableCell>
										<TableCell align="right">
										{ (user.role === 'Admin' || user.role === 'Project Manager' || user.role === 'Developer' || user.role === 'Submitter') && (
											<IconButton onClick={(event) => handleOpenMenu(event, ticket._id)}>
												<MoreVertIcon />
											</IconButton>
										)}
										</TableCell>

									</TableRow>
									
								)

							})}

							{emptyRows > 0 && (
								<TableRow style={{height: (dense ? 33 : 53) * emptyRows,}}>
									<TableCell colSpan={7} />
								</TableRow>
							)}
							
						</TableBody>

						{isNotFound && (
							<TableBody>
								<TableRow>
									<TableCell align="center" colSpan={9} sx={{ py: 3 }}>
										<Paper
											sx={{
											textAlign: 'center',
											}}
										>
											<Typography variant="h6" paragraph>
												Not found
											</Typography>

											<Typography variant="body2" sx={{pb: 2}}>
												No results found for &nbsp;
												<strong>&quot;{filterName}&quot;</strong>.
												<br /> Try checking for typos or using complete words.
											</Typography>
										</Paper>
									</TableCell>
								</TableRow>
							</TableBody>
						)}

					</Table>
				</TableContainer>

				<TablePagination 
					rowsPerPageOptions={[5, 10, 25]}
					component="div"
					count={filteredTickets.length}
					rowsPerPage={rowsPerPage}
					page={page}
					onPageChange={handleChangePage}
					onRowsPerPageChange={handleChangeRowsPerPage}
				/>

			</CustomCard>

			{/* Edit Menu PopUp */}
			<Popover
				open={Boolean(open)}
				anchorEl={open}
				onClose={handleCloseMenu}
				anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
				transformOrigin={{ vertical: 'top', horizontal: 'right' }}
				PaperProps={{
					sx: {
						p: 1,
						width: 140,
						'& .MuiMenuItem-root': {
							px: 1,
							typography: 'body2',
							borderRadius: 0.75,
						},
					},
				}}
			>
				<MenuItem onClick={handleMenuEditClick}>
					<EditIcon /> Edit
				</MenuItem>

				{ (user.role === 'Admin' || user.role === 'Project Manager') && (
					<MenuItem onClick={() => openModal("single")} sx={{ color: 'error.main' }}>
						<DeleteIcon /> Delete
					</MenuItem>
				)}
			</Popover>

			{/* Delete modal */}
			<Modal
				isOpen={modalIsOpen}
				onRequestClose={closeModal}
				style={{
					overlay: {
						zIndex: 1000,
						backgroundColor: "rgba(0,0,0,0.4)"
					},
					content: {
						backgroundColor: "#f2f4f8",
						borderRadius: "1rem",
						display: "flex",
						flexDirection: "column",
						height: "120px",
						maxWidth: "400px",
						margin: "auto"
					}
				}}
			>
				<Typography sx={{mb: 2}}>
					Are you sure you want to delete?
				</Typography>									
				
				<Stack direction="row" justifyContent="flex-end">
					<Button onClick={closeModal}>Cancel</Button>

					{deletionType === 'single' ? (
						<Button onClick={handleMenuDeleteClick} color="error">Delete</Button>
					):(						
						<Button onClick={handleDeleteTickets} color="error">Delete</Button>
					)}

				</Stack>
			</Modal> 

		</>
	)
}

export default GetAllTicketsTable