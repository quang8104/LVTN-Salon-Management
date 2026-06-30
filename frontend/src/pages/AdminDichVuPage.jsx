import { useEffect, useState } from "react";
import {
    getAllDichVu,
    createDichVu,
    updateDichVu,
    deleteDichVu
} from "../api/adminDichVuApi";

function AdminDichVuPage() {
    const [dichVu, setDichVu] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [showForm, setShowForm] = useState(false);

    const [form, setForm] = useState({
        tenDichVu: "",
        moTa: "",
        gia: "",
        thoiGianThucHien: "",
        anhGioiThieu: "",
        trangThai: 1,
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const res = await getAllDichVu();
        setDichVu(res.data);
    };

    const change = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const changeImage = (e) => {
        const file = e.target.files[0];

        if (!file) return;

        if (!file.type.startsWith("image/")) {
            alert("Vui lòng chọn file hình ảnh");
            return;
        }

        const reader = new FileReader();

        reader.onloadend = () => {
            setForm({
                ...form,
                anhGioiThieu: reader.result
            });
        };

        reader.readAsDataURL(file);
    };

    const resetForm = () => {
        setForm({
            tenDichVu: "",
            moTa: "",
            gia: "",
            thoiGianThucHien: "",
            anhGioiThieu: "",
            trangThai: 1,
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
            gia: Number(form.gia),
            thoiGianThucHien: Number(form.thoiGianThucHien),
            trangThai: Number(form.trangThai),
        };

        if (editingId) {
            await updateDichVu(editingId, data);
            alert("Cập nhật dịch vụ thành công");
        } else {
            await createDichVu(data);
            alert("Thêm dịch vụ thành công");
        }

        resetForm();
        loadData();
    };

    const edit = (item) => {
        setEditingId(item.maDichVu);
        setShowForm(true);

        setForm({
            tenDichVu: item.tenDichVu || "",
            moTa: item.moTa || "",
            gia: item.gia || "",
            thoiGianThucHien: item.thoiGianThucHien || "",
            anhGioiThieu: item.anhGioiThieu || "",
            trangThai: item.trangThai ?? 1,
        });

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    const remove = async (id) => {
        if (!window.confirm("Bạn có chắc muốn xóa dịch vụ này?")) return;

        await deleteDichVu(id);
        alert("Xóa dịch vụ thành công");
        loadData();
    };

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="mb-1">Quản lý dịch vụ</h2>
                    <p className="text-muted mb-0">
                        Thêm, cập nhật và quản lý các dịch vụ salon
                    </p>
                </div>

                {!showForm && (
                    <button className="btn btn-primary" onClick={openCreateForm}>
                        + Thêm dịch vụ
                    </button>
                )}
            </div>

            {showForm && (
                <div className="card border-0 shadow-sm mb-4">
                    <div className="card-header bg-white fw-bold d-flex justify-content-between align-items-center">
                        <span>
                            {editingId ? "Cập nhật dịch vụ" : "Thêm dịch vụ"}
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
                                    <label className="form-label">Tên dịch vụ</label>
                                    <input
                                        className="form-control"
                                        name="tenDichVu"
                                        value={form.tenDichVu}
                                        onChange={change}
                                        required
                                    />
                                </div>

                                <div className="col-md-3 mb-3">
                                    <label className="form-label">Giá</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        name="gia"
                                        value={form.gia}
                                        onChange={change}
                                        required
                                    />
                                </div>

                                <div className="col-md-3 mb-3">
                                    <label className="form-label">Thời gian thực hiện</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        name="thoiGianThucHien"
                                        value={form.thoiGianThucHien}
                                        onChange={change}
                                        required
                                    />
                                    <small className="text-muted">Đơn vị: phút</small>
                                </div>

                                <div className="col-md-8 mb-3">
                                    <label className="form-label">Ảnh giới thiệu</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="form-control"
                                        onChange={changeImage}
                                    />
                                    <small className="text-muted">
                                        Chọn ảnh từ máy tính. Nên dùng ảnh nhỏ để tránh dữ liệu quá nặng.
                                    </small>
                                </div>

                                <div className="col-md-4 mb-3">
                                    <label className="form-label">Xem trước</label>
                                    <div
                                        className="border rounded d-flex align-items-center justify-content-center bg-light"
                                        style={{ height: "170px" }}
                                    >
                                        {form.anhGioiThieu ? (
                                            <img
                                                src={form.anhGioiThieu}
                                                alt="Preview"
                                                style={{
                                                    width: "100%",
                                                    height: "100%",
                                                    objectFit: "cover",
                                                    borderRadius: "6px"
                                                }}
                                            />
                                        ) : (
                                            <span className="text-muted">
                                                Chưa chọn ảnh
                                            </span>
                                        )}
                                    </div>
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

            <div className="card border-0 shadow-sm">
                <div className="card-header bg-white fw-bold d-flex justify-content-between align-items-center">
                    <span>Danh sách dịch vụ</span>
                    <span className="badge bg-primary">{dichVu.length} dịch vụ</span>
                </div>

                <div className="card-body p-0">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-dark">
                            <tr>
                                <th>Mã</th>
                                <th>Ảnh</th>
                                <th>Tên</th>
                                <th>Giá</th>
                                <th>Thời gian</th>
                                <th>Trạng thái</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>

                        <tbody>
                            {dichVu.map((item) => (
                                <tr key={item.maDichVu}>
                                    <td>{item.maDichVu}</td>

                                    <td>
                                        {item.anhGioiThieu ? (
                                            <img
                                                src={item.anhGioiThieu}
                                                alt={item.tenDichVu}
                                                style={{
                                                    width: "70px",
                                                    height: "70px",
                                                    objectFit: "cover",
                                                    borderRadius: "10px",
                                                    border: "1px solid #e5e7eb"
                                                }}
                                            />
                                        ) : (
                                            <span className="text-muted">
                                                Không có ảnh
                                            </span>
                                        )}
                                    </td>

                                    <td className="fw-semibold">
                                        {item.tenDichVu}
                                    </td>

                                    <td>{item.gia?.toLocaleString()} VNĐ</td>

                                    <td>{item.thoiGianThucHien} phút</td>

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
                                                remove(item.maDichVu)
                                            }
                                        >
                                            Xóa
                                        </button>
                                    </td>
                                </tr>
                            ))}

                            {dichVu.length === 0 && (
                                <tr>
                                    <td colSpan="7" className="text-center py-4">
                                        Chưa có dịch vụ nào
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

export default AdminDichVuPage;