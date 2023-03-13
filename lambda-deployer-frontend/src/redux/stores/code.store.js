import { createSlice } from '@reduxjs/toolkit'

export const slice = createSlice({
    name: 'code',
    initialState: {
        codes: [],
        selectedIndex: 0
    },
    reducers: {
        updateCode: (state, action) => {
            state.codes= action.payload;
            // if(state.codes.length === 0) {
            //     state.codes.push({id: 'start', name: 'New Code', code: '' });
            // }
            state.selectedIndex = state.codes.length - 1;
        },
        updateSelectedIndex: (state, action) => {
            state.selectedIndex = action.payload;
        }

    },
})

export const { updateCode, updateSelectedIndex } = slice.actions

export default slice.reducer