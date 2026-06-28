import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import { register, verifyOtp } from "../api/authApi";

function RegisterPage() {
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const [form, setForm] = useState({
        hoTen: "",
        email: "",
        sdt: "",
        diaChi: "",
        matKhau: "",
        xacNhanMatKhau: ""
    });

    const change = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const passwordRules = {
        length: form.matKhau.length >= 8 && form.matKhau.length <= 32,
        upper: /[A-Z]/.test(form.matKhau),
        lower: /[a-z]/.test(form.matKhau),
        number: /[0-9]/.test(form.matKhau),
        special: /[@#$%^&+=!?.*_]/.test(form.matKhau),
        noSpace: !/\s/.test(form.matKhau)
    };

    const passwordValid = Object.values(passwordRules).every(Boolean);

    const passwordStrength = Object.values(passwordRules).filter(Boolean).length;

    const getStrengthText = () => {
        if (!form.matKhau) return "";
        if (passwordStrength <= 2) return "Yếu";
        if (passwordStrength <= 4) return "Trung bình";
        if (passwordStrength <= 5) return "Khá";
        return "Mạnh";
    };

    const getStrengthClass = () => {
        if (!form.matKhau) return "bg-secondary";
        if (passwordStrength <= 2) return "bg-danger";
        if (passwordStrength <= 4) return "bg-warning";
        if (passwordStrength <= 5) return "bg-info";
        return "bg-success";
    };

    const validate = () => {
        const phoneRegex = /^(03|05|07|08|09)[0-9]{8}$/;

        if (!form.hoTen.trim()) {
            Swal.fire("Lỗi", "Vui lòng nhập họ tên", "error");
            return false;
        }

        if (!form.email.trim()) {
            Swal.fire("Lỗi", "Vui lòng nhập email", "error");
            return false;
        }

        if (!phoneRegex.test(form.sdt)) {
            Swal.fire(
                "Lỗi",
                "Số điện thoại không đúng định dạng Việt Nam",
                "error"
            );
            return false;
        }

        if (!passwordValid) {
            Swal.fire({
                icon: "warning",
                title: "Mật khẩu chưa đủ mạnh",
                html: `
                    <ul style="text-align:left">
                        <li>Từ 8-32 ký tự</li>
                        <li>Có ít nhất 1 chữ hoa</li>
                        <li>Có ít nhất 1 chữ thường</li>
                        <li>Có ít nhất 1 số</li>
                        <li>Có ít nhất 1 ký tự đặc biệt</li>
                        <li>Không chứa khoảng trắng</li>
                    </ul>
                `
            });
            return false;
        }

        if (form.matKhau !== form.xacNhanMatKhau) {
            Swal.fire("Lỗi", "Xác nhận mật khẩu không khớp", "error");
            return false;
        }

        return true;
    };

    const submit = async (e) => {
        e.preventDefault();

        if (!validate()) return;

        try {
            await register({
                hoTen: form.hoTen,
                email: form.email,
                sdt: form.sdt,
                diaChi: form.diaChi,
                matKhau: form.matKhau
            });

            const result = await Swal.fire({
                title: "Xác thực OTP",
                text: "Mã OTP đã được gửi về Gmail của bạn",
                input: "text",
                inputPlaceholder: "Nhập mã OTP",
                inputAttributes: {
                    maxlength: 6
                },
                showCancelButton: true,
                confirmButtonText: "Xác nhận",
                cancelButtonText: "Hủy",
                inputValidator: (value) => {
                    if (!value) return "Vui lòng nhập mã OTP";
                    if (value.length !== 6) return "OTP phải gồm 6 số";
                    return null;
                }
            });

            if (!result.isConfirmed) return;

            await verifyOtp({
                email: form.email,
                otp: result.value
            });

            await Swal.fire({
                icon: "success",
                title: "Đăng ký thành công",
                text: "Bạn có thể đăng nhập ngay bây giờ",
                timer: 1500,
                showConfirmButton: false
            });

            navigate("/login");
        } catch (error) {
            Swal.fire(
                "Lỗi",
                error.response?.data || "Đăng ký thất bại",
                "error"
            );
        }
    };

    const Rule = ({ ok, text }) => (
        <div className={ok ? "text-success small" : "text-muted small"}>
            {ok ? "✓" : "○"} {text}
        </div>
    );

    return (
        <div className="container py-5" style={{ maxWidth: "560px" }}>
            <div className="card border-0 shadow-sm">
                <div className="card-body p-4">
                    <h2 className="text-center mb-4">Đăng ký</h2>

                    <form onSubmit={submit}>
                        <div className="mb-3">
                            <label className="form-label">Họ tên</label>
                            <input
                                className="form-control"
                                name="hoTen"
                                value={form.hoTen}
                                onChange={change}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Email</label>
                            <input
                                type="email"
                                className="form-control"
                                name="email"
                                value={form.email}
                                onChange={change}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Số điện thoại</label>
                            <input
                                className="form-control"
                                name="sdt"
                                value={form.sdt}
                                onChange={change}
                                placeholder="Ví dụ: 0987654321"
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Địa chỉ</label>
                            <textarea
                                className="form-control"
                                name="diaChi"
                                value={form.diaChi}
                                onChange={change}
                                rows="2"
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Mật khẩu</label>

                            <div className="input-group">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className="form-control"
                                    name="matKhau"
                                    value={form.matKhau}
                                    onChange={change}
                                    required
                                />

                                <button
                                    type="button"
                                    className="btn btn-outline-secondary"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? "🙈" : "👁️"}
                                </button>
                            </div>

                            {form.matKhau && (
                                <div className="mt-2">
                                    <div className="d-flex justify-content-between">
                                        <small>Độ mạnh mật khẩu</small>
                                        <small className="fw-bold">
                                            {getStrengthText()}
                                        </small>
                                    </div>

                                    <div className="progress mt-1" style={{ height: "8px" }}>
                                        <div
                                            className={`progress-bar ${getStrengthClass()}`}
                                            style={{
                                                width: `${(passwordStrength / 6) * 100}%`
                                            }}
                                        ></div>
                                    </div>

                                    <div className="mt-2">
                                        <Rule ok={passwordRules.length} text="Từ 8-32 ký tự" />
                                        <Rule ok={passwordRules.upper} text="Có ít nhất 1 chữ hoa" />
                                        <Rule ok={passwordRules.lower} text="Có ít nhất 1 chữ thường" />
                                        <Rule ok={passwordRules.number} text="Có ít nhất 1 số" />
                                        <Rule ok={passwordRules.special} text="Có ít nhất 1 ký tự đặc biệt" />
                                        <Rule ok={passwordRules.noSpace} text="Không chứa khoảng trắng" />
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="mb-4">
                            <label className="form-label">
                                Xác nhận mật khẩu
                            </label>

                            <div className="input-group">
                                <input
                                    type={showConfirm ? "text" : "password"}
                                    className="form-control"
                                    name="xacNhanMatKhau"
                                    value={form.xacNhanMatKhau}
                                    onChange={change}
                                    required
                                />

                                <button
                                    type="button"
                                    className="btn btn-outline-secondary"
                                    onClick={() => setShowConfirm(!showConfirm)}
                                >
                                    {showConfirm ? "🙈" : "👁️"}
                                </button>
                            </div>

                            {form.xacNhanMatKhau && (
                                <small
                                    className={
                                        form.matKhau === form.xacNhanMatKhau
                                            ? "text-success"
                                            : "text-danger"
                                    }
                                >
                                    {form.matKhau === form.xacNhanMatKhau
                                        ? "✓ Mật khẩu khớp"
                                        : "✕ Mật khẩu không khớp"}
                                </small>
                            )}
                        </div>

                        <button className="btn btn-dark w-100">
                            Đăng ký
                        </button>
                    </form>

                    <div className="text-center mt-3">
                        <span>Đã có tài khoản? </span>
                        <Link to="/login">Đăng nhập</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;