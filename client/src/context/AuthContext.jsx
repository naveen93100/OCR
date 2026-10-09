// import { createContext, useContext, useMemo, useState, useCallback } from "react";
// import { loginApi, logoutApi } from "../api/authApi";

// const AuthContext = createContext(null);
// const TOKEN_KEY = "access_token";

// const decodeJwt = (token) => {
//     try {
//         const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
//         return JSON.parse(atob(base64));
//     } catch {
//         return null;
//     }
// };

// // Returns the decoded user only if the token is valid and not expired
// const userFromToken = (token) => {
//     if (!token) return null;
//     const payload = decodeJwt(token);
//     if (!payload || (payload.exp && payload.exp * 1000 < Date.now())) return null;
//     return { userId: payload.userId, role: payload.role };
// };

// export const AuthProvider = ({ children }) => {
//     const [user, setUser] = useState(() =>
//         userFromToken(localStorage.getItem(TOKEN_KEY)),
//     );
//     const [loading, setLoading] = useState(false);

//     const login = useCallback(async (userId, password) => {
//         setLoading(true);
//         try {
//             const { data } = await loginApi(userId, password);

//             if (!data?.success || !data?.access_token) {
//                 throw new Error(data?.message || "Login failed");
//             }

//             const nextUser = userFromToken(data.access_token);
//             if (!nextUser) throw new Error("Invalid token received");

//             localStorage.setItem(TOKEN_KEY, data.access_token);
//             setUser(nextUser);
//             return data;
//         } finally {
//             setLoading(false);
//         }
//     }, []);

//     const logout = useCallback(async () => {
//         try {
//             await logoutApi();
//         } finally {
//             localStorage.removeItem(TOKEN_KEY);
//             setUser(null);
//         }
//     }, []);

//     const value = useMemo(
//         () => ({ user, loading, isAuthenticated: !!user, login, logout }),
//         [user, loading, login, logout],
//     );

//     return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };

// export const useAuth = () => {
//     const context = useContext(AuthContext);
//     if (!context) throw new Error("useAuth must be used inside AuthProvider");
//     return context;
// };

// import {
//     createContext,
//     useContext,
//     useMemo,
//     useState,
//     useCallback,
// } from "react";
// import { loginApi, logoutApi } from "../api/authApi";

// const AuthContext = createContext(null);
// const TOKEN_KEY = "access_token";

// const decodeJwt = (token) => {
//     try {
//         const base64 = token
//             .split(".")[1]
//             .replace(/-/g, "+")
//             .replace(/_/g, "/");
//         return JSON.parse(atob(base64));
//     } catch {
//         return null;
//     }
// };

// const normalizeRole = (role) => String(role || "").toLowerCase();

// // Returns the user only if the token is valid and not expired
// const userFromToken = (token) => {
//     if (!token) return null;
//     const payload = decodeJwt(token);
//     if (!payload || (payload.exp && payload.exp * 1000 < Date.now()))
//         return null;
//     return { userId: payload.userId, role: normalizeRole(payload.role) };
// };

// export const AuthProvider = ({ children }) => {
//     const [user, setUser] = useState(() =>
//         userFromToken(localStorage.getItem(TOKEN_KEY)),
//     );
//     const [loading, setLoading] = useState(false);

//     const login = useCallback(async (userId, password) => {
//         setLoading(true);
//         try {
//             const { data } = await loginApi(userId, password);

//             if (!data?.success || !data?.access_token) {
//                 throw new Error(data?.message || "Login failed");
//             }

//             const tokenUser = userFromToken(data.access_token);
//             if (!tokenUser) throw new Error("Invalid token received");

//             // prefer the user object from the API (has name, _id), fall back to token
//             const nextUser = data.user
//                 ? {
//                       ...data.user,
//                       role: normalizeRole(data.user.role || tokenUser.role),
//                   }
//                 : tokenUser;

//             localStorage.setItem(TOKEN_KEY, data.access_token);
//             setUser(nextUser);
//             return { ...data, user: nextUser };
//         } catch (er) {
//             alert(JSON.stringify(er));
//         } finally {
//             setLoading(false);
//         }
//     }, []);

//     const logout = useCallback(async () => {
//         try {
//             await logoutApi();
//         } finally {
//             localStorage.removeItem(TOKEN_KEY);
//             setUser(null);
//         }
//     }, []);

//     const value = useMemo(
//         () => ({
//             user,
//             loading,
//             setUser,
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
//     if (!context) throw new Error("useAuth must be used inside AuthProvider");
//     return context;
// };

import {
    createContext,
    useContext,
    useMemo,
    useState,
    useCallback,
} from "react";
import { loginApi, logoutApi } from "../api/authApi";

const AuthContext = createContext(null);
const TOKEN_KEY = "access_token";

const decodeJwt = (token) => {
    try {
        const base64 = token
            .split(".")[1]
            .replace(/-/g, "+")
            .replace(/_/g, "/");
        return JSON.parse(atob(base64));
    } catch {
        return null;
    }
};

const normalizeRole = (role) => String(role || "").toLowerCase();

// Returns the user only if the token is valid and not expired
const userFromToken = (token) => {
    if (!token) return null;
    const payload = decodeJwt(token);
    if (!payload || (payload.exp && payload.exp * 1000 < Date.now()))
        return null;
    return { userId: payload.userId, role: normalizeRole(payload.role) };
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() =>
        userFromToken(localStorage.getItem(TOKEN_KEY)),
    );
    const [loading, setLoading] = useState(false);

    // Throws on failure so the caller (Login page) can show the error
    const login = useCallback(async (userId, password) => {
        setLoading(true);
        try {
            const { data } = await loginApi(userId, password);

            if (!data?.success || !data?.access_token) {
                throw new Error(data?.message || "Login failed");
            }

            const tokenUser = userFromToken(data.access_token);
            if (!tokenUser) throw new Error("Invalid token received");

            const nextUser = {
                ...tokenUser,
                ...(data.user || {}),
                role: normalizeRole(data.user?.role || tokenUser.role),
            };

            localStorage.setItem(TOKEN_KEY, data.access_token);
            setUser(nextUser);
            return nextUser;
        } finally {
            setLoading(false);
        }
    }, []);

    const logout = useCallback(async () => {
        try {
            await logoutApi();
        } catch {
            // ignore – clear local session anyway
        } finally {
            localStorage.removeItem(TOKEN_KEY);
            setUser(null);
        }
    }, []);

    const value = useMemo(
        () => ({
            user,
            loading,
            isAuthenticated: !!user,
            login,
            logout,
        }),
        [user, loading, login, logout],
    );

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used inside AuthProvider");
    return context;
};
