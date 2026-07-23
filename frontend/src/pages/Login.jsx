import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

function Login() {

    const navigate = useNavigate();

    const [form, setForm] = useState({
        role: "user",
        email: "",
        password: ""
    });

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const res = await api.post("/auth/login", form);

            localStorage.setItem(
                "token",
                res.data.access_token
            );

            localStorage.setItem(
                "user",
                JSON.stringify(res.data.user)
            );

            alert("Login Successful");

            navigate("/dashboard");

        } catch (err) {

            alert(
                err.response?.data?.detail ||
                "Login Failed"
            );

        }

    };

    return (

        <div
            className="container-fluid d-flex justify-content-center align-items-center"
            style={{
                minHeight: "100vh",
                background: "linear-gradient(135deg,#0f172a,#1d4ed8,#3b82f6)"
            }}
        >

            <div
                className="card shadow-lg border-0 p-4"
                style={{
                    width: "430px",
                    borderRadius: "20px",
                    background: "rgba(255,255,255,0.95)"
                }}
            >

                <h2 className="text-center mb-4">
                    🚗 Car Dealership Login
                </h2>

                <form onSubmit={handleSubmit}>

                    <div className="mb-3">

                        <label className="form-label">
                            Login As
                        </label>

                        <select
                            className="form-select"
                            name="role"
                            value={form.role}
                            onChange={handleChange}
                        >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                        </select>

                    </div>

                    <div className="mb-3">

                        <label className="form-label">
                            Email
                        </label>

                        <input
                            type="email"
                            className="form-control"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            required
                        />

                    </div>

                    <div className="mb-3">

                        <label className="form-label">
                            Password
                        </label>

                        <input
                            type="password"
                            className="form-control"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            required
                        />

                    </div>

                    <div className="text-end mb-3">

                        <Link
                            to="/forgot-password"
                            style={{ textDecoration: "none" }}
                        >
                            Forgot Password?
                        </Link>

                    </div>

                    <button
                        className="btn btn-primary w-100 py-2"
                        style={{
                            borderRadius: "10px",
                            fontWeight: "600"
                        }}
                    >
                        Login
                    </button>

                </form>

                <hr />

                <p className="text-center">

                    Don't have an account?{" "}

                    <Link to="/register">
                        Register
                    </Link>

                </p>

            </div>

        </div>

    );

}

export default Login;