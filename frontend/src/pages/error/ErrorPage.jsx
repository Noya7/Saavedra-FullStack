import { useNavigate, useRouteError } from "react-router-dom"
import Button from "../../components/layout/button/Button"
import Header from "../../components/layout/header/Header";

import classes from './ErrorPage.module.css'

export default () => {
    const errorData = useRouteError();
    const navigate = useNavigate();
    
    setTimeout(() => {navigate('/')}, 20000);

    return(
        <div className={classes.main}>
            <Header />
            <div className={classes.mainDiv}>
                <h1>Lo sentimos, ocurrió un error al cargar esta página</h1>
                <h2>Mensaje de error:</h2>
                <p className={classes.message}>{errorData.error.message}</p>
                <p className={classes.notice}>
                    serás redireccionado a la página de inicio en breve. O podes volver tocando el siguiente boton:
                </p>
                <Button onClick={()=>navigate('/')}>Volver a inicio</Button>
            </div>
        </div>
    )
}