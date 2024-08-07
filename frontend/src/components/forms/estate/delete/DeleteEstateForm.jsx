import classes from './DeleteEstateForm.module.css'
import Button from "../../../layout/button/Button"
import { useLoaderData } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { deleteEstateAsync } from '../../../../context/estate.thunks'
import { useState } from 'react'
import useResponseToast from '../../../../hooks/useResponseToast'

export default () => {
    const [response, setResponse] = useState(null)
    const dispatch = useDispatch();
    const estateId = useLoaderData();
    const deleteHandler = async () => {
        let responseData = await dispatch(deleteEstateAsync(estateId));
        setResponse(prev => responseData);
    }
    useResponseToast(response)

    return(
        <div className={classes.main} >
            <h1>Eliminar propiedad</h1>
            <p>Cuidado, esta accion es irreversible.</p>
            <Button onClick={deleteHandler}>eliminar</Button>
        </div>
    )
}