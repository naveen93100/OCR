// import { useState } from "react";
// import "./index.css";

// import { BrowserRouter } from "react-router-dom";
// import { AuthProvider } from "./context/AuthContext";
// import AppRoutes from "./routes/AppRoutes";
// import { Toaster } from "react-hot-toast";

// const App = () => (
//     <BrowserRouter>
//         <AuthProvider>
//             <AppRoutes />
//             <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
//         </AuthProvider>
//     </BrowserRouter>
// );

// export default App;



import "./index.css";

import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import AppRoutes from "./routes/AppRoutes";

const App = () => (
    <BrowserRouter>
        <AppRoutes />
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
    </BrowserRouter>
);

export default App;
