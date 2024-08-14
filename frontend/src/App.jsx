import {createBrowserRouter, RouterProvider} from 'react-router-dom'
import Layout from './pages/Layout'
import Home from './pages/Home';
import LoginPage from './pages/auth/LoginPage';
import { getResetMailAction, loginAction, resetPasswordAction, resetPasswordLoader, tokenLoginLoader } from './pages/actions & loaders/auth';
import CreateEstatePage from './pages/estate/CreateEstatePage';
import { createEstateAction, deleteEstateLoader, editEstateAction, editEstateLoader, getEstatesAction, getLocationLoader } from './pages/actions & loaders/estate';
import DeleteEstatePage from './pages/estate/DeleteEstatePage';
import MapPage from './pages/estate/MapPage';
import ResetMailPage from './pages/auth/ResetMailPage';
import PasswordResetPage from './pages/auth/PasswordResetPage';
import { protectedRouteLoader, unprotectedRouteLoader } from './pages/actions & loaders/routeProtection';
import ErrorPage from './pages/error/ErrorPage';

const router = createBrowserRouter([
    {path: '/', element: <Layout />, errorElement: <ErrorPage />, children: [
        {path: '/', element: <Home />, loader: tokenLoginLoader, action: getEstatesAction, children: [
            {path: "/login", element: <LoginPage />, loader: unprotectedRouteLoader, action: loginAction},
            {path: "/get-reset-mail", element: <ResetMailPage />, loader: unprotectedRouteLoader, action: getResetMailAction},
            {path: "/reset-password", element: <PasswordResetPage />, loader: resetPasswordLoader, action: resetPasswordAction},
            {path: "/create", element: <CreateEstatePage />, loader: protectedRouteLoader, action: createEstateAction },
            {path: "/edit/:estateId", element: <CreateEstatePage />, loader: editEstateLoader, action: editEstateAction},
            {path: "/delete/:estateId", element: <DeleteEstatePage />, loader: deleteEstateLoader},
            {path: "/map/:estateId", element: <MapPage />, loader: getLocationLoader},
        ]}
    ]}
])

const App = () => <RouterProvider router={router} />;

export default App;