import "./index.css";

import { BrowserRouter, useNavigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import AppRoutes from "./routes/AppRoutes";
import { useEffect } from "react";
import { setNavigate } from "./api/axiosInstance";

const Wrapper = () => {
    const navigate = useNavigate();

    useEffect(() => {
        setNavigate(navigate);
    }, []);

    return (
        <>
            <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
            <AppRoutes />
        </>
    )
}


const App = () => (
    <>
        <BrowserRouter>
            <Wrapper />
        </BrowserRouter>
    </>
);

export default App;
