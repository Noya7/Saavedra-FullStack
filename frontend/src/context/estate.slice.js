import { createSlice } from "@reduxjs/toolkit";
import { archiveEstateAsync, deleteEstateAsync, editEstateAsync, getEstatesAsync, loadNextPageAsync } from "./estate.thunks";

const estateSlice = createSlice({
    name: 'estate',
    initialState: {query: null, results: null, pages: null, currentPage: null, isLoading: false},
    extraReducers: builder => {
        // builder.addCase(createEstateAsync.fulfilled, (state, action) => {console.log(action.payload)}),
        builder.addCase(getEstatesAsync.pending, (state) => {
            state.isLoading = true;
            state.results = null;
            state.currentPage = 1;
        }),
        builder.addCase(getEstatesAsync.fulfilled, (state, action) => {
            state.query = action.payload.query;
            state.results = action.payload.searchResults;
            state.pages = action.payload.totalPages;
            state.isLoading = false
        }),
        builder.addCase(loadNextPageAsync.pending, state => {state.isLoading = true}),
        builder.addCase(loadNextPageAsync.fulfilled, (state, action) => {
            state.query = action.payload.query;
            state.currentPage = action.payload.currentPage;
            state.results = state.results.concat(action.payload.searchResults);
            state.isLoading = false;
        }),
        builder.addCase(archiveEstateAsync.fulfilled, (state, action) => {
            const editedIndex = state.results.findIndex(estate => estate._id === action.payload.estate._id);
            state.results[editedIndex].rented = action.payload.estate.rented;
        }),
        builder.addCase(editEstateAsync.fulfilled, (state, action) => {
            const editedIndex = state.results.findIndex(estate => estate._id === action.payload.estate._id);
            state.results[editedIndex] = action.payload.estate;
        }),
        builder.addCase(deleteEstateAsync.fulfilled, (state, action) => {
            const deletedIndex = state.results.findIndex(estate => estate._id === action.payload.deletedEstate._id);
            state.results = state.results.filter((estate, index) => index !== deletedIndex);
        })
    }
})

export default estateSlice.reducer;