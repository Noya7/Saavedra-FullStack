import { FaTimes } from 'react-icons/fa';
import classes from './ImageItem.module.css';

export default ({ image, onRemove, index }) => {
    return (
        <div className={classes.imageContainer} onClick={() => onRemove(index)}>
            <img src={image} alt={`Selected ${index}`} className={classes.image} />
            <div className={classes.removeIcon}> <FaTimes /> </div>
        </div>
    );
};
