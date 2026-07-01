import { useEffect, useState } from "react";
import {
    getAllDanhMucDichVu,
    createDanhMucDichVu,
    updateDanhMucDichVu,
    deleteDanhMucDichVu
} from "../api/danhMucDichVuApi";

function AdminDanhMucDichVuPage() {
    const [danhMuc, setDanhMuc] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [keyword, setKeyword] = useState("");

    const [form, setForm] = useState({
        tenDanhMuc: "",
        moTa: "",
        trangThai: 1
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const res = await getAllDanhMucDichVu();
        setDanhMuc(Array.isArray(res.data) ? res.data : res.data.data || []);
    };

    const change = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const resetForm = () => {
        setForm({
            tenDanhMuc: "",
            moTa: "",
            trangThai: 1
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
            tenDanhMuc: form.tenDanhMuc,
            moTa: form.moTa,
            trangThai: Number(form.trangThai)
        };

        if (editingId) {
            await updateDanhMucDichVu(editingId, data);
            alert("Cập nhật danh mục dịch vụ thành công");
        } else {
            await createDanhMucDichVu(data);
            alert("Thêm danh mục dịch vụ thành công");
        }

        resetForm();
        loadData();
    };

    const edit = (item) => {
        setEditingId(item.maDanhMucDichVu);
        setShowForm(true);

        setForm({
            tenDanhMuc: item.tenDanhMuc || "",
            moTa: item.moTa || "",
            trangThai: item.trangThai ?? 1
        });

        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const remove = async (id) => {
        if (!window.confirm("Bạn có chắc muốn xóa danh mục này?")) return;

        await deleteDanhMucDichVu(id);
        alert("Xóa danh mục dịch vụ thành công");
        loadData();
    };

    const filteredDanhMuc = danhMuc.filter((item) => {
        const text = keyword.trim().toLowerCase();

        if (!text) return true;

        return (
            String(item.maDanhMucDichVu).includes(text) ||
            item.tenDanhMuc?.toLowerCase().includes(text) ||
            item.moTa?.toLowerCase().includes(text)
        );
    });

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="mb-1">Quản lý danh mục dịch vụ</h2>
                    <p className="text-muted mb-0">
                        Thêm, cập nhật và quản lý nhóm dịch vụ salon
                    </p>
                </div>

                {!showForm && (
                    <button className="btn btn-primary" onClick={openCreateForm}>
                        + Thêm danh mục
                    </button>
                )}
            </div>

            {showForm && (
                <div className="card border-0 shadow-sm mb-4">
                    <div className="card-header bg-white fw-bold d-flex justify-content-between align-items-center">
                        <span>
                            {editingId ? "Cập nhật danh mục" : "Thêm danh mục"}
                        </span>

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
                                    <label className="form-label">Tên danh mục</label>
                                    <input
                                        className="form-control"
                                        name="tenDanhMuc"
                                        value={form.tenDanhMuc}
                                        onChange={change}
                                        required
                                    />
                                </div>

                                <div className="col-md-3 mb-3">
                                    <label className="form-label">Trạng thái</label>
                                    <select
                                        className="form-select"
                                        name="trangThai"
                                        value={form.trangThai}
                                        onChange={change}
                                    >
                                        <option value={1}>Hoạt động</option>
                                        <option value={0}>Ngừng</option>
                                    </select>
                                </div>

                                <div className="col-md-12 mb-3">
                                    <label className="form-label">Mô tả</label>
                                    <textarea
                                        className="form-control"
                                        rows="3"
                                        name="moTa"
                                        value={form.moTa}
                                        onChange={change}
                                    />
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
                        className="form-control"
                        placeholder="Tìm theo mã, tên danh mục hoặc mô tả..."
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                    />
                </div>
            </div>

            <div className="card border-0 shadow-sm">
                <div className="card-header bg-white fw-bold d-flex justify-content-between align-items-center">
                    <span>Danh sách danh mục dịch vụ</span>
                    <span className="badge bg-primary">
                        {filteredDanhMuc.length} danh mục
                    </span>
                </div>

                <div className="card-body p-0">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-dark">
                            <tr>
                                <th>Mã</th>
                                <th>Tên danh mục</th>
                                <th>Mô tả</th>
                                <th>Trạng thái</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredDanhMuc.map((item) => (
                                <tr key={item.maDanhMucDichVu}>
                                    <td>{item.maDanhMucDichVu}</td>
                                    <td className="fw-semibold">{item.tenDanhMuc}</td>
                                    <td>{item.moTa || "-"}</td>
                                    <td>
                                        <span
                                            className={
                                                item.trangThai === 1
                                                    ? "badge bg-success"
                                                    : "badge bg-secondary"
                                            }
                                        >
                                            {item.trangThai === 1 ? "Hoạt động" : "Ngừng"}
                                        </span>
                                    </td>
                                    <td>
                                        <button
                                            className="btn btn-warning btn-sm me-2"
                                            onClick={() => edit(item)}
                                        >
                                            Sửa
                                        </button>

                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() =>
                                                remove(item.maDanhMucDichVu)
                                            }
                                        >
                                            Xóa
                                        </button>
                                    </td>
                                </tr>
                            ))}

                            {filteredDanhMuc.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="text-center py-4">
                                        Không tìm thấy danh mục dịch vụ phù hợp
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

export default AdminDanhMucDichVuPage;