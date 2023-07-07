import { createSlice } from '@reduxjs/toolkit';
export const slice = createSlice({
    name: 'stashes',
    initialState: {
        stashedKeys: [],
    },
    reducers: {
        removeItem: (state, action) => {
            const removal_id = action.payload;
            state.stashedKeys = state.stashedKeys.filter((id) => id !== removal_id);
        },
        addItem: (state, action) => {
            state.stashedKeys.push(action.payload);
        },
        setItems: (state, action) => {
            state.stashedKeys = action.payload;
        }
    },
})

export const { removeItem, addItem, setItems } = slice.actions

export default slice.reducer