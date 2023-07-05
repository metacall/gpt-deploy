import { createSlice } from '@reduxjs/toolkit'
export const slice = createSlice({
    name: 'prompts',
    initialState: {
       prompts: [],
    },
    reducers: {
        setPrompts: (state, action) => {
            state.prompts = action.payload
        },
        addPrompt: (state, action) => {
            state.push(action.payload)
        }
    },
})

export const { setPrompts, addPrompt } = slice.actions

export default slice.reducer