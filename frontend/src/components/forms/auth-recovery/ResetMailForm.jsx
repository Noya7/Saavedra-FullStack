import {Form, useActionData} from 'react-router-dom'
import Button from '../../layout/button/Button';
import TextInput from '../input/TextInput'
import { useState } from 'react';

import classes from './ResetMailForm.module.css'
import useResponseToast from '../../../hooks/useResponseToast';

export default () => {
    const [formIsValid, setFormIsValid] = useState(false);
    const responseData = useActionData();
    useResponseToast(responseData)
    return(
        <Form method='post' className={classes.main}>
            <h1>Recuperar contraseña</h1>
            <p>Ingresa la direccion de email de la cuenta asociada:</p>
            <span className={classes.input}>
                <TextInput name='email' type='email' placeholder='email' onValidation={valid => setFormIsValid(valid)} />
                <Button disabled={!formIsValid} >Enviar</Button>
            </span>
        </Form>
    )
}