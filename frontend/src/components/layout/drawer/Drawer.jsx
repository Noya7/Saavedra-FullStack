import { useEffect, useRef, useState } from 'react'
import classes from './Drawer.module.css'

export default ({title, isOpen, onToggle, children}) => {
    const contentRef = useRef(null);
    const [contentHeight, setContentHeight] = useState(0);

    useEffect(() => contentRef.current && setContentHeight(contentRef.current.scrollHeight), [children]);

    return (
        <div className={classes.main}>
            <h2 onClick={onToggle}>{title}</h2>
            <div 
            className={`${classes.content} ${isOpen ? classes.open : ''}`}
            style={{ maxHeight: isOpen ? `${contentHeight}px` : '0' }}
            >
                <div ref={contentRef}>
                    {children}
                </div>
            </div>
        </div>
    );
}