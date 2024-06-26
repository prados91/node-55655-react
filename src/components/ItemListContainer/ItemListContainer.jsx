import { useState, useEffect, useContext } from 'react'
import ItemList from '../ItemList/ItemList'
import Loading from '../Loading/Loading'
import axios from 'axios'
import PageCount from '../PageCount/PageCount'

import Filter from '../Filter/Filter'

import { ProductContext } from '../../context/ProductContext'
import Swal from 'sweetalert2'

import './ItemListContainer.css'
const ItemListContainer = () => {

    axios.defaults.withCredentials = true;

    const [products, setProducts] = useState([])
    const [totalPages, setTotalPages] = useState(1)
    const [load, setLoad] = useState(true)
    const [page, setPage] = useState(1);
    const [title, setTitle] = useState("")
    const { home, setHome } = useContext(ProductContext)


    const fetchProducts = async () => {
        setLoad(true);
        try {
            const API_LINK = `https://coderbasketstore.up.railway.app/api/products/?title=${title}&page=${page}`
            const res = await axios.get(API_LINK);
            if (res.data.statusCode === 200) {
                setProducts(() => [...res.data.response.docs]);
                setTotalPages(res.data.response.totalPages);
                setLoad(false);
            } else {
                setProducts([])
                setLoad(false)
            }
        } catch (error) {
            Swal.fire({
                title: `${error.message}`,
                icon: "error",
                text: "Please, try again in a while.",
                timer: 50000,
                timerProgressBar: true,
            })
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
