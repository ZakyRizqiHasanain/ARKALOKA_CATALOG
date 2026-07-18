import API_URL from "./api";

// 1. Admin login API call
export async function login(email, password) {
    const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Email atau password salah");
    }

    // Save token and admin info to localStorage
    localStorage.setItem("token", data.token);
    localStorage.setItem("admin", JSON.stringify(data.admin));

    return data;
}

// 2. Fetch admin dashboard stats
export async function getDashboardStats() {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}/admin/stats`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Gagal mengambil data statistik dashboard");
    }

    return data;
}

// 3. Admin logout
export function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("admin");
}

// 4. Check if authenticated
export function isAuthenticated() {
    const token = localStorage.getItem("token");
    const admin = localStorage.getItem("admin");
    return !!token && !!admin;
}

// 5. Get logged in admin data
export function getAdminData() {
    const adminJson = localStorage.getItem("admin");
    return adminJson ? JSON.parse(adminJson) : null;
}