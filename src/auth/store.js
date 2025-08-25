import { configureStore } from "@reduxjs/toolkit";
import authReducer from './authSlice';
import permissionReducer from './permissionSlice'
import pageReducer from './pagesSlice'
import roleReducer from './rolesSlice'

export const store = configureStore({
    reducer:{
        auth: authReducer,
        permissions: permissionReducer,
        pages: pageReducer,
        roles: roleReducer
    }
})