import { useEffect, useState } from "react";
import {
    getAllDanhMuc,
    createDanhMuc,
    updateDanhMuc,
    deleteDanhMuc
} from "../api/danhMucApi";

function AdminDanhMucPage() {
    const [danhMuc, setDanhMuc] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
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
        const res = await getAllDanhMuc();
        setDanhMuc(res.data);
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

    const submit = async (e) => {
        e.preventDefault();

        const data = {
            ...form,
            trangThai: Number(form.trangThai)
        };

        if (editingId) {
            await updateDanhMuc(editingId, data);
            alert("Cập nhật danh mục thành công");
        } else {
            await createDanhMuc(data);
            alert("Thêm danh mục thành công");
        }

        resetForm();
        loadData();
    };

    const edit = (item) => {
        setEditingId(item.maDanhMuc);
        setShowForm(true);
        setForm({
            tenDanhMuc: item.tenDanhMuc || "",
            moTa: item.moTa || "",
            trangThai: item.trangThai ?? 1
        });
    };

    const remove = async (id) => {
        if (!window.confirm("Bạn có chắc muốn xóa danh mục này?")) return;

        try {
            await deleteDanhMuc(id);
            alert("Xóa danh mục thành công");
            loadData();
        } catch (error) {
            alert("Không thể xóa danh mục đang có sản phẩm");
        }
    };

    const filteredDanhMuc = danhMuc.filter((item) => {
        const text = keyword.toLowerCase();

        return (
            String(item.maDanhMuc).includes(text) ||
            item.tenDanhMuc?.toLowerCase().includes(text) ||
            item.moTa?.toLowerCase().includes(text)
        );
    });

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="mb-1">Quản lý danh mục</h2>
                </div>

                {!showForm && (
                    <button
                        className="btn btn-dark"
                        onClick={() => setShowForm(true)}
                    >
                        + Thêm danh mục
                    </button>
                )}
            </div>

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

            {showForm && (
                <div className="card border-0 shadow-sm mb-4">
                    <div className="card-header bg-white fw-bold">
                        {editingId ? "Cập nhật danh mục" : "Thêm danh mục"}
                    </div>

                    <div className="card-body">
                        <form onSubmit={submit}>
                            <div className="row">
                                <div className="col-md-5 mb-3">
                                    <label className="form-label">
                                        Tên danh mục
                                    </label>
                                    <input
                                        className="form-control"
                                        name="tenDanhMuc"
                                        value={form.tenDanhMuc}
                                        onChange={change}
                                        required
                                    />
                                </div>

                                <div className="col-md-3 mb-3">
                                    <label className="form-label">
                                        Trạng thái
                                    </label>
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

            <div className="card border-0 shadow-sm">
                <div className="card-header bg-white fw-bold">
                    Danh sách danh mục
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
                                <tr key={item.maDanhMuc}>
                                    <td>{item.maDanhMuc}</td>
                                    <td className="fw-semibold">
                                        {item.tenDanhMuc}
                                    </td>
                                    <td>{item.moTa}</td>
                                    <td>
                                        <span
                                            className={
                                                item.trangThai === 1
                                                    ? "badge bg-success"
                                                    : "badge bg-secondary"
                                            }
                                        >
                                            {item.trangThai === 1
                                                ? "Hoạt động"
                                                : "Ngừng"}
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
                                                remove(item.maDanhMuc)
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
                                        Chưa có danh mục nào
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

export default AdminDanhMucPage;