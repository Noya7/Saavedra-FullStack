import { Form } from "react-router-dom"
import Button from "../../layout/button/Button"

import classes from './SearchBar.module.css'

const SearchBar = () => {
    return(
    <Form method="post" className={classes.main}>
        <input type="text" name="query" placeholder='Buscar calles, zonas, lugares'/>
        <span className={classes.options}>
            <select name="type" defaultValue="">
                <option value="" disabled hidden>Tipo</option>
                <option value="">Todos</option>
                <option value="house">Casa</option>
                <option value="apartament">Depto.</option>
            </select>
            <select name="rooms" defaultValue="">
                <option value="" disabled hidden>Habitaciones</option>
                <option value="">Todas</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
            </select>
        </span>
        <Button>Buscar</Button>
    </Form>
    )
}

export default SearchBar;