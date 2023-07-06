import { createSlice } from '@reduxjs/toolkit'
const envVars = localStorage.getItem('env')
let keyValues, env = {
    OPENAI_API_KEY: '',
    METACALL_TOKEN: '',
    MODEL: 'text-davinci-003'
};
if(envVars){
    keyValues = envVars.split('\n').map(line => line.split('=').map(item => item.trim()))
    env = Object.fromEntries(keyValues)
}
export const slice = createSlice({
    name: 'envs',
    initialState: env,
    reducers: {
        setOpenAIKey: (state, action) => {
            state.OPENAI_API_KEY = action.payload
        },
        setMetacallToken: (state, action) => {
            state.METACALL_TOKEN = action.payload
        },
        setModel: (state, action) => {
            state.MODEL = action.payload
        }
    },
})

export const { setOpenAIKey, setMetacallToken, setModel } = slice.actions

export default slice.reducer