import { configureStore } from '@reduxjs/toolkit';
import code from './stores/code.store';


export default configureStore({
    reducer: {
        code,
    },
});
