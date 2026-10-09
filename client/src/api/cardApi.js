// import api from "./axiosInstance"; // your existing axios instance (with the token header)

// export const scanCardApi = (file) => {
//     const fd = new FormData();
//     fd.append("card", file);
//     return api.post("/cards/scan", fd); // expects { success, data: { name, designation, company, phone, email, website, address } }
// };

// export const saveCardApi = (payload) => api.post("/cards", payload);

// export const getCardsApi = () => api.get("/cards"); // expects { success, data: [...] }



import api from "./axiosInstance";

/**
 * Scan a visiting card.
 * Backend: POST /api/v1/executive/scan-card  (multer field: "cardImg")
 * Returns: { success, data: { customerName, companyName, city, requirement, email, mobileno } }
 */
export const scanCardApi = (file) => {
    const fd = new FormData();
    fd.append("cardImg", file); // must match backend multer field name
    return api.post("/api/v1/executive/scan-card", fd, {
        headers: { "Content-Type": "multipart/form-data" },
    });
};

/**
 * Save the reviewed lead.
 * Backend: POST /api/v1/executive/create-lead
 * Body: { customerName, companyName, city, requirement, email, mobileNo }
 * Returns: { success, message, savedLead }
 */
export const saveCardApi = (payload) =>
    api.post("/api/v1/executive/create-lead", payload);

/**
 * NOTE: backend has NO GET route for leads yet.
 * Uncomment later if you add one:
 */
// export const getCardsApi = () => api.get("/api/v1/executive/leads");
