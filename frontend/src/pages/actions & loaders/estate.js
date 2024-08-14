import store from "../../context/store";
import { createEstateAsync, editEstateAsync, getEstateByIdAsync, getEstatesAsync, getLocationByIdAsync } from "../../context/estate.thunks";
import bodyExtractor from './bodyExtractor'
import routeProtection from "./routeProtection";

export const getEstatesAction = async ({request}) => {
    const formData = await request.formData();
    const plainData = bodyExtractor(formData)
    const data = await store.dispatch(getEstatesAsync(plainData));
    return data;
}

export const createEstateAction = async ({request}) => {   
    const formData = await request.formData();
    const data = await store.dispatch(createEstateAsync(formData));
    return data;
};

export const editEstateAction = async ({request, params}) => {   
    const formData = await request.formData();
    const data = await store.dispatch(editEstateAsync({formData, estateId: params.estateId}));
    return data;
};

export const deleteEstateLoader = ({params}) => {routeProtection(true); return params.estateId}

export const editEstateLoader = async ({params}) => {
    routeProtection(true);
    const estateData = await store.dispatch(getEstateByIdAsync(params.estateId));
    return estateData.payload;
}

export const getLocationLoader = async ({params}) => {
    const locationData = await store.dispatch(getLocationByIdAsync(params.estateId));
    return locationData.payload;
}