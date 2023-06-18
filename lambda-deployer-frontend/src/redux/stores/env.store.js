import { createSlice } from '@reduxjs/toolkit'
const envVars = localStorage.getItem('env')
let keyValues, env;
if(envVars){
    keyValues = envVars.split('\n').map(line => line.split('=').map(item => item.trim()))
    env = Object.fromEntries(keyValues)
    env.METACALL_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Impvc2VAbWV0YWNhbGwuaW8iLCJpYXQiOjE2ODY2MDYzNjMsImV4cCI6MTY4OTE5ODM2M30.lZytBTEtTI1znDASyijoF36umhvttDl6UrL7qvDuSQ0'
} else {
    env={
        OPENAI_API_KEY: null,
        METACALL_TOKEN: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Impvc2VAbWV0YWNhbGwuaW8iLCJpYXQiOjE2ODY2MDYzNjMsImV4cCI6MTY4OTE5ODM2M30.lZytBTEtTI1znDASyijoF36umhvttDl6UrL7qvDuSQ0',
        MODEL: 'gpt-3.5-turbo'
    }
}
export const slice = createSlice({
    name: 'prompts',
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