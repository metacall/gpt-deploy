import { createSlice } from '@reduxjs/toolkit'
import { nanoid } from 'nanoid';
export const slice = createSlice({
    name: 'code',
    initialState: {
        codes: [{code: '', title: '<code>', id: nanoid()}],
        selectedIndex: 0
    },
    reducers: {
        updateCode: (state, action) => {
            state.codes= action.payload.codesData;
            if(action.payload.modificationType === 'add')
                state.selectedIndex = state.codes.length - 1;
            
            if(state.codes.length === 0 ){
                state.selectedIndex = 0;
                state.codes.push({code: '', title: '<code>', id: nanoid()});
            }

            if(state.codes.length <= state.selectedIndex )
                state.selectedIndex = state.codes.length - 1;
        },
        updateSelectedIndex: (state, action) => {
            state.selectedIndex = action.payload;
        }

    },
})

export const { updateCode, updateSelectedIndex } = slice.actions

export default slice.reducer