import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function Register() {

    const navigate = useNavigate();

    const [form, setForm] = useState({
        full_name: "",
        mobile: "",
        email: "",
        password: "",
        confirm_password: ""
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

            await api.post("/auth/register", form);

            alert("Registration Successful");

            navigate("/");

        } catch (err) {

    console.log(err);

    if (err.response) {
        console.log(err.response.data);
        alert(JSON.stringify(err.response.data, null, 2));
    } else {
        alert("Backend crashed. Check the FastAPI terminal.");
    }

}

        

    };

    return (

        <div
            className="container d-flex justify-content-center align-items-center"
            style={{ minHeight: "100vh" }}
        >

            <div
                className="card shadow-lg p-4"
                style={{ width: "450px" }}
            >

                <h2 className="text-center mb-4">
                    🚗 Create Account
                </h2>

                <form onSubmit={handleSubmit}>

                    <div className="mb-3">

                        <label className="form-label">
                            Full Name
                        </label>

                        <input
                            type="text"
                            name="full_name"
                            className="form-control"
                            value={form.full_name}
                            onChange={handleChange}
                            required
                        />

                    </div>

                    <div className="mb-3">

                        <label className="form-label">
                            Mobile Number
                        </label>

                        <input
                            type="text"
                            name="mobile"
                            className="form-control"
                            value={form.mobile}
                            onChange={handleChange}
                            required
                        />

                    </div>

                    <div className="mb-3">

                        <label className="form-label">
                            Email
                        </label>

                        <input
                            type="email"
                            name="email"
                            className="form-control"
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
                            name="password"
                            className="form-control"
                            value={form.password}
                            onChange={handleChange}
                            required
                        />

                    </div>
                                        <div className="mb-3">

                        <label className="form-label">
                            Confirm Password
                        </label>

                        <input
                            type="password"
                            name="confirm_password"
                            className="form-control"
                            value={form.confirm_password}
                            onChange={handleChange}
                            required
                        />

                    </div>

                    <button
                        className="btn btn-success w-100"
                    >
                        Register
                    </button>

                </form>

                <p className="text-center mt-3">

                    Already have an account?{" "}

                    <Link to="/">
                        Login
                    </Link>

                </p>

            </div>

        </div>

    );

}

export default Register;