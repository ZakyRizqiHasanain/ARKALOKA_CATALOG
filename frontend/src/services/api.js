const getApiUrl = () => {
    let url = (import.meta.env.VITE_API_URL || "https://arkaloka-backend.vercel.app/api").trim();
    // Replace multiple slashes with single slash, except after protocol (http:// or https://)
    url = url.replace(/([^:]\/)\/+/g, "$1");
    // Strip trailing slash
    url = url.replace(/\/+$/, "");
    // Ensure ends with /api
    if (!url.endsWith("/api")) {
        url = `${url}/api`;
    }
    return url;
};

const API_URL = getApiUrl();

export default API_URL;