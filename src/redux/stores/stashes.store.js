import { createSlice } from '@reduxjs/toolkit';
export const slice = createSlice({
    name: 'stashes',
    initialState: {
        collection: [],
    },
    reducers: {
        removeItem: (state, action) => {
            const removal_id = action.payload;
            state.collection = state.collection.filter(([_, id]) => id !== removal_id);
        },
        addItem: (state, action) => {
            state.collection.push(action.payload);
        }
    },
})

export const { removeItem, addItem } = slice.actions

export default slice.reducer