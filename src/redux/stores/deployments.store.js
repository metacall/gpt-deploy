import { createSlice } from '@reduxjs/toolkit'
export const slice = createSlice({
    name: 'deployments',
    initialState: {
        deployments: null,
    },
    reducers: {
        setDeployments: (state, action) => {
            state.deployments = action.payload
        }
    },
})

export const { setDeployments } = slice.actions

export default slice.reducer