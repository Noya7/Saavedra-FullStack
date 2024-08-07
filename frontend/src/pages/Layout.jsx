import { Outlet } from "react-router-dom";
import Header from "../components/layout/header/Header";

import classes from './Layout.module.css'

const Layout = () => <div className={classes.main}> <Header /><Outlet /> </div>

export default Layout;