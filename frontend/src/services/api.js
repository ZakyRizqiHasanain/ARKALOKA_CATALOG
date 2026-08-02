const getApiUrl = () => {
    let url = import.meta.env.VITE_API_URL || "https://arkaloka-backend.vercel.app/api";
    // Strip trailing slashes
    url = url.replace(/\/+$/, "");
    // Ensure /api suffix
    if (!url.endsWith("/api")) {
        url = `${url}/api`;
    }
    return url;
};

const API_URL = getApiUrl();

export default API_URL;