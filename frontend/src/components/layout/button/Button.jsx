import classes from './Button.module.css'

const Button = ({children, onClick, type, disabled=false}) => <button disabled={disabled} type={type} className={classes.main} onClick={onClick}> {children} </button>

export default Button