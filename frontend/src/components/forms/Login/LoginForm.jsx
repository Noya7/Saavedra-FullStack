import { Form, Link, useActionData } from "react-router-dom";
import Button from "../../layout/button/Button";
import TextInput from "../input/TextInput";
import useResponseToast from '../../../hooks/useResponseToast'

import classes from './LoginForm.module.css'
import { useState } from "react";

const LoginForm = () => {
    const [formIsValid, setFormIsValid] = useState(false)
    const responseData = useActionData();
    useResponseToast(responseData)

    return (
      <Form method="post" className={classes.main}>
        <h1>Login</h1>
        <TextInput onValidation={(valid) => setFormIsValid(valid)} className={classes.input} name='email' type="email" placeholder="email" />
        <TextInput className={classes.input} name="password" type="password" placeholder="contraseña" />
        <Link to='/get-reset-mail'>Olvide mi contraseña</Link>
        <Button disabled={!formIsValid}>Enviar</Button>
      </Form>
    );
}

export default LoginForm;