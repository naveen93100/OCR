// import {
//     createContext,
//     useContext,
//     useMemo,
//     useState,
//     useCallback,
// } from "react";

// import { loginApi, logoutApi } from "../api/authApi";

// const AuthContext = createContext(null);

// export const AuthProvider = ({ children }) => {
//     const [user, setUser] = useState(null);
//     const [loading, setLoading] = useState(false);

//     const login = useCallback(async (userId, password) => {
//         setLoading(true);

//         try {
//             console.log("Logging in with userId:", userId, "and password:", password);
//             console.log("Calling the api....")
//             const { data } = await loginApi(userId, password);

//             setUser(data.user);

//             return data;
//         } finally {
//             setLoading(false);
//         }
//     }, []);

//     const logout = useCallback(async () => {
//         try {
//             await logoutApi();
//         } finally {
//             setUser(null);
//         }
//     }, []);

//     const value = useMemo(
//         () => ({
//             user,
//             loading,
//             isAuthenticated: !!user,
//             login,
//             logout,
//         }),
//         [user, loading, login, logout],
//     );

//     return (
//         <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
//     );
// };

// export const useAuth = () => {
//     const context = useContext(AuthContext);

//     if (!context) {
//         throw new Error("useAuth must be used inside AuthProvider");
//     }

//     return context;
// };






import { createContext, useContext, useMemo, useState, useCallback } from "react";
import { loginApi, logoutApi } from "../api/authApi";

const AuthContext = createContext(null);
const TOKEN_KEY = "access_token";

const decodeJwt = (token) => {
    try {
        const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
        return JSON.parse(atob(base64));
    } catch {
        return null;
    }
};

// Returns the decoded user only if the token is valid and not expired
const userFromToken = (token) => {
    if (!token) return null;
    const payload = decodeJwt(token);
    if (!payload || (payload.exp && payload.exp * 1000 < Date.now())) return null;
    return { userId: payload.userId, role: payload.role };
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() =>
        userFromToken(localStorage.getItem(TOKEN_KEY)),
    );
    const [loading, setLoading] = useState(false);

    const login = useCallback(async (userId, password) => {
        setLoading(true);
        try {
            const { data } = await loginApi(userId, password);

            if (!data?.success || !data?.access_token) {
                throw new Error(data?.message || "Login failed");
            }

            const nextUser = userFromToken(data.access_token);
            if (!nextUser) throw new Error("Invalid token received");

            localStorage.setItem(TOKEN_KEY, data.access_token);
            setUser(nextUser);
            return data;
        } finally {
            setLoading(false);
        }
    }, []);

    const logout = useCallback(async () => {
        try {
            await logoutApi();
        } finally {
            localStorage.removeItem(TOKEN_KEY);
            setUser(null);
        }
    }, []);

    const value = useMemo(
        () => ({ user, loading, isAuthenticated: !!user, login, logout }),
        [user, loading, login, logout],
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used inside AuthProvider");
    return context;
};