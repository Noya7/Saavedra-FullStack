import { useEffect, useState } from "react"
import TextInput from "../../input/TextInput"
import { Form, useActionData, useLoaderData, useNavigate, useSubmit } from "react-router-dom";
import useResponseToast from '../../../../hooks/useResponseToast'
import Button from "../../../layout/button/Button";
import ImageInput from "../../input/ImageInput";

import classes from './CreateEstateForm.module.css'

const initialFields = {
    title: false,
    location: false,
    secondLocation: true,
    price: false,
    expenses: false,
    tags: false,
}

const CreateEstateForm = () => {
    const [formIsValid, setFormIsValid] = useState(false);
    const [fieldValidation, setFieldValidation] = useState(initialFields);
    const [isEditMode, setIsEditMode] = useState(false);
    const response = useActionData();
    const editData = useLoaderData();

    useEffect(() => {
        if (editData) {
            setIsEditMode(true);
            const initialValidation = {};
            Object.keys(initialFields).forEach(key => {
              initialValidation[key] = !!editData[key];
            });
            setFieldValidation(initialValidation);
        }
    }, [editData]);

    const handleFieldValidation = (fieldName, isValid) => {
        setFieldValidation(prev => ({ ...prev, [fieldName]: isValid, }) );
    };

    useEffect(() => {
        if (isEditMode) {
          const allFieldsValid = Object.values(fieldValidation).every(field => field);
          setFormIsValid(allFieldsValid);
        } else {
          const allRequiredFieldsValid = Object.entries(fieldValidation).every(([key, value]) => {
            return initialFields[key] === false || value === true;
          });
          setFormIsValid(allRequiredFieldsValid);
        }
    }, [fieldValidation, isEditMode]);

    useResponseToast(response)
    return(
        <Form method="post" encType="multipart/form-data" className={classes.main}>
            <h1>Crear nueva propiedad</h1>
            <ImageInput required={!editData} />
            <div className={classes.inputs}>
                <TextInput value={editData?.title} type='title' name='title' onValidation={valid => handleFieldValidation('title', valid)} placeholder='título' />
                <TextInput value={editData?.location} type='location' name='location' onValidation={valid => handleFieldValidation('location', valid)} placeholder='ubicación' />
                <TextInput value={editData?.secondLocation} notRequired={true} type='secondLocation' name='secondLocation' onValidation={valid => handleFieldValidation('secondLocation', valid)} placeholder='ubicación secundaria' />
                <span className={classes.options}>
                    <select required={!editData} name='type'>
                        <option value='house'>Casa</option>
                        <option value='apartament'>Departamento</option>
                    </select>
                    <select required={!editData} name='rooms'>
                        <option>1</option>
                        <option>2</option>
                        <option>3</option>
                        <option>4</option>
                    </select>
                </span>
                <span className={classes.options}>
                    <TextInput value={editData?.price} type='price' name='price' onValidation={valid => handleFieldValidation('price', valid)} placeholder='precio' />
                    <TextInput value={editData?.expenses} type='expenses' name='expenses' onValidation={valid => handleFieldValidation('expenses', valid)} placeholder='expensas' />
                </span>
                <TextInput value={editData?.tags} type='tags' name='tags' onValidation={valid => handleFieldValidation('tags', valid)} placeholder='tags' />
                <Button disabled={!formIsValid}>Publicar</Button>
            </div>
        </Form>
    )
}

export default CreateEstateForm;