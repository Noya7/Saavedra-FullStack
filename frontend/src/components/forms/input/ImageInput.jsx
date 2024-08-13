import { useState, useEffect } from 'react';
import classes from './ImageInput.module.css';

const MAX_IMAGES = 5;
const MAX_WIDTH = 1024;
const QUALITY = 0.8;

const processImage = (file) => {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                let width = img.width;
                let height = img.height;

                if (width > MAX_WIDTH) {
                    height *= MAX_WIDTH / width;
                    width = MAX_WIDTH;
                }

                canvas.width = width;
                canvas.height = height;
                ctx.drawImage(img, 0, 0, width, height);

                canvas.toBlob((blob) => {
                    resolve({
                        file: new File([blob], file.name, { type: 'image/jpeg' }),
                        preview: canvas.toDataURL('image/jpeg')
                    });
                }, 'image/jpeg', QUALITY);
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    });
};

const ImageInput = ({ required }) => {
    const [images, setImages] = useState([]);
    const [processedImages, setProcessedImages] = useState([]);

    const handleImageChange = async (e) => {
        if (e.target.files.length) {
            const files = Array.from(e.target.files).slice(0, MAX_IMAGES);
            const processed = await Promise.all(files.map(processImage));
            setImages(processed.map(p => p.file));
            setProcessedImages(processed.map(p => p.preview));
        }
    };

    useEffect(() => {
        const updateFormData = () => {
            const formData = new FormData();
            images.forEach(file => {formData.append(`images`, file)});
        };
        updateFormData();
    }, [images]);

    return (
        <div className={classes.main}>
            <div className={classes.selection}>
                <label htmlFor='images'>Elige las imágenes (máximo {MAX_IMAGES}):</label>
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
                {processedImages.map((image, index) => (
                    <img key={index} src={image} alt={`Selected ${index}`} className={classes.image} />
                ))}
            </div>
        </div>
    );
};

export default ImageInput;