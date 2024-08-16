import { Outlet, useLocation } from 'react-router-dom';
import SearchBar from '../components/catalogue/searchBar/SearchBar';
import List from '../components/catalogue/list/List';

import classes from './Home.module.css'
import { toast } from 'react-toastify';
import { useEffect, useRef, useState } from 'react';
import BootModal from '../components/boot/BootModal';
import Cookies from 'js-cookie'
import { useDispatch, useSelector } from 'react-redux';
import { tokenLoginAsync } from '../context/auth.thunks';

const Home = () => {
    const [serverIsUp, setServerIsUp] = useState(true)
    const location = useLocation();
    const dispatch = useDispatch();
    const queryParams = new URLSearchParams(location.search);
    const errorData = queryParams.get('err');
    const toastShown = useRef(false);
    const tokenVerified = useSelector(state => state.auth.tokenVerified);

    useEffect(()=>{
        const tokenLoginLoader = async () => {
            if (tokenVerified) return null;
            await dispatch(tokenLoginAsync());
            return;
        }
        tokenLoginLoader();
    }, [])

    useEffect(()=> {(errorData && !toastShown.current) && toast.error(errorData) && (toastShown.current = true)}, [])

    useEffect(() => {
        const serverCheck = async () => {
            try {
                let response = await fetch(import.meta.env.VITE_BACKEND_URL + '/boot');
                Cookies.set("isServerUp", response.ok, {expires: 0.5})
                setServerIsUp(true);
            } catch (error) {
                toast.error('Ocurrió un error al intentar alcanzar el servidor. Por favor, reporta este error a mi correo electronico.');
                Cookies.set("isServerUp", false, {expires: 0.25})
            }
        };
        if (Cookies.get('isServerUp') !== 'true') setServerIsUp(false); serverCheck();
    }, []);

    return(
    <>
        <Outlet />
        {!serverIsUp && <BootModal />}
        <div className={classes.main}>
            <SearchBar />
            <List />
        </div>
    </>)
}

export default Home;