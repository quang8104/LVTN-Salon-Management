import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
    getKhachHangById,
    updateProfile
} from "../api/khachHangApi";

function ProfilePage() {
    const userId = localStorage.getItem("userId");

    const [form, setForm] = useState({
        email: "",
        hoTen: "",
        sdt: "",
        diaChi: ""
    });

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const res = await getKhachHangById(userId);

            setForm({
                email: res.data.email || "",
                hoTen: res.data.hoTen || "",
                sdt: res.data.sdt || "",
                diaChi: res.data.diaChi || ""
            });
        } catch (error) {
            console.log(error);
        }
    };

    const change = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const submit = async (e) => {
        e.preventDefault();

        const phoneRegex = /^(03|05|07|08|09)[0-9]{8}$/;

        if (!form.hoTen.trim()) {
            Swal.fire("Lỗi", "Họ tên không được để trống", "error");
            return;
        }

        if (!phoneRegex.test(form.sdt)) {
            Swal.fire(
                "Lỗi",
                "Số điện thoại không đúng định dạng Việt Nam",
                "error"
            );
            return;
        }

        try {
            await updateProfile(userId, {
                hoTen: form.hoTen,
                sdt: form.sdt,
                diaChi: form.diaChi
            });

            localStorage.setItem("hoTen", form.hoTen);
            window.dispatchEvent(new Event("storage"));

            Swal.fire({
                icon: "success",
                title: "Cập nhật thành công",
                timer: 1200,
                showConfirmButton: false
            });
        } catch (error) {
            Swal.fire(
                "Lỗi",
                error.response?.data || "Cập nhật thất bại",
                "error"
            );
        }
    };

    return (
        <div className="container py-5" style={{ maxWidth: "650px" }}>
            <div className="card border-0 shadow-sm">
                <div className="card-body p-4">
                    <h2 className="mb-4 text-center">
                        Thông tin cá nhân
                    </h2>

                    <form onSubmit={submit}>
                        <div className="mb-3">
                            <label className="form-label">Email</label>
                            <input
                                className="form-control"
                                value={form.email}
                                disabled
                            />
                            <small className="text-muted">
                                Email dùng để đăng nhập nên không thể thay đổi.
                            </small>
                        </div>

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

                        <div className="mb-4">
                            <label className="form-label">Địa chỉ</label>
                            <textarea
                                className="form-control"
                                name="diaChi"
                                value={form.diaChi}
                                onChange={change}
                                rows="3"
                            />
                        </div>

                        <button className="btn btn-dark w-100">
                            Lưu thay đổi
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ProfilePage;