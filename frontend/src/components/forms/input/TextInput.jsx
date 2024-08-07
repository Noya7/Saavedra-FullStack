import { useEffect, useState } from 'react'
import classes from './TextInput.module.css'

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const dniRegex = /^[0-9]{8}$/
const passwordRegex = /^(?=.*[a-zA-ZñÑ])(?=.*\d)(?=.*[@$!%*?&])[A-Za-zñÑ\d@$!%*?&]{8,32}$/

const validate = (value, type) => {
  switch (type) {
    case 'text': return value.trim().length > 3 && value.trim().length <= 32;
    case 'email': return emailRegex.test(value);
    case 'signup_password': return passwordRegex.test(value);
    case 'title': return value.trim().length > 3 && value.trim().length <= 64;
    case 'location': return value.trim().length > 3 && value.trim().length <= 64;
    case 'second_location': return value.trim().length <= 64;
    case 'price': return !isNaN(value) && +value > 0;
    case 'expenses': return !isNaN(value) && +value >= 0; 
    case 'tags': return value.trim().length > 3 && value.trim().length <= 64;
    default: return true;
  }
};

const TextInput = ({ name, type, placeholder, onValidation, value, readOnly, notRequired }) => {
  const [fieldIsValid, setFieldIsValid] = useState(false);
  const [fieldWasTouched, setFieldWasTouched] = useState(false);

  const changeHandler = (e) => setFieldIsValid(validate(e.target.value, type));
  
  useEffect(() => onValidation && onValidation(fieldIsValid), [fieldIsValid])
  return (
    <input
      autoComplete='on'
      required = {!notRequired}
      name={name}
      className={`${classes.input} ${fieldWasTouched && !fieldIsValid ? classes.invalid : ''}`}
      type={type === 'signup_password' ? 'password' : type ==='DNI' ? 'number' : type}
      placeholder={placeholder}
      onBlur={(e)=>setFieldWasTouched(e.target.value.trim().length > 3)}
      onChange={changeHandler}
      defaultValue={value || ''}
      readOnly={readOnly}
    />
  );
};

export default TextInput;