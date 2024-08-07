import store from '../../context/store'
import bodyExtractor from './bodyExtractor'
import { getResetMailAsync, loginAsync, resetPassAsync, tokenLoginAsync, verifyResetTokenAsync } from '../../context/auth.thunks';
import { redirect } from 'react-router-dom';

//ACTIONS:

export const loginAction = async ({request}) => {
    const formData = await request.formData();
    const body = bodyExtractor(formData);
    const data = await store.dispatch(loginAsync(body));
    if (data.error) return data;
    return redirect('/');
};

export const getResetMailAction = async ({request}) => {
    const formData = await request.formData();
    const body = bodyExtractor(formData);
    const data = await store.dispatch(getResetMailAsync(body));
    return data;
};

export const resetPasswordAction = async ({request, params}) => {
    const url = new URL(request.url);
    const token = url.searchParams.get('token');
    const formData = await request.formData()
    const body = bodyExtractor(formData);
    const data = await store.dispatch(resetPassAsync({reqBody: {password: body.password}, token}));
    return data;
};

//LOADERS:

export const tokenLoginLoader = async () => {
    const state = store.getState().auth;
    if (state.tokenVerified) return null;
    const data = await store.dispatch(tokenLoginAsync())
    if(data.type === 'auth/tokenLogin/rejected') return null;
    return data;
}

export const resetPasswordLoader = async ({request}) => {
    const url = new URL(request.url);
    const token = url.searchParams.get('token');
    if (!token) return redirect(`/?err=Error:%20Token%20no%20encontrado`);
    const resetData = await store.dispatch(verifyResetTokenAsync(token))
    if (resetData.error) return redirect(`/?err=${resetData.error.message}`);
    return resetData;
}