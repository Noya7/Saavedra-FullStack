import { useState } from 'react';
import classes from './ImageInput.module.css';

const ImageInput = ({required}) => {
    const [images, setImages] = useState([]);

    const handleImageChange = (e) => {
        if (e.target.files.length) {
            const files = Array.from(e.target.files);
            const imageUrls = files.map(file => URL.createObjectURL(file));
            setImages(imageUrls);
        }
    };

    return (
        <div className={classes.main}>
            <div className={classes.selection}>
                <label htmlFor='images'>Elige las imágenes:</label>
                <input 
                    required={required} 
                    type='file' 
                    name='images' 
                    id='images' 
                    onChange={handleImageChange} 
                    accept='image/jpeg, image/jpg, image/png' 
                    multiple 
                />
            </div>
            <div className={classes.images}>
                {images.map((image, index) => (
                    <img key={index} src={image} alt={`Selected ${index}`} className={classes.image} />
                ))}
            </div>
        </div>
    );
};

export default ImageInput;
