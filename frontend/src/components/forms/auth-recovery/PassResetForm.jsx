import { Form, useActionData } from 'react-router-dom'
import classes from './PassResetForm.module.css'
import TextInput from '../input/TextInput'
import { useState } from 'react'
import Button from '../../layout/button/Button'
import useResponseToast from '../../../hooks/useResponseToast'

export default () => {
    const [formIsValid, setFormIsValid] = useState(false)
    const responseData = useActionData();
    useResponseToast(responseData)
    return(
        <Form method='post' className={classes.main}>
            <h1>Restablecer Contraseña</h1>
            <p>Tu nueva contraseña debe contener:</p>
            <ul>
                <li><p>Entre 6 y 32 caracteres.</p></li>
                <li><p>1 mayuscula.</p></li>
                <li><p>1 número.</p></li>
                <li><p>1 símbolo.</p></li>
            </ul>
            <TextInput name='password' type='signup_password' placeholder='Nueva Contraseña' onValidation={valid => setFormIsValid(valid)} />
            <Button disabled={!formIsValid}>Aplicar</Button>
        </Form>
    )
}