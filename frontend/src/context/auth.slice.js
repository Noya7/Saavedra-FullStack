import { createSlice } from "@reduxjs/toolkit";
import { loginAsync, logoutAsync, tokenLoginAsync } from "./auth.thunks";

const authSlice = createSlice({
    name: 'auth',
    initialState: {userData: null, tokenVerified: false},
    extraReducers: builder => {
        builder.addCase(loginAsync.fulfilled, (state, action) => {state.userData = action.payload.userData, state.tokenVerified = true}),
        builder.addCase(logoutAsync.fulfilled, state => {state.userData = null, state.tokenVerified = false}),
        builder.addCase(tokenLoginAsync.fulfilled, (state, action) => {state.userData = action.payload.userData, state.tokenVerified = true}),
        builder.addCase(tokenLoginAsync.rejected, state => {state.tokenVerified = true})
    }
})

export default authSlice.reducer;