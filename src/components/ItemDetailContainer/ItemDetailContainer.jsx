import React from 'react'
import { useEffect, useState } from "react";
import ItemDetail from '../ItemDetail/ItemDetail'
import axios from 'axios';
import Loading from '../Loading/Loading'
import { getFirestore, getDoc, doc } from "firebase/firestore";

import './ItemDetailContainer.css'
import { useParams } from 'react-router-dom';

const ItemDetailContainer = () => {

    const [products, setProduct] = useState([])
    const [load, setLoad] = useState(true)
    const { pid } = useParams()

    const API_LINK = "http://localhost:8080/api/products"

    useEffect(() => {
        setLoad(true)
        axios(API_LINK)
            .then((res) => {
                console.log(res.data.response);
                setProduct(res.data.response.docs);
                setLoad(false)
            })
            .catch((err) => console.log(err));
    }, [pid]);

    const result = products.find(p => p._id === pid)

    return (
        <div className='itemDetailContainer__container'>
            {load ? (<Loading />) : <ItemDetail products={result} />}
        </div>
    )
}

export default ItemDetailContainer