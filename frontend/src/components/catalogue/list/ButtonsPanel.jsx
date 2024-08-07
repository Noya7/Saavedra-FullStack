import { useDispatch, useSelector } from 'react-redux';
import { archiveEstateAsync } from '../../../context/estate.thunks';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../layout/button/Button';

import classes from './ButtonsPanel.module.css'

const getWhatsAppURL = (title, location) => {
    const message =
    `Buenos dias Inmobiliaria Saavedra, te hablo para consultarte mas informacion acerca de la publicacion "${title}",
    ubicada en ${location}.\nMuchas gracias!`
    const encodedMessage = encodeURIComponent(message);
    return `https://api.whatsapp.com/send?phone=${import.meta.env.VITE_PHONE}&text=${encodedMessage}`;
};

export default ({estateId, rented, estateTitle, estateLocation}) => {
    const [isArchived, setIsArchived] = useState(rented);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isAdmin = useSelector(store => !!store.auth.userData);
    const archiveHandler = () => {
        dispatch(archiveEstateAsync({estateId, rented: !isArchived}));
    }
    const whatsAppHandler = () => {
        const url = getWhatsAppURL(estateTitle, estateLocation);
        window.open(url, '_blank', 'noopener,noreferrer');
    }
    useEffect(()=>setIsArchived(prev => rented), [rented])

    return(
        <span className={classes.buttons}>
            {!isAdmin ? <Button onClick={whatsAppHandler}>Consultar mas info. por WhatsApp</Button> :
            <>
                <Button onClick={()=>navigate(`/edit/${estateId}`)}>Editar</Button>
                <Button onClick={archiveHandler}>{isArchived ? `Publicar` : `Archivar`}</Button>
                <Button onClick={()=>navigate(`/delete/${estateId}`)}>Eliminar</Button>
            </>}
        </span>
    )
}