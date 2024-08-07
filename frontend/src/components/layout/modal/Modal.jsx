import { FaTimes } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

import classes from './Modal.module.css'

const Modal = ({children, onClose, showClose=true}) => {
    const navigate = useNavigate()

    const modalClickHandler = event => event.stopPropagation();

    const closeHandler = () => onClose ? onClose() : navigate('../');

    return(
        <div onClick={closeHandler} className={classes.backdrop}>
            <dialog open onClick={modalClickHandler} className={classes.modal}>
            {showClose && <button onClick={closeHandler} className={classes.close}><FaTimes  className={classes.closeContent}/></button>}
                {children}
            </dialog>
        </div>
    )
}

export default Modal;