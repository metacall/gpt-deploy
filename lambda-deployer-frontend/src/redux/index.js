import { configureStore } from '@reduxjs/toolkit';
import code from './stores/code.store';
import prompts from './stores/prompts.store';

export default configureStore({
    reducer: {
        code,
        prompts
    },
});
