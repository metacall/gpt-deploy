import { createSlice } from '@reduxjs/toolkit'
export const slice = createSlice({
    name: 'fullscreen',
    initialState: {
        isFullscreen: false,
    },
    reducers: {
        setFullscreen: (state, action) => {
            state.isFullscreen = action.payload
        }
    },
})

export const { setFullscreen } = slice.actions

export default slice.reducer