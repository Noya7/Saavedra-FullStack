import { useCallback, useEffect, useState } from 'react';
import classes from './Slider.module.css'

const Slider = ({ source, postId }) => {
    const [currentSlide, setCurrentSlide] = useState(0);

    const images = source.map((image, index) => <img key={`${postId}_${index}`} className={classes.image} src={image}/>)

    const slideHandler = useCallback(value =>{
      if(value === 'next') setCurrentSlide((prevSlide) => (prevSlide + 1) % images.length);
      else setCurrentSlide((prevSlide) => (prevSlide - 1 + images.length) % images.length);
    }, [images.length])
  
    return (
        <div className={classes.main}>
            <div className={classes.slides} style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
                {images}
            </div>
            {images.length > 1 && <span className={classes.buttons}>
                <button onClick={() => slideHandler('prev')}>{`<`}</button>
                <button onClick={() => slideHandler('next')}>{`>`}</button>
            </span>}
      </div>
    );
};
  
export default Slider;