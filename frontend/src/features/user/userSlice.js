import {createSlice, createAsyncThunk, createAction} from '@reduxjs/toolkit'
import { extractErrorMessage } from '../../utilities/extractErrorMessage'

import userService from './userService'



// Get user from localstorage
const user = JSON.parse(localStorage.getItem('user'))

// Set initial state
const initialState = {
	user: user ? user : null,
	allUsers: null,
	singleUser: null,
	isLoading: true
}



// Register User
export const registerUser = createAsyncThunk('user/registerUser', async (user, thunkAPI) => {
	
	try {

		return await userService.registerUser(user)

	} catch (error) {

		return thunkAPI.rejectWithValue(extractErrorMessage(error))

	}

})



// Create User // creates a user but doesnt log them in
export const createUser = createAsyncThunk('user/createUser', async (user, thunkAPI) => {
	
	try {

		const token = thunkAPI.getState().user.user.token
		return await userService.createUser(user, token)

	} catch (error) {

		return thunkAPI.rejectWithValue(extractErrorMessage(error))

	}

})



// Login User
export const loginUser = createAsyncThunk('user/loginUser', async (user, thunkAPI) => {
	
	try {

		return await userService.loginUser(user)

	} catch (error) {

		return thunkAPI.rejectWithValue(extractErrorMessage(error))

	}

})



// Get All Users
export const getAllUsers = createAsyncThunk('user/getAllUsers', async (_, thunkAPI) => {
	
	try {

		const token = thunkAPI.getState().user.user.token
		return await userService.getAllUsers(token)

	} catch (error) {

		return thunkAPI.rejectWithValue(extractErrorMessage(error))

	}

})



// Get Single User
export const getSingleUser = createAsyncThunk('user/getSingleUser', async (userId, thunkAPI) => {
	
	try {

		const token = thunkAPI.getState().user.user.token
		return await userService.getSingleUser(userId, token)

	} catch (error) {

		return thunkAPI.rejectWithValue(extractErrorMessage(error))

	}

})



// Update User
export const updateUser = createAsyncThunk('user/updateUser', async (userData, thunkAPI) => {
	
	try {

		const { userId, userUpdate } = userData

		const token = thunkAPI.getState().user.user.token
		return await userService.updateUser(userId, userUpdate, token)

	} catch (error) {

		return thunkAPI.rejectWithValue(extractErrorMessage(error))

	}

})



// Delete User
export const deleteUser = createAsyncThunk('user/deleteUser', async (userId, thunkAPI) => {
	
	try {

		const token = thunkAPI.getState().user.user.token
		return await userService.deleteUser(userId, token)

	} catch (error) {

		return thunkAPI.rejectWithValue(extractErrorMessage(error))

	}

})



// Delete Users
export const deleteUsers = createAsyncThunk('user/deleteUsers', async (users, thunkAPI) => {

	
	for (const userId of users) {
		
		
		try {
			
			const token = thunkAPI.getState().user.user.token
			await userService.deleteUser(userId, token)

		} catch (error) {

			return thunkAPI.rejectWithValue(extractErrorMessage(error))

		}

	}

	return {}

})



// Logout user
export const logout = createAction('user/logout', () => {
	userService.logout()
	// return an empty object as our payload as we don't need a payload but the
	// prepare function requires a payload return
	return {}
})



export const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		logout: (state) => {
			state.user = null
			state.allUsers = null
			state.singleUser = null
		},
		resetSingleUser: (state) => {
			state.singleUser = null
		},
		updateLoggedInUser: (state) => {
			state.user = {...state.user, name: state.singleUser.name, email: state.singleUser.email, role: state.singleUser.role}
		}
	},
	extraReducers: (builder) => {
		builder
			// registerUser
			.addCase(registerUser.pending, (state) => {
				state.isLoading = true
			})
			.addCase(registerUser.fulfilled, (state, action) => {
				state.user = action.payload
				state.isLoading = false
			})
			.addCase(registerUser.rejected, (state) => {
				state.isLoading = false
			})
			// createUser
			.addCase(createUser.pending, (state) => {
				state.isLoading = true
			})
			.addCase(createUser.fulfilled, (state, action) => {
				// state.user = action.payload
				state.isLoading = false
			})
			.addCase(createUser.rejected, (state) => {
				state.isLoading = false
			})
			// loginUser
			.addCase(loginUser.pending, (state) => {
				state.isLoading = true
			})
			.addCase(loginUser.fulfilled, (state, action) => {
				state.user = action.payload
				state.isLoading = false
			})
			.addCase(loginUser.rejected, (state) => {
				state.isLoading = false
			})
			// getAllUsers
			.addCase(getAllUsers.pending, (state) => {
				state.isLoading = true
			})
			.addCase(getAllUsers.fulfilled, (state, action) => {
				state.allUsers = action.payload
				state.isLoading = false
			})
			.addCase(getAllUsers.rejected, (state) => {
				state.isLoading = false
			})
			// getSingleUser
			.addCase(getSingleUser.pending, (state) => {
				state.isLoading = true
			})
			.addCase(getSingleUser.fulfilled, (state, action) => {
				state.singleUser = action.payload
				state.isLoading = false
			})
			.addCase(getSingleUser.rejected, (state) => {
				state.isLoading = false
			})
			// updateUser
			.addCase(updateUser.pending, (state) => {
				state.isLoading = true
			})
			.addCase(updateUser.fulfilled, (state, action) => {
				state.singleUser = action.payload
				state.isLoading = false
			})
			.addCase(updateUser.rejected, (state) => {
				state.isLoading = false
			})
			// deleteUser
			.addCase(deleteUser.pending, (state) => {
				state.isLoading = true
			})
			.addCase(deleteUser.fulfilled, (state, action) => {	
				// update allUsers feedback.filter((item) => item._id !== id)
				// state.allUsers.filter((user) => user._id !== state.singleUser._id)
				// maybe i just do this in the page
				state.singleUser = {}
				state.isLoading = false
			})
			.addCase(deleteUser.rejected, (state) => {
				state.isLoading = false
			})
			// deleteUsers
			.addCase(deleteUsers.pending, (state) => {
				state.isLoading = true
			})
			.addCase(deleteUsers.fulfilled, (state, action) => {	
				state.isLoading = false
			})
			.addCase(deleteUsers.rejected, (state) => {
				state.isLoading = false
			})
	}
})

export const {resetSingleUser, updateLoggedInUser} = userSlice.actions
export default userSlice.reducer