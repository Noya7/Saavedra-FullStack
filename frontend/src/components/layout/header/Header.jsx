import { Link, useNavigate } from "react-router-dom"
import {FaPhone, FaInstagram, FaPlus} from 'react-icons/fa'
import Button from "../button/Button"
import { useEffect, useState } from "react"
import {useDispatch, useSelector} from 'react-redux'
import { logoutAsync } from "../../../context/auth.thunks"

import classes from './Header.module.css'

const Header = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const authState = useSelector(store => store.auth.userData)

    const authHandler = () => {isLoggedIn ? dispatch(logoutAsync()) : navigate('login')}

    useEffect(()=>{setIsLoggedIn(!!authState)}, [authState])
    return(
        <header className={classes.main}>
            <Link className={classes.title} to={'/'}>INMOBILIARIA SAAVEDRA</Link>
            {!isLoggedIn && <div className={classes.contact}>
                <a className={classes.contactSpan} href={`tel:+${import.meta.env.VITE_PHONE}`}>
                    <FaPhone className={classes.icon} />
                    <p>{`+${import.meta.env.VITE_PHONE}`}</p>
                </a>
                <a className={classes.contactSpan} target="blank" href={`https://www.instagram.com/${import.meta.env.VITE_IG_URL}`}>
                    <FaInstagram className={classes.icon} />
                    <p>{`${import.meta.env.VITE_IG}`}</p>
                </a>
            </div>}
            {isLoggedIn && <span className={classes.controls}>
                <Button onClick={()=>navigate('create')} > <FaPlus /> </Button>
                <Button onClick={authHandler}>Logout</Button>
            </span>}
        </header>
    )
}

export default Header;