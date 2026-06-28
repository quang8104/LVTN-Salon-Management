import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
    forgotPassword,
    resetPassword
} from "../api/authApi";

function ForgotPasswordPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");

    const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!?.*_])[A-Za-z\d@#$%^&+=!?.*_]{8,32}$/;

    const submit = async (e) => {
        e.preventDefault();

        if (!email.trim()) {
            Swal.fire("Lỗi", "Vui lòng nhập email", "error");
            return;
        }

        try {
            await forgotPassword({ email });

            const result = await Swal.fire({
                title: "Đặt lại mật khẩu",
                html: `
                    <div style="text-align:center">
                        <div style="
                            width:70px;
                            height:70px;
                            border-radius:50%;
                            background:#eef2ff;
                            display:flex;
                            align-items:center;
                            justify-content:center;
                            margin:0 auto 14px;
                            font-size:32px;
                        ">
                            🔐
                        </div>

                        <p style="color:#6b7280;margin-bottom:18px">
                            Mã OTP đã được gửi về Gmail của bạn
                        </p>
                    </div>

                    <div style="text-align:left">

                        <label style="font-weight:600;margin-bottom:6px;display:block">
                            Mã OTP
                        </label>
                        <input
                            id="otp"
                            class="swal2-input"
                            style="margin:0 0 14px 0;width:100%"
                            placeholder="Nhập mã OTP gồm 6 số"
                            maxlength="6"
                        />

                        <label style="font-weight:600;margin-bottom:6px;display:block">
                            Mật khẩu mới
                        </label>
                        <div style="position:relative;margin-bottom:14px">
                            <input
                                id="password"
                                type="password"
                                class="swal2-input"
                                style="margin:0;width:100%;padding-right:46px"
                                placeholder="Nhập mật khẩu mới"
                            />
                            <button
                                type="button"
                                id="togglePassword"
                                style="
                                    position:absolute;
                                    right:10px;
                                    top:50%;
                                    transform:translateY(-50%);
                                    border:none;
                                    background:transparent;
                                    cursor:pointer;
                                    font-size:18px;
                                "
                            >
                                👁️
                            </button>
                        </div>

                        <label style="font-weight:600;margin-bottom:6px;display:block">
                            Xác nhận mật khẩu
                        </label>
                        <div style="position:relative;margin-bottom:10px">
                            <input
                                id="confirmPassword"
                                type="password"
                                class="swal2-input"
                                style="margin:0;width:100%;padding-right:46px"
                                placeholder="Nhập lại mật khẩu mới"
                            />
                            <button
                                type="button"
                                id="toggleConfirm"
                                style="
                                    position:absolute;
                                    right:10px;
                                    top:50%;
                                    transform:translateY(-50%);
                                    border:none;
                                    background:transparent;
                                    cursor:pointer;
                                    font-size:18px;
                                "
                            >
                                👁️
                            </button>
                        </div>

                        <div style="
                            background:#f9fafb;
                            border:1px solid #e5e7eb;
                            border-radius:10px;
                            padding:12px;
                            margin-top:12px;
                            font-size:13px;
                            color:#6b7280;
                        ">
                            <div style="font-weight:600;color:#374151;margin-bottom:6px">
                                Mật khẩu cần có:
                            </div>
                            <div>✓ Từ 8-32 ký tự</div>
                            <div>✓ Có chữ hoa và chữ thường</div>
                            <div>✓ Có ít nhất 1 số</div>
                            <div>✓ Có ít nhất 1 ký tự đặc biệt</div>
                            <div>✓ Không chứa khoảng trắng</div>
                        </div>
                    </div>
                `,
                width: 560,
                confirmButtonText: "Đổi mật khẩu",
                cancelButtonText: "Hủy",
                showCancelButton: true,
                focusConfirm: false,
                didOpen: () => {
                    const passwordInput =
                        document.getElementById("password");
                    const confirmInput =
                        document.getElementById("confirmPassword");

                    const togglePassword =
                        document.getElementById("togglePassword");
                    const toggleConfirm =
                        document.getElementById("toggleConfirm");

                    togglePassword.addEventListener("click", () => {
                        const isPassword =
                            passwordInput.type === "password";

                        passwordInput.type = isPassword
                            ? "text"
                            : "password";

                        togglePassword.textContent = isPassword
                            ? "🙈"
                            : "👁️";
                    });

                    toggleConfirm.addEventListener("click", () => {
                        const isPassword =
                            confirmInput.type === "password";

                        confirmInput.type = isPassword
                            ? "text"
                            : "password";

                        toggleConfirm.textContent = isPassword
                            ? "🙈"
                            : "👁️";
                    });
                },
                preConfirm: () => {
                    const otp =
                        document.getElementById("otp").value.trim();

                    const password =
                        document.getElementById("password").value;

                    const confirmPassword =
                        document.getElementById("confirmPassword").value;

                    if (!otp || otp.length !== 6) {
                        Swal.showValidationMessage(
                            "OTP phải gồm 6 số"
                        );
                        return false;
                    }

                    if (!passwordRegex.test(password)) {
                        Swal.showValidationMessage(
                            "Mật khẩu chưa đúng quy định bảo mật"
                        );
                        return false;
                    }

                    if (password !== confirmPassword) {
                        Swal.showValidationMessage(
                            "Xác nhận mật khẩu không khớp"
                        );
                        return false;
                    }

                    return {
                        otp,
                        password
                    };
                }
            });

            if (!result.isConfirmed) return;

            await resetPassword({
                email,
                otp: result.value.otp,
                matKhauMoi: result.value.password
            });

            await Swal.fire({
                icon: "success",
                title: "Đổi mật khẩu thành công",
                text: "Bạn có thể đăng nhập bằng mật khẩu mới",
                timer: 1500,
                showConfirmButton: false
            });

            navigate("/login");
        } catch (error) {
            Swal.fire(
                "Lỗi",
                error.response?.data || "Có lỗi xảy ra",
                "error"
            );
        }
    };

    return (
        <div className="container py-5">
            <div
                className="card shadow mx-auto border-0"
                style={{ maxWidth: 500 }}
            >
                <div className="card-body p-4">
                    <h2 className="text-center mb-3">
                        Quên mật khẩu
                    </h2>

                    <p className="text-muted text-center mb-4">
                        Nhập email tài khoản để nhận mã OTP đặt lại mật khẩu.
                    </p>

                    <form onSubmit={submit}>
                        <div className="mb-3">
                            <label className="form-label">
                                Email
                            </label>

                            <input
                                type="email"
                                className="form-control"
                                value={email}
                                onChange={(e) =>
                                    setEmail(e.target.value)
                                }
                                placeholder="Nhập email của bạn"
                                required
                            />
                        </div>

                        <button className="btn btn-dark w-100">
                            Gửi mã OTP
                        </button>
                    </form>

                    <div className="text-center mt-3">
                        <Link to="/login">
                            Quay lại đăng nhập
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ForgotPasswordPage;