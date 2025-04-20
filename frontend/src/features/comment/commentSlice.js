import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import { extractErrorMessage } from '../../utilities/extractErrorMessage'

import commentService from './commentService'



// Set initial state
const initialState = {
	allComments: null,
	singleComment: null,
	isLoading: true,
}



// createComment
export const createComment = createAsyncThunk('comments/createComment', async (commentData, thunkAPI) => {
	
	try {

		const token = thunkAPI.getState().user.user.token
		return await commentService.createComment(commentData, token)

	} catch (error) {

		return thunkAPI.rejectWithValue(extractErrorMessage(error))

	}

})



// getAllComments
export const getAllComments = createAsyncThunk('comments/getAllComments', async (query, thunkAPI) => {
	
	try {

		const token = thunkAPI.getState().user.user.token
		return await commentService.getAllComments(query, token)

	} catch (error) {

		return thunkAPI.rejectWithValue(extractErrorMessage(error))

	}

})



// getSingleComment
export const getSingleComment = createAsyncThunk('comments/getSingleComment', async (commentId, thunkAPI) => {
	
	try {

		const token = thunkAPI.getState().user.user.token
		return await commentService.getSingleComment(commentId, token)

	} catch (error) {

		return thunkAPI.rejectWithValue(extractErrorMessage(error))

	}

})



// // updateComment
export const updateComment = createAsyncThunk('comments/updateComment', async (commentData, thunkAPI) => {
	
	try {

		const { commentId, commentUpdate } = commentData

		const token = thunkAPI.getState().user.user.token
		return await commentService.updateComment(commentId, commentUpdate, token)

	} catch (error) {

		return thunkAPI.rejectWithValue(extractErrorMessage(error))

	}

})



// deleteComment
export const deleteComment = createAsyncThunk('comments/deleteComment', async (commentId, thunkAPI) => {
	
	try {

		const token = thunkAPI.getState().user.user.token
		return await commentService.deleteComment(commentId, token)

	} catch (error) {

		return thunkAPI.rejectWithValue(extractErrorMessage(error))

	}

})



// deleteComments
export const deleteComments = createAsyncThunk('comments/deleteComments', async (comments, thunkAPI) => {
	
	for (const commentId of comments) {
		
		
		try {
			
			const token = thunkAPI.getState().user.user.token
			await commentService.deleteComment(commentId, token)

		} catch (error) {

			return thunkAPI.rejectWithValue(extractErrorMessage(error))

		}

	}

	return {}

})



export const commentSlice = createSlice({
	name: 'comments',
	initialState,
	reducers: {
		resetComments: (state) => {
			state.allComments = null
			state.singleComment = null
		}
	},
	extraReducers: (builder) => {
		builder
			// createComment
			.addCase(createComment.pending, (state) => {
				state.isLoading = true
			})
			.addCase(createComment.fulfilled, (state, action) => {
				state.singleComment = action.payload
				state.isLoading = false
			})
			.addCase(createComment.rejected, (state) => {
				state.isLoading = false
			})
			// getAllComments
			.addCase(getAllComments.pending, (state) => {
				state.isLoading = true
			})
			.addCase(getAllComments.fulfilled, (state, action) => {
				state.allComments = action.payload
				state.isLoading = false
			})
			.addCase(getAllComments.rejected, (state) => {
				state.isLoading = false
			})
			// getSingleComment
			.addCase(getSingleComment.pending, (state) => {
				state.isLoading = true
			})
			.addCase(getSingleComment.fulfilled, (state, action) => {
				state.singleComment = action.payload
				state.isLoading = false
			})
			.addCase(getSingleComment.rejected, (state) => {
				state.isLoading = false
			})
			// updateComment
			.addCase(updateComment.pending, (state) => {
				state.isLoading = true
			})
			.addCase(updateComment.fulfilled, (state, action) => {
				state.singleComment = action.payload
				state.isLoading = false
			})
			.addCase(updateComment.rejected, (state) => {
				state.isLoading = false
			})
			// deleteComment
			.addCase(deleteComment.pending, (state) => {
				state.isLoading = true
			})
			.addCase(deleteComment.fulfilled, (state, action) => {	
				state.singleComment = {}
				state.isLoading = false
			})
			.addCase(deleteComment.rejected, (state) => {
				state.isLoading = false
			})
			// deleteComments
			.addCase(deleteComments.pending, (state) => {
				state.isLoading = true
			})
			.addCase(deleteComments.fulfilled, (state, action) => {	
				state.isLoading = false
			})
			.addCase(deleteComments.rejected, (state) => {
				state.isLoading = false
			})
	},
})

export const {resetComments} = commentSlice.actions
export default commentSlice.reducer