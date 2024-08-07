import { redirect } from "react-router-dom";
import store from "../../context/store"

const routeProtection = (isAuthRoute) => {
    const authState = store.getState().auth.userData;
    if (isAuthRoute && !authState) return redirect('/');
    if (!isAuthRoute && authState) return redirect('/');
    return null;
}

export const protectedRouteLoader = () => {routeProtection(true); return null}
export const unprotectedRouteLoader = () => {routeProtection(false); return null}

export default routeProtection;