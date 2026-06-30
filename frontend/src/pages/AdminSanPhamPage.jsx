import { useEffect, useState } from "react";
import {
    getAllSanPham,
    createSanPham,
    updateSanPham,
    deleteSanPham
} from "../api/adminSanPhamApi";
import { getActiveDanhMuc } from "../api/danhMucApi";

function AdminSanPhamPage() {
    const [sanPham, setSanPham] = useState([]);
    const [danhMuc, setDanhMuc] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [keyword, setKeyword] = useState("");

    const [form, setForm] = useState({
        tenSanPham: "",
        maDanhMuc: "",
        moTa: "",
        gia: "",
        hinhAnh: "",
        trangThai: 1,
        soLuongTon: ""
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const sp = await getAllSanPham();
        const dm = await getActiveDanhMuc();

        setSanPham(sp.data);
        setDanhMuc(dm.data);
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
                hinhAnh: reader.result
            });
        };

        reader.readAsDataURL(file);
    };

    const openCreateForm = () => {
        resetForm();
        setShowForm(true);
    };

    const resetForm = () => {
        setForm({
            tenSanPham: "",
            maDanhMuc: "",
            moTa: "",
            gia: "",
            hinhAnh: "",
            trangThai: 1,
            soLuongTon: ""
        });

        setEditingId(null);
        setShowForm(false);
    };

    const submit = async (e) => {
        e.preventDefault();

        if (!form.maDanhMuc) {
            alert("Vui lòng chọn danh mục");
            return;
        }

        const data = {
            tenSanPham: form.tenSanPham,
            moTa: form.moTa,
            gia: Number(form.gia),
            hinhAnh: form.hinhAnh,
            trangThai: Number(form.trangThai),
            soLuongTon: Number(form.soLuongTon),
            maDanhMuc: Number(form.maDanhMuc)
        };

        if (editingId) {
            await updateSanPham(editingId, data);
            alert("Cập nhật sản phẩm thành công");
        } else {
            await createSanPham(data);
            alert("Thêm sản phẩm thành công");
        }

        resetForm();
        loadData();
    };

    const edit = (item) => {
        setEditingId(item.maSanPham);
        setShowForm(true);

        setForm({
            tenSanPham: item.tenSanPham || "",
            maDanhMuc: item.danhMuc?.maDanhMuc || "",
            moTa: item.moTa || "",
            gia: item.gia || "",
            hinhAnh: item.hinhAnh || "",
            trangThai: item.trangThai ?? 1,
            soLuongTon: item.soLuongTon || ""
        });

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    const remove = async (id) => {
        if (!window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) return;

        try {
            const res = await deleteSanPham(id);

            alert(res.data);

            loadData();
        } catch (error) {
            console.log(error);
            alert(error.response?.data || "Xóa sản phẩm thất bại");
        }
    };

    const filteredSanPham = sanPham.filter((item) => {
        const text = keyword.toLowerCase();

        return (
            item.tenSanPham?.toLowerCase().includes(text) ||
            item.danhMuc?.tenDanhMuc?.toLowerCase().includes(text) ||
            String(item.maSanPham).includes(text)
        );
    });

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="mb-1">Quản lý sản phẩm</h2>
                </div>

                {!showForm && (
                    <button className="btn btn-primary" onClick={openCreateForm}>
                        + Thêm sản phẩm
                    </button>
                )}
            </div>

            <div className="card border-0 shadow-sm mb-3">
                <div className="card-body">
                    <input
                        className="form-control"
                        placeholder="Tìm theo mã, tên sản phẩm hoặc danh mục..."
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                    />
                </div>
            </div>

            {showForm && (

                
                <div className="card border-0 shadow-sm mb-4">
                    <div className="card-header bg-white fw-bold d-flex justify-content-between align-items-center">
                        <span>
                            {editingId ? "Cập nhật sản phẩm" : "Thêm sản phẩm"}
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
                                    <label className="form-label">Tên sản phẩm</label>
                                    <input
                                        className="form-control"
                                        name="tenSanPham"
                                        value={form.tenSanPham}
                                        onChange={change}
                                        required
                                    />
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Danh mục</label>
                                    <select
                                        className="form-select"
                                        name="maDanhMuc"
                                        value={form.maDanhMuc}
                                        onChange={change}
                                        required
                                    >
                                        <option value="">-- Chọn danh mục --</option>

                                        {danhMuc.map((item) => (
                                            <option
                                                key={item.maDanhMuc}
                                                value={item.maDanhMuc}
                                            >
                                                {item.tenDanhMuc}
                                            </option>
                                        ))}
                                    </select>
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
                                    <label className="form-label">Số lượng tồn</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        name="soLuongTon"
                                        value={form.soLuongTon}
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

                                <div className="col-md-8 mb-3">
                                    <label className="form-label">Hình ảnh sản phẩm</label>
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
                                        {form.hinhAnh ? (
                                            <img
                                                src={form.hinhAnh}
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
                    <span>Danh sách sản phẩm</span>
                    <span className="badge bg-primary">
                        {sanPham.length} sản phẩm
                    </span>
                </div>

                <div className="card-body p-0">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-dark">
                            <tr>
                                <th>Mã</th>
                                <th>Ảnh</th>
                                <th>Tên</th>
                                <th>Danh mục</th>
                                <th>Giá</th>
                                <th>Tồn kho</th>
                                <th>Trạng thái</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredSanPham.map((item) => (
                                <tr key={item.maSanPham}>
                                    <td>{item.maSanPham}</td>

                                    <td>
                                        {item.hinhAnh ? (
                                            <img
                                                src={item.hinhAnh}
                                                alt={item.tenSanPham}
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
                                        {item.tenSanPham}
                                    </td>

                                    <td>
                                        {item.danhMuc?.tenDanhMuc || "-"}
                                    </td>

                                    <td>
                                        {item.gia?.toLocaleString()} VNĐ
                                    </td>

                                    <td>{item.soLuongTon}</td>

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
                                                remove(item.maSanPham)
                                            }
                                        >
                                            Xóa
                                        </button>
                                    </td>
                                </tr>
                            ))}

                            {filteredSanPham.length === 0 && (
                                <tr>
                                    <td colSpan="8" className="text-center py-4">
                                        Chưa có sản phẩm nào
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

export default AdminSanPhamPage;