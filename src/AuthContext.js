import React, { createContext, useState} from "react";

// 帳號共享組件
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // 登入
    const handleLogin = () => {
        setIsLoggedIn(true);
    };

    // 登出
    const handleLogout = () => {
        setIsLoggedIn(false);
        localStorage.removeItem("accessToken");
        window.location.href = "/build";
    };

    return(
        <AuthContext.Provider value={{ isLoggedIn, handleLogin, handleLogout}}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;