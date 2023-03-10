import { createSlice } from '@reduxjs/toolkit'
const defaultPrompts = ["take two strings as parameter and return contatenation of them in upper case",
                        "return object passed in parameter", 
                        "add two number",
                        "return the sum of all numbers in an array"]
const randomPrompt = defaultPrompts[Math.floor(Math.random() * defaultPrompts.length)]
export const slice = createSlice({
    name: 'prompts',
    initialState: [randomPrompt],
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