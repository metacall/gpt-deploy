import { configureStore } from '@reduxjs/toolkit';
import codes from './stores/code.store';
import prompts from './stores/prompts.store';

export default configureStore({
    reducer: {
        codes,
        prompts
    },
});
