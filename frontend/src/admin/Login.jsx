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
        <div className="min-h-screen flex items-center justify-center bg-[#140D09] px-6 text-[#F5E9DC]">
            <div className="w-full max-w-md bg-[#21150F] rounded-3xl shadow-2xl border border-[#3D281C] p-8">
                {/* Logo & Header */}
                <div className="flex flex-col items-center justify-center text-center mb-8">
                    <img
                        src="/logo.png"
                        alt="ARKALOKA Logo"
                        className="w-16 h-16 object-contain mb-3"
                    />
                    <h1 className="text-2xl font-black text-[#F5E9DC] tracking-wider uppercase">
                        ARKALOKA ADMIN
                    </h1>
                    <p className="text-xs text-[#B8A08C] mt-1">Masuk ke panel pengelolaan katalog</p>
                </div>

                {error && (
                    <div className="mb-6 bg-red-950/40 border border-red-800/50 text-red-300 text-sm p-4 rounded-xl">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-5">
                    <div>
                        <label className="block mb-2 text-sm font-semibold text-[#B8A08C]">
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="admin@example.com"
                            className="w-full border border-[#3D281C] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#B87333] transition-all bg-[#140D09] text-[#F5E9DC] placeholder-[#B8A08C]/50"
                            required
                        />
                    </div>

                    <div>
                        <label className="block mb-2 text-sm font-semibold text-[#B8A08C]">
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full border border-[#3D281C] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#B87333] transition-all bg-[#140D09] text-[#F5E9DC] placeholder-[#B8A08C]/50"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#B87333] text-[#F5E9DC] py-3.5 rounded-xl font-bold hover:bg-[#A05E22] transition-colors shadow-lg shadow-[#B87333]/20 disabled:opacity-50"
                    >
                        {loading ? "Memproses..." : "Masuk ke Admin"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Login;