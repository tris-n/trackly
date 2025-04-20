import { configureStore } from '@reduxjs/toolkit'
import userReducer from './user/userSlice'
import projectReducer from './project/projectSlice'
import ticketReducer from './ticket/ticketSlice'
import commentReducer from './comment/commentSlice'
import historyReducer from './history/historySlice'
import dashboardReducer from './dashboard/dashboardSlice'



export const store = configureStore({
	reducer: {
		user: userReducer,
		projects: projectReducer,
		tickets: ticketReducer,
		comments: commentReducer,
		history: historyReducer,
		dashboard: dashboardReducer,
	},
})