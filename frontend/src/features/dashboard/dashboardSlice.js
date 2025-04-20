import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import { extractErrorMessage } from '../../utilities/extractErrorMessage'

import dashboardService from './dashboardService'



// Set initial state
const initialState = {
	dashboardData: null,
	allProjects: null,
	allUsers: null,
	allTickets: null,
	isLoading: true,
}



// getDashboard
export const getDashboard = createAsyncThunk('dashboard/getDashboard', async (_, thunkAPI) => {
	
	try {

		const token = thunkAPI.getState().user.user.token
		return await dashboardService.getDashboard(token)

	} catch (error) {

		return thunkAPI.rejectWithValue(extractErrorMessage(error))

	}

})



export const dashboardSlice = createSlice({
	name: 'dashboard',
	initialState,
	reducers: {
		resetDashboard: (state) => {
			state.dashboardData = null
			state.isLoading = true
		}
	},
	extraReducers: (builder) => {
		builder
			// getDashboard
			.addCase(getDashboard.pending, (state) => {
				state.isLoading = true
			})
			.addCase(getDashboard.fulfilled, (state, action) => {
				state.dashboardData = action.payload
				state.isLoading = false
			})
			.addCase(getDashboard.rejected, (state) => {
				state.isLoading = false
			})
	},
})

export const {resetDashboard} = dashboardSlice.actions
export default dashboardSlice.reducer