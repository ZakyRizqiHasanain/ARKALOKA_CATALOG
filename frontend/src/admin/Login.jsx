import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        setLoading(true);
        setError("");

        try {
            const response = await fetch(
                "http://localhost:3000/api/auth/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email,
                        password
                    })
                }
            );

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("admin", JSON.stringify(data.admin));
                navigate("/admin");
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError("Gagal terhubung ke server");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#FBF7F1] px-6 text-[#4E3A2C]">
            <div className="w-full max-w-md bg-[#FFFFFF] rounded-3xl shadow-xl border border-[#E8CBA6] p-8">
                {/* Logo & Header */}
                <div className="flex flex-col items-center justify-center text-center mb-8">
                    <img
                        src="/logo.png"
                        alt="ARKALOKA Logo"
                        className="w-16 h-16 object-contain mb-3"
                    />
                    <h1 className="text-2xl font-black text-[#4E3A2C] tracking-wider uppercase">
                        ARKALOKA ADMIN
                    </h1>
                    <p className="text-xs text-[#9A8F81] mt-1 font-medium">Masuk ke panel pengelolaan katalog</p>
                </div>

                {error && (
                    <div className="mb-6 bg-red-50 border border-red-200 text-red-700 text-sm p-4 rounded-xl">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-5">
                    <div>
                        <label className="block mb-2 text-sm font-bold text-[#4E3A2C]">
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="admin@example.com"
                            className="w-full border border-[#E8CBA6] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#8C6A4A] transition-all bg-[#FBF7F1] text-[#4E3A2C] placeholder-[#9A8F81]/60"
                            required
                        />
                    </div>

                    <div>
                        <label className="block mb-2 text-sm font-bold text-[#4E3A2C]">
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full border border-[#E8CBA6] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#8C6A4A] transition-all bg-[#FBF7F1] text-[#4E3A2C] placeholder-[#9A8F81]/60"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#8C6A4A] text-[#FBF7F1] py-3.5 rounded-xl font-bold hover:bg-[#4E3A2C] transition-colors shadow-md disabled:opacity-50"
                    >
                        {loading ? "Memproses..." : "Masuk ke Admin"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Login;