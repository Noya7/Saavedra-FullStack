import Modal from '../layout/modal/Modal'
import { FaPhone, FaInstagram, FaSpinner } from 'react-icons/fa';

import classes from './BootModal.module.css'

export default () => {
    return(
        <Modal showClose={false}>
            <div className={classes.main}>
                <h1>INMOBILIARIA SAAVEDRA</h1>
                <p>¡Bienvenido! Cargando detalles de propiedades. Esto puede tardar un minuto</p>
                <FaSpinner className={classes.spinner} />
                <span className={classes.contact}>
                    <a className={classes.contactSpan} href={`tel:+${import.meta.env.VITE_PHONE}`}>
                        <FaPhone className={classes.icon} />
                        <p>{`+${import.meta.env.VITE_PHONE}`}</p>
                    </a>
                    <a className={classes.contactSpan} target="blank" href={`https://www.instagram.com/${import.meta.env.VITE_IG_URL}`}>
                        <FaInstagram className={classes.icon} />
                        <p>{`${import.meta.env.VITE_IG}`}</p>
                    </a>
                </span>
            </div>
        </Modal>
    )
}