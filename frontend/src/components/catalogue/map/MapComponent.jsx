import { useLoaderData } from 'react-router-dom';
import classes from './MapComponent.module.css'

export default () => {
    const address = useLoaderData()
    const encodedAddress = encodeURIComponent(address);
    return (
      <iframe
        title="mapa"
        className={classes.main}
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        src={`https://www.google.com/maps/embed/v1/place?key=${import.meta.env.VITE_MAPS_KEY}&q=${encodedAddress}`}
      ></iframe>
    );
}