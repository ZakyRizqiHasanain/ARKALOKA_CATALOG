import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login(){

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

            if(response.ok){

                // ✅ FIX: simpan token DAN data admin (role wajib ada untuk ProtectedRoute)
                localStorage.setItem("token", data.token);
                localStorage.setItem("admin", JSON.stringify(data.admin));

                // redirect dashboard
                navigate("/admin");

            }else{
                setError(data.message);
            }

        } catch (err) {
            setError("Gagal terhubung ke server");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="
            min-h-screen
            flex
            items-center
            justify-center
            bg-gray-100
            px-6
        ">

            <div className="
                w-full
                max-w-md
                bg-white
                rounded-2xl
                shadow-lg
                p-8
            ">

                <h1 className="
                    text-3xl
                    font-bold
                    text-center
                    mb-8
                ">
                    Admin Login
                </h1>

                {error && (
                    <div className="
                        mb-4
                        bg-red-100
                        text-red-700
                        p-3
                        rounded-lg
                    ">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-5">

                    <div>
                        <label className="block mb-2 font-medium">
                            Email
                        </label>

                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="
                                w-full
                                border
                                rounded-lg
                                px-4
                                py-3
                                focus:outline-none
                                focus:ring-2
                                focus:ring-blue-500
                            "
                            required
                        />
                    </div>

                    <div>
                        <label className="block mb-2 font-medium">
                            Password
                        </label>

                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="
                                w-full
                                border
                                rounded-lg
                                px-4
                                py-3
                                focus:outline-none
                                focus:ring-2
                                focus:ring-blue-500
                            "
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="
                            w-full
                            bg-blue-600
                            text-white
                            py-3
                            rounded-lg
                            hover:bg-blue-700
                            transition
                            disabled:opacity-50
                        "
                    >
                        {loading ? "Loading..." : "Login"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Login;