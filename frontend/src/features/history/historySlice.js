import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import { extractErrorMessage } from '../../utilities/extractErrorMessage'

import historyService from './historyService'



// Set initial state
const initialState = {
	allHistory: null,
	allHistoryAllComments: null,
	singleHistory: null,
	isLoading: true,
}



// createHistory
export const createHistory = createAsyncThunk('history/createHistory', async (historyData, thunkAPI) => {
	
	try {

		const token = thunkAPI.getState().user.user.token
		return await historyService.createHistory(historyData, token)

	} catch (error) {

		return thunkAPI.rejectWithValue(extractErrorMessage(error))

	}

})



// getAllHistory
export const getAllHistory = createAsyncThunk('history/getAllHistory', async (query, thunkAPI) => {
	
	try {

		const token = thunkAPI.getState().user.user.token
		return await historyService.getAllHistory(query, token)

	} catch (error) {

		return thunkAPI.rejectWithValue(extractErrorMessage(error))

	}

})


// getAllHistoryAllComments
export const getAllHistoryAllComments = createAsyncThunk('history/getAllHistoryAllComments', async (query, thunkAPI) => {
	
	try {

		const token = thunkAPI.getState().user.user.token
		return await historyService.getAllHistoryAllComments(query, token)

	} catch (error) {

		return thunkAPI.rejectWithValue(extractErrorMessage(error))

	}

})



// getSingleHistory
export const getSingleHistory = createAsyncThunk('history/getSingleHistory', async (historyId, thunkAPI) => {
	
	try {

		const token = thunkAPI.getState().user.user.token
		return await historyService.getSingleHistory(historyId, token)

	} catch (error) {

		return thunkAPI.rejectWithValue(extractErrorMessage(error))

	}

})



// // updateHistory
export const updateHistory = createAsyncThunk('history/updateHistory', async (historyData, thunkAPI) => {
	
	try {

		const { historyId, historyUpdate } = historyData

		const token = thunkAPI.getState().user.user.token
		return await historyService.updateHistory(historyId, historyUpdate, token)

	} catch (error) {

		return thunkAPI.rejectWithValue(extractErrorMessage(error))

	}

})



// deleteHistory
export const deleteHistory = createAsyncThunk('history/deleteHistory', async (historyId, thunkAPI) => {
	
	try {

		const token = thunkAPI.getState().user.user.token
		return await historyService.deleteHistory(historyId, token)

	} catch (error) {

		return thunkAPI.rejectWithValue(extractErrorMessage(error))

	}

})



// deleteMultipleHistory
export const deleteMultipleHistory = createAsyncThunk('history/deleteMultipleHistory', async (history, thunkAPI) => {
	
	for (const historyId of history) {
		
		
		try {
			
			const token = thunkAPI.getState().user.user.token
			await historyService.deleteHistory(historyId, token)

		} catch (error) {

			return thunkAPI.rejectWithValue(extractErrorMessage(error))

		}

	}

	return {}

})



export const historySlice = createSlice({
	name: 'history',
	initialState,
	reducers: {
		// resetSingleHistory: (state) => {
		// 	// state.allHistory = null -- turned this off, because its okay to have it stay in memory
		// 	state.singleHistory = null
		// }
		resetHistory: (state) => {
			state.allHistory = null
			state.allHistoryAllComments = null
			state.singleHistory = null
		}
	},
	extraReducers: (builder) => {
		builder
			// createHistory
			.addCase(createHistory.pending, (state) => {
				state.isLoading = true
			})
			.addCase(createHistory.fulfilled, (state, action) => {
				state.singleHistory = action.payload
				state.isLoading = false
			})
			.addCase(createHistory.rejected, (state) => {
				state.isLoading = false
			})
			// getAllHistory
			.addCase(getAllHistory.pending, (state) => {
				state.isLoading = true
			})
			.addCase(getAllHistory.fulfilled, (state, action) => {
				state.allHistory = action.payload
				state.isLoading = false
			})
			.addCase(getAllHistory.rejected, (state) => {
				state.isLoading = false
			})
			// getAllHistoryAllComments
			.addCase(getAllHistoryAllComments.pending, (state) => {
				state.isLoading = true
			})
			.addCase(getAllHistoryAllComments.fulfilled, (state, action) => {
				state.allHistoryAllComments = action.payload
				state.isLoading = false
			})
			.addCase(getAllHistoryAllComments.rejected, (state) => {
				state.isLoading = false
			})
			// getSingleHistory
			.addCase(getSingleHistory.pending, (state) => {
				state.isLoading = true
			})
			.addCase(getSingleHistory.fulfilled, (state, action) => {
				state.singleHistory = action.payload
				state.isLoading = false
			})
			.addCase(getSingleHistory.rejected, (state) => {
				state.isLoading = false
			})
			// updateHistory
			.addCase(updateHistory.pending, (state) => {
				state.isLoading = true
			})
			.addCase(updateHistory.fulfilled, (state, action) => {
				state.singleHistory = action.payload
				state.isLoading = false
			})
			.addCase(updateHistory.rejected, (state) => {
				state.isLoading = false
			})
			// deleteHistory
			.addCase(deleteHistory.pending, (state) => {
				state.isLoading = true
			})
			.addCase(deleteHistory.fulfilled, (state, action) => {	
				// update allUsers feedback.filter((item) => item._id !== id)
				// state.allUsers.filter((user) => user._id !== state.singleUser._id)
				// maybe i just do this in the page
				state.singleHistory = {}
				state.isLoading = false
			})
			.addCase(deleteHistory.rejected, (state) => {
				state.isLoading = false
			})
			// deleteMultipleHistory
			.addCase(deleteMultipleHistory.pending, (state) => {
				state.isLoading = true
			})
			.addCase(deleteMultipleHistory.fulfilled, (state, action) => {	
				state.isLoading = false
			})
			.addCase(deleteMultipleHistory.rejected, (state) => {
				state.isLoading = false
			})
	},
})

export const {resetHistory} = historySlice.actions
export default historySlice.reducer