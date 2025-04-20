import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom'

// Helmet Meta Tags
import MetaTags from './utilities/MetaTags'

// Toastify
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// Material UI
import CssBaseline from '@mui/material/CssBaseline'

// Components
import PrivateRoutes from './utilities/PrivateRoutes'
import ScrollToTop from './utilities/ScrollToTop'

// Layout
import Layout from './layout/Layout'

// Dashboard
import Dashboard from './pages/Dashboard'

// User
import LoginUser from './pages/user/LoginUser'
import RegisterUser from './pages/user/RegisterUser'
import CreateUser from './pages/user/CreateUser'
import GetAllUsers from './pages/user/GetAllUsers'
import GetSingleUser from './pages/user/GetSingleUser'
import UpdateUser from './pages/user/UpdateUser'

// // Project
import CreateProject from './pages/project/CreateProject'
import GetAllProjects from './pages/project/GetAllProjects'
import GetSingleProject from './pages/project/GetSingleProject'
import UpdateProject from './pages/project/UpdateProject'

// // Ticket
import CreateTicket from './pages/ticket/CreateTicket'
import GetAllTickets from './pages/ticket/GetAllTickets'
import GetSingleTicket from './pages/ticket/GetSingleTicket'
import UpdateTicket from './pages/ticket/UpdateTicket'



function App() {
	return (
		<>
			<MetaTags />
			<CssBaseline />
			<Router>
				<ScrollToTop />
					<Routes>

						{/* Public */}
						<Route path="/" element={<LoginUser />} />
						<Route path="/register" element={<RegisterUser />} />
						

							{/* Admin */}
							<Route element={<PrivateRoutes roles={["Admin"]} />}>
								<Route element={<Layout />}>
									<Route path="/projects/create" element={<CreateProject />} />
									<Route path="/projects/update/:projectId" element={<UpdateProject />} />
								</Route>
							</Route>

							{/* Admin, Project Manager */}
							<Route element={<PrivateRoutes roles={["Admin", "Project Manager"]} />}>
								<Route element={<Layout />}>
									{/* User */}
									<Route path="/users/create" element={<CreateUser />} />
									<Route path="/users" element={<GetAllUsers />} />
									<Route path="/users/update/:userId" element={<UpdateUser />} />
								</Route>
							</Route>

							{/* Admin, Project Manager, Developer, Submitter */}
							<Route element={<PrivateRoutes roles={["Admin", "Project Manager", "Developer", "Submitter"]} />}>
								<Route element={<Layout />}>
									<Route path="/dashboard" element={<Dashboard />} />
									{/* User */}
									<Route path="/users/:userId" element={<GetSingleUser />} />
									{/* Project */}
									<Route path="/projects" element={<GetAllProjects />} />
									<Route path="/projects/:projectId" element={<GetSingleProject />} />
									{/* Ticket */}
									<Route path="/tickets/create/" element={<CreateTicket />} />
									<Route path="/tickets" element={<GetAllTickets />} />
									<Route path="/tickets/:ticketId" element={<GetSingleTicket />} />
									<Route path="/tickets/update/:ticketId" element={<UpdateTicket />} />
								</Route>
							</Route>

											

						{/* Catch-all */}
						<Route path="*" element={<Navigate to="/" />} />

					</Routes>
			</Router>

			<ToastContainer />
		</>
	)
}

export default App