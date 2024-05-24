import { useState, useEffect, useContext } from 'react'
import ItemList from '../ItemList/ItemList'
import Loading from '../Loading/Loading'
import axios from 'axios'
import PageCount from '../PageCount/PageCount'

import Filter from '../Filter/Filter'

import { ProductContext } from '../../context/ProductContext'
import { UserContext } from '../../context/UserContext'


import './ItemListContainer.css'
const ItemListContainer = () => {

    axios.defaults.withCredentials = true;

    const [products, setProducts] = useState([])
    const [totalPages, setTotalPages] = useState(1)
    const [load, setLoad] = useState(true)
    const [page, setPage] = useState(1);
    const [title, setTitle] = useState("")
    const { home, setHome } = useContext(ProductContext)

    const API_LINK = `http://localhost:8080/api/products/?title=${title}&page=${page}`

    const fetchProducts = async () => {
        setLoad(true);
        try {
            const res = await axios.get(API_LINK);
            setProducts(() => [...res.data.response.docs]);
            setTotalPages(res.data.response.totalPages);
            setLoad(false);
        } catch (err) {
            console.log(err);
            setLoad(false);
        }
    };

    useEffect(() => {
        if (home) {
            setPage(1);
            setTitle("");
            setHome(false);
        }
        fetchProducts();

    }, [home, page, title]);

    return (
        <div >
            {load ? (<Loading />) :
                (
                    <div className="container itemListContainer__container d-flex flex-column justify-content-center align-items-center">
                        <h1>Wellcome to Basketball | Store</h1>
                        <Filter setTitle={setTitle} />
                        <div>
                            <ItemList products={products} />
                        </div>
                        <div className="mt-auto">
                            <PageCount page={page} totalPages={totalPages} setPage={setPage} />
                        </div>
                    </div>
                )}
        </div>
    )
}

export default ItemListContainer
