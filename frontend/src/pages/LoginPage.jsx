import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
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
            const data = res.data;

            

            console.log("LOGIN RESPONSE:", data);
            console.log("ROLE:", data.vaiTro);

            localStorage.setItem("token", data.token);
            localStorage.setItem("vaiTro", data.vaiTro);
            localStorage.setItem("userId", data.id);
            localStorage.setItem("hoTen", data.hoTen);

            alert("Đăng nhập thành công");

            const role = data.vaiTro?.trim().toUpperCase();

            if (role === "ADMIN") {
                navigate("/admin");
            } else {
                navigate("/");
            }
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
                <div className="text-end mt-2">
                    <Link to="/forgot-password">
                        Quên mật khẩu?
                    </Link>
                </div>
            </form>
        </div>
    );
}

export default LoginPage;