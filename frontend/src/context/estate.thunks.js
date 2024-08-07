import { createAsyncThunk } from "@reduxjs/toolkit";
import httpRequest from "./httpRequest";

export const getEstatesAsync = createAsyncThunk('estate/get', async (params, thunkAPI) => {
    let query = `estate/get-estates?`;
    ['query', 'type', 'rooms', 'page'].forEach(param => {
        if (!!params[param]) query += `${param}=${encodeURIComponent(params[param])}&`;
    });
    query = query.slice(0, -1);
    const state = thunkAPI.getState().estate;
    const resultData = await httpRequest({suffix: query, method: 'GET'});
    resultData.query = query;
    return resultData;
});

export const loadNextPageAsync = createAsyncThunk('estate/next', async (page, thunkAPI) => {
    let state = thunkAPI.getState().estate;
    let query;
    if (state.currentPage === 1) query = state.query.includes('?') ? state.query.concat(`&page=${page}`) : state.query.concat(`?page=${page}`);
    else query = state.query.slice(0, -1) + page;
    const nextPageData = await httpRequest({suffix: query, method: 'GET'});
    nextPageData.query = query;
    return nextPageData;
})

export const createEstateAsync = createAsyncThunk('estate/create', async (body) => {
    const estateData = await httpRequest({suffix: 'estate/create-estate', method: 'POST', body, formData: true});
    return estateData;
})

export const deleteEstateAsync = createAsyncThunk('estate/delete', async (estateId) => {
    const deletionData = await httpRequest({suffix: `estate/delete-estate?estateId=${estateId}`, method: 'DELETE'});
    return deletionData;
})

export const archiveEstateAsync = createAsyncThunk('estate/archive', async(estateData) => {
    const responseData = await httpRequest({
        suffix: `estate/edit-estate?estateId=${estateData.estateId}`,
        method: 'PATCH',
        body: {rented: estateData.rented},
        json: true
    });
    return responseData;
})

export const editEstateAsync = createAsyncThunk('estate/edit', async(editData) => {
    const responseData = await httpRequest({
        suffix: `estate/edit-estate?estateId=${editData.estateId}`,
        method: 'PATCH',
        body: editData.formData,
        formData: true
    });
    return responseData;
})

export const getEstateByIdAsync = createAsyncThunk('estate/getById', async (estateId) => {
    const estateData = await httpRequest({suffix: `estate/get-estate?estateId=${estateId}`, method: 'GET'});
    return estateData;
})

export const getLocationByIdAsync = createAsyncThunk('estate/get-location', async (estateId) => {
    const locationData = await httpRequest({suffix: `estate/get-location?estateId=${estateId}`, method: 'GET'});
    return locationData;
})