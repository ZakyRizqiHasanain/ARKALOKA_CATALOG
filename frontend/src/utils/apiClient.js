/**
 * apiClient.js — wrapper fetch untuk semua request API admin
 *
 * Fitur:
 * - Otomatis sisipkan Authorization header dari localStorage
 * - Jika response 401 (token expired/invalid) → bersihkan storage & redirect login
 */

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

function clearAuthAndRedirect() {
    localStorage.removeItem("token");
    localStorage.removeItem("admin");
    window.location.href = "/admin/login";
}

async function apiClient(endpoint, options = {}) {
    const token = localStorage.getItem("token");

    const headers = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {}),
    };

    // Jika ada FormData (upload file), hapus Content-Type agar browser set multipart boundary
    if (options.body instanceof FormData) {
        delete headers["Content-Type"];
    }

    const response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers,
    });

    // Token expired atau tidak valid → logout otomatis
    if (response.status === 401) {
        clearAuthAndRedirect();
        throw new Error("Sesi habis. Silakan login kembali.");
    }

    return response;
}

export default apiClient;
export { API_BASE };
