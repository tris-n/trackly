import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import { extractErrorMessage } from '../../utilities/extractErrorMessage'

import ticketService from './ticketService'



// Set initial state
const initialState = {
	allTickets: null,
	singleProjectTickets: null,
	singleUserTickets: null,
	singleTicket: null,
	isLoading: true,
}



// createTicket
export const createTicket = createAsyncThunk('tickets/createTicket', async (ticketData, thunkAPI) => {
	
	try {

		const token = thunkAPI.getState().user.user.token
		return await ticketService.createTicket(ticketData, token)

	} catch (error) {

		return thunkAPI.rejectWithValue(extractErrorMessage(error))

	}

})



// getAllTickets
export const getAllTickets = createAsyncThunk('tickets/getAllTickets', async (query, thunkAPI) => {
	
	try {

		const token = thunkAPI.getState().user.user.token
		return await ticketService.getAllTickets(query, token)

	} catch (error) {

		return thunkAPI.rejectWithValue(extractErrorMessage(error))

	}

})



// getSingleTicket
export const getSingleTicket = createAsyncThunk('tickets/getSingleTicket', async (ticketId, thunkAPI) => {
	
	try {

		const token = thunkAPI.getState().user.user.token
		return await ticketService.getSingleTicket(ticketId, token)

	} catch (error) {

		return thunkAPI.rejectWithValue(extractErrorMessage(error))

	}

})



// // updateTicket
export const updateTicket = createAsyncThunk('tickets/updateTicket', async (ticketData, thunkAPI) => {
	
	try {

		const { ticketId, ticketUpdate } = ticketData

		const token = thunkAPI.getState().user.user.token
		return await ticketService.updateTicket(ticketId, ticketUpdate, token)

	} catch (error) {

		return thunkAPI.rejectWithValue(extractErrorMessage(error))

	}

})



// deleteTicket
export const deleteTicket = createAsyncThunk('tickets/deleteTicket', async (ticketId, thunkAPI) => {
	
	try {

		const token = thunkAPI.getState().user.user.token
		return await ticketService.deleteTicket(ticketId, token)

	} catch (error) {

		return thunkAPI.rejectWithValue(extractErrorMessage(error))

	}

})



// deleteTickets
export const deleteTickets = createAsyncThunk('tickets/deleteTickets', async (tickets, thunkAPI) => {
	
	for (const ticketId of tickets) {
		
		
		try {
			
			const token = thunkAPI.getState().user.user.token
			await ticketService.deleteTicket(ticketId, token)

		} catch (error) {

			return thunkAPI.rejectWithValue(extractErrorMessage(error))

		}

	}

	return {}

})



export const ticketSlice = createSlice({
	name: 'tickets',
	initialState,
	reducers: {
		resetSingleTicket: (state) => {
			state.singleTicket = null
		},
		resetTickets: (state) => {
			state.allTickets = null
			state.singleTicket = null
		}
	},
	extraReducers: (builder) => {
		builder
			// createTicket
			.addCase(createTicket.pending, (state) => {
				state.isLoading = true
			})
			.addCase(createTicket.fulfilled, (state, action) => {
				state.singleTicket = action.payload
				state.isLoading = false
			})
			.addCase(createTicket.rejected, (state) => {
				state.isLoading = false
			})
			// getAllTickets
			.addCase(getAllTickets.pending, (state) => {
				state.isLoading = true
			})
			.addCase(getAllTickets.fulfilled, (state, action) => {

				if (action.payload[0].queryType === 'all') {
					action.payload.shift() // removes the queryType from the array
					state.allTickets = action.payload

				} else if (action.payload[0].queryType === 'singleProject') {
					action.payload.shift() // removes the queryType from the array
					state.singleProjectTickets = action.payload

				} else if (action.payload[0].queryType === 'singleUser') {
					action.payload.shift() // removes the queryType from the array
					state.singleUserTickets = action.payload
				}

				state.isLoading = false

			})
			.addCase(getAllTickets.rejected, (state) => {
				state.isLoading = false
			})
			// getSingleTicket
			.addCase(getSingleTicket.pending, (state) => {
				state.isLoading = true
			})
			.addCase(getSingleTicket.fulfilled, (state, action) => {
				state.singleTicket = action.payload
				state.isLoading = false
			})
			.addCase(getSingleTicket.rejected, (state) => {
				state.isLoading = false
			})
			// updateTicket
			.addCase(updateTicket.pending, (state) => {
				state.isLoading = true
			})
			.addCase(updateTicket.fulfilled, (state, action) => {
				state.singleTicket = action.payload
				state.isLoading = false
			})
			.addCase(updateTicket.rejected, (state) => {
				state.isLoading = false
			})
			// deleteTicket
			.addCase(deleteTicket.pending, (state) => {
				state.isLoading = true
			})
			.addCase(deleteTicket.fulfilled, (state, action) => {	
				// update allUsers feedback.filter((item) => item._id !== id)
				// state.allUsers.filter((user) => user._id !== state.singleUser._id)
				// maybe i just do this in the page
				state.singleTicket = {}
				state.isLoading = false
			})
			.addCase(deleteTicket.rejected, (state) => {
				state.isLoading = false
			})
			// deleteTickets
			.addCase(deleteTickets.pending, (state) => {
				state.isLoading = true
			})
			.addCase(deleteTickets.fulfilled, (state, action) => {	
				state.isLoading = false
			})
			.addCase(deleteTickets.rejected, (state) => {
				state.isLoading = false
			})
	},
})

export const {resetTickets, resetSingleTicket} = ticketSlice.actions
export default ticketSlice.reducer