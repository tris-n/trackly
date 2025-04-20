// React
import {useState} from 'react'
import {Link, useNavigate} from 'react-router-dom'

// Redux
import {useSelector, useDispatch} from 'react-redux'
import {getAllUsers, deleteUser, deleteUsers} from '../../../features/user/userSlice'

// Toastify
import {toast} from 'react-toastify'

// React Modal
import Modal from 'react-modal'

// Material UI
import { Avatar, Box, Button, Checkbox, FormControl, IconButton, InputLabel, MenuItem, OutlinedInput, Paper, Popover, Select, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TableSortLabel, Toolbar, Tooltip, Typography } from "@mui/material"
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

function applySortFilter(array, comparator, query, roleSort) {

	let stabilizedThis = array

	if (roleSort !== "all") {
		stabilizedThis = array.filter((user) => user.role === roleSort)
	}

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
		let queryList = stabilizedThis.filter((user) => {
			return user[0].name.toLowerCase().indexOf(query.toLowerCase()) !== -1
		})
		return queryList.map((el) => el[0])
	}
	return stabilizedThis.map((el) => el[0])
}



// Table Cells
const headCells = [
	{
		id: 'name',
		number: false,
		disablePadding: false,
		label: 'Name',
	},
	{
		id: 'role',
		number: false,
		disablePadding: false,
		label: 'Role',
	},
	{
		id: 'email',
		number: false,
		disablePadding: false,
		label: 'Email',
	},
	{
		id: 'ticketsAssigned',
		number: true,
		disablePadding: false,
		label: 'Assigned',
	},
	{
		id: 'ticketsCreated',
		number: true,
		disablePadding: false,
		label: 'Submitted',
	},
]



// Table Head
const CustomTableHead = (props) => {

	const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props

	const createSortHandler = (property) => (event) => {
		onRequestSort(event, property)
	}

	return (
		<TableHead sx={{backgroundColor: "#E4E0D9"}}>
			<TableRow>
				
				<TableCell padding="checkbox">
					<Checkbox 
						color="primary"
						indeterminate={numSelected > 0 && numSelected < rowCount}
						checked={rowCount > 0 && numSelected === rowCount}
						onChange={onSelectAllClick}
						inputProps={{
							'aria-label': 'select all users',
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

	const {numSelected, filterName, onFilterName, roleSort, setRoleSort, handleDeleteUsers, handleRoleSort, openModal} = props

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
					<InputLabel id="role-select-label">Role</InputLabel>
					<Select 
						labelId="role-select-label" 
						id="role-select"
						value={roleSort}
						label="Role"
						onChange={handleRoleSort}
					>
						<MenuItem value={"all"}>All</MenuItem>
						<MenuItem value={"Admin"}>Admin</MenuItem>
						<MenuItem value={"Project Manager"}>Project Manager</MenuItem>
						<MenuItem value={"Developer"}>Developer</MenuItem>
						<MenuItem value={"Submitter"}>Submitter</MenuItem>
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
					placeholder="Search user..."
				/>
			)}

		</Toolbar>
	)
}



// Table Body
const GetAllUsersTable = () => {

	const {allUsers, user} = useSelector((state) => state.user)

	const dispatch = useDispatch()
	const navigate = useNavigate()

	const [open, setOpen] = useState(null)
	const [currentId, setCurrentId] = useState(null)

	const [modalIsOpen, setIsOpen] = useState(false)
	const [deletionType, setDeletionType] = useState(null)

	const [order, setOrder] = useState('asc')
	const [orderBy, setOrderBy] = useState('role')
	const [selected, setSelected] = useState([])
	const [filterName, setFilterName] = useState('')
	const [page, setPage] = useState(0)
	const [dense, setDense] = useState(false)
	const [rowsPerPage, setRowsPerPage] = useState(25)

	const [roleSort, setRoleSort] = useState('all')

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
			const newSelected = allUsers.map((n) => n._id)
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
		navigate(`/users/update/${currentId}`)
	}

	const handleMenuDeleteClick = () => {
		
		setIsOpen(false)

		dispatch(deleteUser(currentId))
			.unwrap()
			.then(() => {
				toast.success(`Successfully deleted the user.`)
				setSelected([])
				setPage(0)
				dispatch(getAllUsers())
			})
			.catch(toast.error)
		
	}

	const handleDeleteUsers = () => {

		setIsOpen(false)

		dispatch(deleteUsers(selected))
			.unwrap()
			.then(() => {
				toast.success(`Successfully deleted the user${selected.length > 1 ? 's' : ""}.`)
				setSelected([])
				setPage(0)
				dispatch(getAllUsers())
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

	const handleRoleSort = (event) => {
		setPage(0)
		setRoleSort(event.target.value)
	}

	const handleRowClick = (event, id) => {
		if (event.target.tagName !== "INPUT" && event.target.tagName !== "svg") {
			navigate(`/users/${id}`)
		}
	}

	const isSelected = (_id) => selected.indexOf(_id) !== -1

	// Avoid a layout jump when reaching the last page with empty rows.
	const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - allUsers.length) : 0

	const filteredUsers = applySortFilter(allUsers, getComparator(order, orderBy), filterName, roleSort)

	const isNotFound = !filteredUsers.length && !!filterName

	if (!allUsers || !user) {
		return <Spinner />
	}



	return (
		<>
			<CustomCard sx={{maxWidth: `calc(100vw - 32px)`}}>
				
				<CustomTableToolBar 
					numSelected={selected.length} 
					filterName={filterName} 
					onFilterName={handleFilterByName} 
					roleSort={roleSort} 
					setRoleSort={setRoleSort} 
					handleRoleSort={handleRoleSort}
					handleDeleteUsers={handleDeleteUsers}
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
							rowCount={allUsers.length}
						/>

						<TableBody>

							{filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((filteredUser, index) => {

								const isItemSelected = isSelected(filteredUser._id)
								const labelId = `enhanced-table-checkbox-${index}`

								return (
									
									
									<TableRow
										hover
										role="checkbox"
										aria-checked={isItemSelected}
										tabIndex={-1}
										key={filteredUser._id}
										selected={isItemSelected}
										sx={{ 
											cursor: "pointer",
											height: "100px",
										}}
									>

										<TableCell padding="checkbox">
											<Checkbox
												onClick={(event) => handleClick(event, filteredUser._id)}
												color="primary"
												checked={isItemSelected}
												inputProps={{'aria-labelledby': labelId,}}
											/>
										</TableCell>

										<TableCell
											component="th"
											id={labelId}
											scope="row"
											onClick={(event) => handleRowClick(event, filteredUser._id)}
										>
											<Stack direction="row" alignItems="center">
													<Avatar src={`/images/titleLetters/${filteredUser.name.slice(0,1).toLowerCase()}.png`} alt="" width="45px" sx={{mr: 1}}/>
													<strong>{filteredUser.name}</strong>
												</Stack>
										</TableCell>

										<TableCell align="left" onClick={(event) => handleRowClick(event, filteredUser._id)}>{filteredUser.role}</TableCell>
										<TableCell align="left"><CustomUserLink to={`mailto:${filteredUser.email}`}>{filteredUser.email}</CustomUserLink></TableCell>
										<TableCell align="left" onClick={(event) => handleRowClick(event, filteredUser._id)}>{filteredUser.ticketsAssigned}</TableCell>
										<TableCell align="left" onClick={(event) => handleRowClick(event, filteredUser._id)}>{filteredUser.ticketsCreated}</TableCell>
										<TableCell align="right">
										{ (user.role === 'Admin' || user.role === 'Project Manager') && (
											<IconButton onClick={(event) => handleOpenMenu(event, filteredUser._id)}>
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
									<TableCell align="center" colSpan={6} sx={{ py: 3 }}>
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
					count={filteredUsers.length}
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
						height: "210px",
						maxWidth: "400px",
						margin: "auto"
						// height: "20rem"
					}
				}}
			>
				<Typography sx={{mb: 2, fontWeight: "bold"}}>
					Are you sure you want to delete?
				</Typography>		

				<Typography sx={{mb: 2}}>
					Are you sure you want to delete? It will remove the user{deletionType !== "single" && "s"} from all tickets they've been assigned to and delete all the tickets they've created.
				</Typography>					
					
				
				
				<Stack direction="row" justifyContent="flex-end">
					<Button onClick={closeModal}>Cancel</Button>

					{deletionType === 'single' ? (
						<Button onClick={handleMenuDeleteClick} color="error">Delete</Button>
					):(						
						<Button onClick={handleDeleteUsers} color="error">Delete</Button>
					)}

				</Stack>
			</Modal>

		</>
	)
}

export default GetAllUsersTable