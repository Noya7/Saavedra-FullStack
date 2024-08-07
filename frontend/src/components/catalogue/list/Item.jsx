import Slider from "../../layout/slider/Slider";
import { Link } from 'react-router-dom';
import classes from './Item.module.css'
import { forwardRef } from "react";
import ButtonsPanel from "./ButtonsPanel";

const Item = forwardRef(({data}, ref) => {
    return(
        <li ref={ref} className={classes.main}>
            <div className={classes.slider}>
                <Slider source={data.images} postId={data._id} />
            </div>
            <div className={classes.info}>
                <h1>{data.title}</h1>
                <span className={classes.location}>
                    <h2>{data.location}</h2>
                    <Link to={`/map/${data._id}`} >Ver en maps</Link>
                </span>
                <span className={classes.pricing}>
                    <h3>${data.price}</h3>
                    {data.expenses && <p>+ ${data.expenses} EXPENSAS</p>}
                </span>
                <ButtonsPanel estateId={data._id} rented={data.rented} estateTitle={data.title} estateLocation={data.location} />
            </div>
        </li>
    )
})

export default Item;