import { createAsyncThunk } from "@reduxjs/toolkit";

import httpRequest from "./httpRequest";

export const loginAsync = createAsyncThunk('auth/login', async (credentials) => {
    const loginData = await httpRequest({suffix: 'auth/login', method: 'POST', body: credentials, json: true });
    return loginData;
})

export const tokenLoginAsync = createAsyncThunk('auth/tokenLogin', async() => {
    const loginData = await httpRequest({suffix: 'auth/tokenLogin', method: 'GET'});
    return loginData;
})

export const logoutAsync = createAsyncThunk('auth/logout', async () => {
    const logoutData = await httpRequest({suffix: 'auth/logout', method: 'GET'});
    return logoutData;
})

export const getResetMailAsync = createAsyncThunk('auth/get-reset', async (body) => {
    const requestData = await httpRequest({suffix: 'auth/reset-mail', method: 'POST', body, json: true});
    return requestData;
})

export const verifyResetTokenAsync = createAsyncThunk('auth/verify', async (token) => {
    const verificationData = await httpRequest({
        suffix: `auth/verify-reset-token`, method: 'GET', headers: {"token": token}
    });
    return verificationData;
})

export const resetPassAsync = createAsyncThunk('/auth/reset', async (credentials) => {
    const resetData = await httpRequest({
        suffix: 'auth/reset-password',
        method: 'POST',
        body: credentials.reqBody,
        json: true,
        headers: {"token": credentials.token}
    })
    return resetData;
})