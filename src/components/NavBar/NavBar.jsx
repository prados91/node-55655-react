import { useContext, useEffect, useState } from "react";
import { Link, } from "react-router-dom";
import navLogo1 from '../../images/logoBasketStoreWhite.svg'
import axios from "axios";
import Swal from 'sweetalert2';

import ShoppingCartTwoToneIcon from '@mui/icons-material/ShoppingCartTwoTone';
import Badge from '@mui/material/Badge';
import Stack from '@mui/material/Stack';
import MailIcon from '@mui/icons-material/Mail';

import { ProductContext } from "../../context/ProductContext";
import { CartContext } from "../../context/CartContext";

import './NavBar.css'

const NavBar = () => {

    axios.defaults.withCredentials = true;

    const [navbarblur, setnavbarblur] = useState(false);
    const [user, setUser] = useState(false)
    const [admin, setAdmin] = useState(false)
    const [prem, setPrem] = useState(false)
    const [role, setRole] = useState("")
    const [uid, setUserId] = useState("")
    const [total, setTotal] = useState(0)

    const { setHome } = useContext(ProductContext)
    const { cart } = useContext(CartContext)

    const readCart = async () => {
        try {
            setTotal(0)
            const totalQuantity = await cart.reduce((accumulator, currentItem) => {
                return accumulator + currentItem.quantity;
            }, 0);
            setTotal(totalQuantity)
        } catch (error) {
            Swal.fire({
                title: `${error.message}`,
                icon: "error",
                text: "Please, try again in a while.",
                timer: 50000,
                timerProgressBar: true,
            }).then(() => {
                location.replace('/')
            });
        }
    }

    const verify = async () => {
        try {
            let cookie = document.cookie.split("; ")
            cookie = cookie.find(each => each.split("=")[0] === "token")
            const res = await axios.post("https://coderbasketstore.up.railway.app/api/sessions/me", cookie)
            if (res.data.statusCode === 200) {
                const user = res.data.response
                setUserId(user._id)
                if (user.role === "ADMIN") {
                    setAdmin(true)
                    setRole("ADMIN")
                } else {
                    if (user.role === "PREM") {
                        setPrem(true)
                        setRole("PREM")
                    } else {
                        if (user.role === "USER") {
                            setUser(true)
                            setRole("USER")
                        }
                        else {
                            setAdmin(false)
                            setPrem(false)
                            setUser(false)
                            setRole("")
                            setUserId("")
                        }
                    }
                }
            } else {
                setAdmin(false)
                setPrem(false)
                setUser(false)
                setRole("")
                setUserId("")
            }
        } catch (error) {
            Swal.fire({
                title: `${error.message}`,
                icon: "error",
                text: "Please, try again in a while.",
                timer: 50000,
                timerProgressBar: true,
            }).then(() => {
                location.replace('*')
            });
        }
    }

    const showMenu = () => {
        var bar = document.getElementsByClassName("bar");
        var ham = document.getElementsByClassName("NavbarLinks");
        bar[0].classList.toggle("barOne");
        bar[1].classList.toggle("barTwo");
        bar[2].classList.toggle("barThree");
        ham[0].classList.toggle("showNavbar");
    };

    const hideMenu = () => {
        var bar = document.getElementsByClassName("bar");
        var ham = document.getElementsByClassName("NavbarLinks");
        bar[0].classList.remove("barOne");
        bar[1].classList.remove("barTwo");
        bar[2].classList.remove("barThree");
        ham[0].classList.remove("showNavbar");
    };

    const submitLogOut = async () => {
        try {
            hideMenu()
            let cookie = document.cookie.split("; ")
            cookie = cookie.find(each => each.split("=")[0] === "token")
            const res = await axios.post("https://coderbasketstore.up.railway.app/api/sessions/signout", cookie)
            if (res.data.statusCode === 200) {
                setAdmin(false)
                setUser(false)
                setPrem(false)
                setRole("")
                localStorage.removeItem("token");
                Swal.fire({
                    title: "GOOD BYE!",
                    icon: "success",
                    confirmButtonColor: "#3085d6",
                    confirmButtonText: "OK",
                }).then((result) => {
                    if (result.isConfirmed) {
                        location.replace("/");
                    }
                });
            }
        } catch (error) {
            Swal.fire({
                title: `${error.message}`,
                icon: "error",
                text: "Please, try again in a while.", timer: 50000, timerProgressBar: true,
            }).then(() => {
                location.replace('/')
            });
        }
    }

    function scrollHandler() {
        if (window.scrollY >= 20) {
            setnavbarblur(true);
        } else {
            setnavbarblur(false);
        }
    }
    window.addEventListener("scroll", scrollHandler);

    useEffect(() => {
        verify()
    }, [user, admin, prem])

    useEffect(() => {
        readCart()
    }, [cart])


    return (
        <nav className={navbarblur ? "Navbar blur" : "Navbar"}>
            <Link to="/" onClick={() => setHome(true)}>
                <img src={navLogo1} alt="Logo de la tienda" className={navbarblur ? "navbar_logo blur_img" : "navbar_logo"} />
            </Link>

            <div className="Hamburger" onClick={showMenu}>
                <span className="bar"></span>
                <span className="bar"></span>
                <span className="bar"></span>
            </div>
            <ul className="NavbarLinks">
                <li onClick={hideMenu}>
                    <Link to="/">Home</Link>
                </li>
                {(admin || prem) && <li onClick={hideMenu}>
                    <Link to="/form">Form</Link>
                </li>}
                {(prem) && <li onClick={hideMenu}>
                    <Link to="/myProducts">My Products</Link>
                </li>}
                {(user || prem) && <li onClick={hideMenu}>
                    <Link to="/cart">
                        My Cart
                        <span>
                            <Stack spacing={2} direction="row">
                                <Badge badgeContent={total > 0 ? total : "0"} color="error">
                                    <ShoppingCartTwoToneIcon />
                                </Badge>
                            </Stack>
                        </span>
                    </Link>
                </li>}
                {(!admin && !user && !prem) && <li onClick={hideMenu}>
                    <Link to="/register">Register</Link>
                </li>}
                {(admin || prem || user) && <li onClick={hideMenu}>
                    <Link to={`/user/${uid}`}>Profile</Link>
                </li>}
                {role === "" ?
                    <li onClick={hideMenu}>
                        <Link to="/login">Login</Link>
                    </li> :
                    <li >
                        <Link onClick={submitLogOut}>SignOut</Link>
                    </li>
                }
            </ul>
        </nav >
    );

}
export default NavBar


