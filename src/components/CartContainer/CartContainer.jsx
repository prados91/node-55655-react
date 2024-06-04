import { useState, useContext, useEffect } from "react"
import { Link } from "react-router-dom";
import { CartContext } from '../../context/CartContext'
import CartItem from '../CartItem/CartItem'
import Loading from "../Loading/Loading";

import './CartContainer.css'
import CartCards from "../CartCards/CartCards";

const CartContainer = () => {


    const [isLoading, setIsLoading] = useState(false)

    const { readCart } = useContext(CartContext);

    const render = async () => {
        setIsLoading(false)
        try {
            const state = await readCart()
            if (state && !isLoading) {
                setIsLoading(true)
            } else {
                setIsLoading(false)
            }
        } catch (error) {
            Swal.fire({
                title: `${error.message}`,
                icon: "error",
                text: "Please, try again in a while.",
            }).then(() => {
                setIsLoading(false)
                location.replace('/')
            });
        }
    }
    useEffect(() => {
        render()
    }, []);

    return (
        <>
            {!isLoading ? <Loading /> : <CartCards />}
        </>

    )
}

export default CartContainer

