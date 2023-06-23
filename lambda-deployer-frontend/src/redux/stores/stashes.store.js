import { createSlice } from '@reduxjs/toolkit'
import { nanoid } from 'nanoid';
export const slice = createSlice({
    name: 'stashes',
    initialState: {
        collection: [],
    },
    reducers: {
        removeItem: (state, action) => {
            const removal_id = action.payload;
            state.collection = state.collection.filter(([func_name, func_def, id]) => id !== removal_id);
        },
        addItem: (state, action) => {
            state.collection.push(action.payload);
        }
    },
})

export const { removeItem, addItem } = slice.actions

export default slice.reducer