import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/authApi";

function LoginPage() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: "",
        matKhau: ""
    });

    const change = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const submit = async (e) => {
        e.preventDefault();

        try {
            const res = await login(form);

            localStorage.setItem("token", res.data.token);

            alert("Đăng nhập thành công");

            navigate("/admin");
        } catch (err) {
            console.log(err);
            alert("Sai email hoặc mật khẩu");
        }
    };

    return (
        <div className="container py-5" style={{ maxWidth: "450px" }}>
            <h2 className="mb-4 text-center">Đăng nhập</h2>

            <form onSubmit={submit}>
                <div className="mb-3">
                    <label>Email</label>
                    <input
                        className="form-control"
                        name="email"
                        value={form.email}
                        onChange={change}
                    />
                </div>

                <div className="mb-3">
                    <label>Mật khẩu</label>
                    <input
                        type="password"
                        className="form-control"
                        name="matKhau"
                        value={form.matKhau}
                        onChange={change}
                    />
                </div>

                <button className="btn btn-primary w-100">
                    Đăng nhập
                </button>
            </form>
        </div>
    );
}

export default LoginPage;