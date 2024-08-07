import { Outlet, useLoaderData, useLocation } from 'react-router-dom';
import SearchBar from '../components/catalogue/searchBar/SearchBar';
import List from '../components/catalogue/list/List';

import classes from './Home.module.css'
import { toast } from 'react-toastify';
import { useEffect, useRef } from 'react';

const Home = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const errorData = queryParams.get('err');
    const toastShown = useRef(false);
    useEffect(()=> {(errorData && !toastShown.current) && toast.error(errorData) && (toastShown.current = true)}, [])
    return(
    <>
        <Outlet />
        <div className={classes.main}>
            <SearchBar />
            <List />
        </div>
    </>)
}

export default Home;