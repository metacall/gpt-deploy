import { createSlice } from '@reduxjs/toolkit'

export const slice = createSlice({
    name: 'code',
    initialState: {
        codeTitle: 'no-title',
        code: 'function '
    },
    reducers: {
        updateCodeTitle: (state, action) => {
            state.codeTitle = action.payload
        },
        updateCode: (state, action) => {
            state.code = action.payload
        }
    },
})

export const { updateCode, updateCodeTitle } = slice.actions

export default slice.reducer