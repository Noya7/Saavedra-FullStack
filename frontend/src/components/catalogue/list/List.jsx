import { useCallback, useEffect, useRef, useState } from "react";
import Item from "./Item";
import { useDispatch, useSelector } from "react-redux";
import { getEstatesAsync, loadNextPageAsync } from "../../../context/estate.thunks";
import Button from "../../layout/button/Button";

import classes from './List.module.css'

const List = () =>{
    const [isOpen, setIsOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1)
    const searchState = useSelector(store => store.estate);
    const dispatch = useDispatch();
    let items = searchState.results;

    useEffect(() => {!searchState.results && setCurrentPage(1); (searchState.results && !isOpen) && setIsOpen(true)}, [searchState.results]);

    const observer = useRef();
    const lastEntryRef = useCallback(node => {
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if(entries[0].isIntersecting && currentPage < searchState.pages){
                !searchState.isLoading && setCurrentPage(prev => prev + 1);
            }
        })
        if (node) observer.current.observe(node)
    }, [searchState, currentPage]);

    const catalogueHandler = () =>{
        dispatch(getEstatesAsync(''));
        setIsOpen(true)
    }

    const mappedItems = !!items && items.map((item, index) => <Item ref={items.length === index + 1 ? lastEntryRef : null} key={`${item._id}_${index}`} data={item} />)

    useEffect(()=>{currentPage > 1 && dispatch(loadNextPageAsync(currentPage))}, [currentPage])

    return (
        isOpen ? (
        <ul className={classes.listMain}>
            {mappedItems || <p className={classes.error}>No hay propiedades para mostrar.</p>}
        </ul>
        ) : (
        <div className={classes.closedMain}>
            <h1>Encontrá tu próximo hogar</h1>
            <p>Las mejores propiedades al mejor precio.</p>
            <Button onClick={catalogueHandler}>Cátalogo</Button>
        </div>
        )
    )
}

export default List;