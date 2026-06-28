import { useState } from "react";
import Swal from "sweetalert2";
import { changePassword } from "../api/khachHangApi";

function ChangePasswordPage() {
    const userId = localStorage.getItem("userId");

    const [showOld, setShowOld] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const [form, setForm] = useState({
        matKhauCu: "",
        matKhauMoi: "",
        xacNhanMatKhau: ""
    });

    const change = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const passwordRules = {
        length: form.matKhauMoi.length >= 8 && form.matKhauMoi.length <= 32,
        upper: /[A-Z]/.test(form.matKhauMoi),
        lower: /[a-z]/.test(form.matKhauMoi),
        number: /[0-9]/.test(form.matKhauMoi),
        special: /[@#$%^&+=!?.*_]/.test(form.matKhauMoi),
        noSpace: !/\s/.test(form.matKhauMoi)
    };

    const passwordValid = Object.values(passwordRules).every(Boolean);
    const passwordStrength = Object.values(passwordRules).filter(Boolean).length;

    const getStrengthText = () => {
        if (!form.matKhauMoi) return "";
        if (passwordStrength <= 2) return "Yếu";
        if (passwordStrength <= 4) return "Trung bình";
        if (passwordStrength <= 5) return "Khá";
        return "Mạnh";
    };

    const getStrengthClass = () => {
        if (!form.matKhauMoi) return "bg-secondary";
        if (passwordStrength <= 2) return "bg-danger";
        if (passwordStrength <= 4) return "bg-warning";
        if (passwordStrength <= 5) return "bg-info";
        return "bg-success";
    };

    const submit = async (e) => {
        e.preventDefault();

        if (!form.matKhauCu) {
            Swal.fire("Lỗi", "Vui lòng nhập mật khẩu cũ", "error");
            return;
        }

        if (!passwordValid) {
            Swal.fire("Lỗi", "Mật khẩu mới chưa đủ mạnh", "error");
            return;
        }

        if (form.matKhauMoi !== form.xacNhanMatKhau) {
            Swal.fire("Lỗi", "Xác nhận mật khẩu không khớp", "error");
            return;
        }

        try {
            await changePassword(userId, {
                matKhauCu: form.matKhauCu,
                matKhauMoi: form.matKhauMoi
            });

            await Swal.fire({
                icon: "success",
                title: "Đổi mật khẩu thành công",
                timer: 1200,
                showConfirmButton: false
            });

            setForm({
                matKhauCu: "",
                matKhauMoi: "",
                xacNhanMatKhau: ""
            });
        } catch (error) {
            Swal.fire(
                "Lỗi",
                error.response?.data || "Đổi mật khẩu thất bại",
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
        <div className="container py-5" style={{ maxWidth: "620px" }}>
            <div className="card border-0 shadow-sm">
                <div className="card-body p-4">
                    <h2 className="text-center mb-4">Đổi mật khẩu</h2>

                    <form onSubmit={submit}>
                        <div className="mb-3">
                            <label className="form-label">Mật khẩu cũ</label>
                            <div className="input-group">
                                <input
                                    type={showOld ? "text" : "password"}
                                    className="form-control"
                                    name="matKhauCu"
                                    value={form.matKhauCu}
                                    onChange={change}
                                    required
                                />
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary"
                                    onClick={() => setShowOld(!showOld)}
                                >
                                    {showOld ? "🙈" : "👁️"}
                                </button>
                            </div>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Mật khẩu mới</label>
                            <div className="input-group">
                                <input
                                    type={showNew ? "text" : "password"}
                                    className="form-control"
                                    name="matKhauMoi"
                                    value={form.matKhauMoi}
                                    onChange={change}
                                    required
                                />
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary"
                                    onClick={() => setShowNew(!showNew)}
                                >
                                    {showNew ? "🙈" : "👁️"}
                                </button>
                            </div>

                            {form.matKhauMoi && (
                                <div className="mt-2">
                                    <div className="d-flex justify-content-between">
                                        <small>Độ mạnh mật khẩu</small>
                                        <small className="fw-bold">{getStrengthText()}</small>
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
                            <label className="form-label">Xác nhận mật khẩu mới</label>
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
                                        form.matKhauMoi === form.xacNhanMatKhau
                                            ? "text-success"
                                            : "text-danger"
                                    }
                                >
                                    {form.matKhauMoi === form.xacNhanMatKhau
                                        ? "✓ Mật khẩu khớp"
                                        : "✕ Mật khẩu không khớp"}
                                </small>
                            )}
                        </div>

                        <button className="btn btn-dark w-100">
                            Đổi mật khẩu
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ChangePasswordPage;