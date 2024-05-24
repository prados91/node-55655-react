import { createContext, useState } from "react";
import axios from "axios";

export const UserContext = createContext([]);

export const UserProvider = ({ children }) => {

    const API_USER = "http://localhost:8080/api/sessions/me"

    const verifyUser = async () => {
        let cookie = document.cookie.split("; ")
        cookie = cookie.find(each => each.split("=")[0] === "token")
        const res = await axios.post(API_USER, cookie)
        return res.data.response
    }

    return (
        <UserContext.Provider value={{ verifyUser }}>
            {children}
        </UserContext.Provider>
    );

}

export default UserProvider;