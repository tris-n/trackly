import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import { extractErrorMessage } from '../../utilities/extractErrorMessage'

import projectService from './projectService'



// Set initial state
const initialState = {
	allProjects: null,
	singleProject: null,
	isLoading: true,
}



// createProject
export const createProject = createAsyncThunk('projects/createProject', async (projectData, thunkAPI) => {
	
	try {

		const token = thunkAPI.getState().user.user.token
		return await projectService.createProject(projectData, token)

	} catch (error) {

		return thunkAPI.rejectWithValue(extractErrorMessage(error))

	}

})



// getAllProjects
export const getAllProjects = createAsyncThunk('projects/getAllProjects', async (_, thunkAPI) => {
	
	try {

		const token = thunkAPI.getState().user.user.token
		return await projectService.getAllProjects(token)

	} catch (error) {

		return thunkAPI.rejectWithValue(extractErrorMessage(error))

	}

})



// getSingleProject
export const getSingleProject = createAsyncThunk('projects/getSingleProject', async (projectId, thunkAPI) => {
	
	try {

		const token = thunkAPI.getState().user.user.token
		return await projectService.getSingleProject(projectId, token)

	} catch (error) {

		return thunkAPI.rejectWithValue(extractErrorMessage(error))

	}

})



// // updateProject
export const updateProject = createAsyncThunk('projects/updateProject', async (projectData, thunkAPI) => {
	
	try {

		const { projectId, projectUpdate } = projectData

		const token = thunkAPI.getState().user.user.token
		return await projectService.updateProject(projectId, projectUpdate, token)

	} catch (error) {

		return thunkAPI.rejectWithValue(extractErrorMessage(error))

	}

})



// deleteProject
export const deleteProject = createAsyncThunk('projects/deleteProject', async (projectId, thunkAPI) => {
	
	try {

		const token = thunkAPI.getState().user.user.token
		return await projectService.deleteProject(projectId, token)

	} catch (error) {

		return thunkAPI.rejectWithValue(extractErrorMessage(error))

	}

})



// deleteProjects
export const deleteProjects = createAsyncThunk('projects/deleteProjects', async (projects, thunkAPI) => {
	
	for (const projectId of projects) {
		
		
		try {
			
			const token = thunkAPI.getState().user.user.token
			await projectService.deleteProject(projectId, token)

		} catch (error) {

			return thunkAPI.rejectWithValue(extractErrorMessage(error))

		}

	}

	return {}

})



export const projectSlice = createSlice({
	name: 'projects',
	initialState,
	reducers: {
		resetSingleProject: (state) => {
			state.singleProject = null
		}
	},
	extraReducers: (builder) => {
		builder
			// createProject
			.addCase(createProject.pending, (state) => {
				state.isLoading = true
			})
			.addCase(createProject.fulfilled, (state, action) => {
				state.singleProject = action.payload
				state.isLoading = false
			})
			.addCase(createProject.rejected, (state) => {
				state.isLoading = false
			})
			// getAllProjects
			.addCase(getAllProjects.pending, (state) => {
				state.isLoading = true
			})
			.addCase(getAllProjects.fulfilled, (state, action) => {
				state.allProjects = action.payload
				state.isLoading = false
			})
			.addCase(getAllProjects.rejected, (state) => {
				state.isLoading = false
			})
			// getSingleProject
			.addCase(getSingleProject.pending, (state) => {
				state.isLoading = true
			})
			.addCase(getSingleProject.fulfilled, (state, action) => {
				state.singleProject = action.payload
				state.isLoading = false
			})
			.addCase(getSingleProject.rejected, (state) => {
				state.isLoading = false
			})
			// updateProject
			.addCase(updateProject.pending, (state) => {
				state.isLoading = true
			})
			.addCase(updateProject.fulfilled, (state, action) => {
				state.singleProject = action.payload
				state.isLoading = false
			})
			.addCase(updateProject.rejected, (state) => {
				state.isLoading = false
			})
			// deleteProject
			.addCase(deleteProject.pending, (state) => {
				state.isLoading = true
			})
			.addCase(deleteProject.fulfilled, (state, action) => {	
				state.singleProject = {}
				state.isLoading = false
			})
			.addCase(deleteProject.rejected, (state) => {
				state.isLoading = false
			})
			// deleteProjects
			.addCase(deleteProjects.pending, (state) => {
				state.isLoading = true
			})
			.addCase(deleteProjects.fulfilled, (state, action) => {	
				state.isLoading = false
			})
			.addCase(deleteProjects.rejected, (state) => {
				state.isLoading = false
			})
	},
})

export const {resetSingleProject} = projectSlice.actions
export default projectSlice.reducer