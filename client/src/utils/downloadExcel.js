import axios from "axios";
import toast from "react-hot-toast";

const XLSX_MIME =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

// reads filename from Content-Disposition if the backend sends it
const getFileName = (headers, fallback) => {
    const cd = headers?.["content-disposition"];
    const match = cd && /filename\*?=(?:UTF-8'')?"?([^";]+)"?/i.exec(cd);
    return match ? decodeURIComponent(match[1]) : fallback;
};

// with responseType "blob", error bodies also arrive as a Blob, so parse it
const getErrorMessage = async (error) => {
    const data = error.response?.data;
    if (data instanceof Blob) {
        try {
            return JSON.parse(await data.text()).message || "Download failed";
        } catch {
            return "Download failed";
        }
    }
    return data?.message || "Download failed";
};

export const downloadExcel = async (url, fallbackName = "leads.xlsx") => {
    const toastId = toast.loading("Preparing Excel...");
    try {
        const res = await axios.get(url, { responseType: "blob" });
        const contentType = res.headers["content-type"] || "";

        // backend answered with JSON (e.g. "No data to download..") instead of a file
        if (contentType.includes("application/json")) {
            let message = "No data to download";
            try {
                message = JSON.parse(await res.data.text()).message || message;
            } catch {
                /* keep default message */
            }
            toast(message, { id: toastId, icon: "ℹ️" });
            return;
        }

        const blob = new Blob([res.data], { type: contentType || XLSX_MIME });
        const fileName = getFileName(res.headers, fallbackName);

        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(link.href);

        toast.success("Excel downloaded", { id: toastId });
    } catch (error) {
        console.log("Download error", error);
        toast.error(await getErrorMessage(error), { id: toastId });
    }
};