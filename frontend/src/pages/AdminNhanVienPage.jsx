import { useEffect, useState } from "react";
import {
    getAllNhanVien,
    createNhanVien,
    updateNhanVien,
    deleteNhanVien
} from "../api/adminNhanVienApi";

function AdminNhanVienPage() {
    const [nhanVien, setNhanVien] = useState([]);
    const [keyword, setKeyword] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [showForm, setShowForm] = useState(false);

    const [form, setForm] = useState({
        email: "",
        matKhau: "",
        hoTen: "",
        sdt: "",
        trangThai: 1,
        vaiTro: "NHAN_VIEN"
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const nvRes = await getAllNhanVien();

            const nvList = Array.isArray(nvRes.data)
                ? nvRes.data
                : nvRes.data.data || [];

            setNhanVien(nvList);
        } catch (error) {
            console.log("Lỗi load nhân viên:", error);
            alert(error.response?.data || "Không tải được dữ liệu nhân viên");
        }
    };

    const filteredNhanVien = nhanVien.filter((item) => {
        const text = keyword.toLowerCase();

        const trangThaiText = item.trangThai === 1 ? "đang làm" : "nghỉ";

        return (
            String(item.maNhanVien).toLowerCase().includes(text) ||
            item.hoTen?.toLowerCase().includes(text) ||
            item.email?.toLowerCase().includes(text) ||
            item.sdt?.toLowerCase().includes(text) ||
            item.vaiTro?.toLowerCase().includes(text) ||
            trangThaiText.includes(text)
        );
    });

    const change = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const resetForm = () => {
        setForm({
            email: "",
            matKhau: "",
            hoTen: "",
            sdt: "",
            trangThai: 1,
            vaiTro: "NHAN_VIEN"
        });

        setEditingId(null);
        setShowForm(false);
    };

    const openCreateForm = () => {
        resetForm();
        setShowForm(true);
    };

    const submit = async (e) => {
        e.preventDefault();

        const data = {
            ...form,
            trangThai: Number(form.trangThai)
        };

        if (editingId) {
            await updateNhanVien(editingId, data);
            alert("Cập nhật nhân viên thành công");
        } else {
            await createNhanVien(data);
            alert("Thêm nhân viên thành công");
        }

        resetForm();
        loadData();
    };

    const edit = async (item) => {
        setEditingId(item.maNhanVien);
        setShowForm(true);

        setForm({
            email: item.email || "",
            matKhau: "",
            hoTen: item.hoTen || "",
            sdt: item.sdt || "",
            trangThai: item.trangThai ?? 1,
            vaiTro: item.vaiTro || "NHAN_VIEN"
        });

        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const remove = async (id) => {
        if (!window.confirm("Bạn có chắc muốn xóa nhân viên này?")) return;

        await deleteNhanVien(id);
        alert("Xóa nhân viên thành công");
        loadData();
    };

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Quản lý nhân viên</h2>

                {!showForm && (
                    <button className="btn btn-primary" onClick={openCreateForm}>
                        + Thêm nhân viên
                    </button>
                )}
            </div>

            {showForm && (
                <div className="card mb-4">
                    <div className="card-header d-flex justify-content-between">
                        <b>{editingId ? "Cập nhật nhân viên" : "Thêm nhân viên"}</b>

                        <button
                            type="button"
                            className="btn btn-sm btn-outline-secondary"
                            onClick={resetForm}
                        >
                            Đóng
                        </button>
                    </div>

                    <div className="card-body">
                        <form onSubmit={submit}>
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label>Họ tên</label>
                                    <input
                                        className="form-control"
                                        name="hoTen"
                                        value={form.hoTen}
                                        onChange={change}
                                        required
                                    />
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label>Email</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        name="email"
                                        value={form.email}
                                        onChange={change}
                                        required
                                    />
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label>Mật khẩu</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        name="matKhau"
                                        value={form.matKhau}
                                        onChange={change}
                                        placeholder={editingId ? "Để trống nếu không đổi" : ""}
                                        required={!editingId}
                                    />
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label>Số điện thoại</label>
                                    <input
                                        className="form-control"
                                        name="sdt"
                                        value={form.sdt}
                                        onChange={change}
                                    />
                                </div>

                                <div className="col-md-3 mb-3">
                                    <label>Trạng thái</label>
                                    <select
                                        className="form-select"
                                        name="trangThai"
                                        value={form.trangThai}
                                        onChange={change}
                                    >
                                        <option value={1}>Đang làm</option>
                                        <option value={0}>Nghỉ</option>
                                    </select>
                                </div>

                                <div className="col-md-3 mb-3">
                                    <label>Vai trò</label>
                                    <select
                                        className="form-select"
                                        name="vaiTro"
                                        value={form.vaiTro}
                                        onChange={change}
                                    >
                                        <option value="NHAN_VIEN">Nhân viên</option>
                                        <option value="ADMIN">Admin</option>
                                    </select>
                                </div>
                            </div>

                            <button className="btn btn-primary me-2">
                                {editingId ? "Cập nhật" : "Thêm"}
                            </button>

                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={resetForm}
                            >
                                Hủy
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <div className="card border-0 shadow-sm mb-3">
                <div className="card-body">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Tìm theo mã, họ tên, email, số điện thoại, trạng thái hoặc vai trò..."
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                    />
                </div>
            </div>

            <div className="card border-0 shadow-sm">
                <div className="card-header bg-white d-flex justify-content-between align-items-center">
                    <b>Danh sách nhân viên</b>
                    <span className="badge bg-primary">
                        {filteredNhanVien.length} nhân viên
                    </span>
                </div>

                <div className="card-body p-0">
                    <table className="table table-bordered table-hover mb-0">
                        <thead className="table-dark">
                            <tr>
                                <th>Mã</th>
                                <th>Họ tên</th>
                                <th>Email</th>
                                <th>SĐT</th>
                                <th>Trạng thái</th>
                                <th>Vai trò</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredNhanVien.map((item) => (
                                <tr key={item.maNhanVien}>
                                    <td>{item.maNhanVien}</td>
                                    <td>{item.hoTen}</td>
                                    <td>{item.email}</td>
                                    <td>{item.sdt}</td>
                                    <td>{item.trangThai === 1 ? "Đang làm" : "Nghỉ"}</td>
                                    <td>{item.vaiTro}</td>
                                    <td>
                                        <button
                                            className="btn btn-warning btn-sm me-2"
                                            onClick={() => edit(item)}
                                        >
                                            Sửa
                                        </button>

                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => remove(item.maNhanVien)}
                                        >
                                            Xóa
                                        </button>
                                    </td>
                                </tr>
                            ))}

                            {filteredNhanVien.length === 0 && (
                                <tr>
                                    <td colSpan="7" className="text-center py-4">
                                        Không tìm thấy nhân viên phù hợp
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default AdminNhanVienPage;