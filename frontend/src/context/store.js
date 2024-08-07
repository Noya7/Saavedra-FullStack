import {configureStore} from '@reduxjs/toolkit';
import authReducer from './auth.slice';
import estateReducer from './estate.slice'

const store = configureStore({
    reducer: {auth: authReducer, estate: estateReducer}
})

export default store;