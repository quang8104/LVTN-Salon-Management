import { useEffect, useState } from "react";
import {
    getAllSanPham,
    createSanPham,
    updateSanPham,
    deleteSanPham
} from "../api/adminSanPhamApi";

function AdminSanPhamPage() {
    const [sanPham, setSanPham] = useState([]);
    const [editingId, setEditingId] = useState(null);

    const [form, setForm] = useState({
        tenSanPham: "",
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
        const res = await getAllSanPham();
        setSanPham(res.data);
    };

    const change = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const resetForm = () => {
        setForm({
            tenSanPham: "",
            moTa: "",
            gia: "",
            hinhAnh: "",
            trangThai: 1,
            soLuongTon: ""
        });
        setEditingId(null);
    };

    const submit = async (e) => {
        e.preventDefault();

        const data = {
            ...form,
            gia: Number(form.gia),
            trangThai: Number(form.trangThai),
            soLuongTon: Number(form.soLuongTon)
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
        setForm({
            tenSanPham: item.tenSanPham || "",
            moTa: item.moTa || "",
            gia: item.gia || "",
            hinhAnh: item.hinhAnh || "",
            trangThai: item.trangThai ?? 1,
            soLuongTon: item.soLuongTon || ""
        });
    };

    const remove = async (id) => {
        if (!window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) return;

        await deleteSanPham(id);
        alert("Xóa sản phẩm thành công");
        loadData();
    };

    return (
        <div className="container py-4">
            <h2 className="mb-4">Quản lý sản phẩm</h2>

            <div className="card mb-4">
                <div className="card-header">
                    {editingId ? "Cập nhật sản phẩm" : "Thêm sản phẩm"}
                </div>

                <div className="card-body">
                    <form onSubmit={submit}>
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label>Tên sản phẩm</label>
                                <input
                                    className="form-control"
                                    name="tenSanPham"
                                    value={form.tenSanPham}
                                    onChange={change}
                                    required
                                />
                            </div>

                            <div className="col-md-3 mb-3">
                                <label>Giá</label>
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
                                <label>Số lượng tồn</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    name="soLuongTon"
                                    value={form.soLuongTon}
                                    onChange={change}
                                    required
                                />
                            </div>

                            <div className="col-md-6 mb-3">
                                <label>Hình ảnh</label>
                                <input
                                    className="form-control"
                                    name="hinhAnh"
                                    value={form.hinhAnh}
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
                                    <option value={1}>Hoạt động</option>
                                    <option value={0}>Ngừng</option>
                                </select>
                            </div>

                            <div className="col-md-12 mb-3">
                                <label>Mô tả</label>
                                <textarea
                                    className="form-control"
                                    name="moTa"
                                    value={form.moTa}
                                    onChange={change}
                                />
                            </div>
                        </div>

                        <button className="btn btn-primary me-2">
                            {editingId ? "Cập nhật" : "Thêm"}
                        </button>

                        {editingId && (
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={resetForm}
                            >
                                Hủy sửa
                            </button>
                        )}
                    </form>
                </div>
            </div>

            <table className="table table-bordered table-hover">
                <thead className="table-dark">
                    <tr>
                        <th>Mã</th>
                        <th>Tên</th>
                        <th>Giá</th>
                        <th>Tồn kho</th>
                        <th>Trạng thái</th>
                        <th>Thao tác</th>
                    </tr>
                </thead>

                <tbody>
                    {sanPham.map((item) => (
                        <tr key={item.maSanPham}>
                            <td>{item.maSanPham}</td>
                            <td>{item.tenSanPham}</td>
                            <td>{item.gia?.toLocaleString()} VNĐ</td>
                            <td>{item.soLuongTon}</td>
                            <td>
                                {item.trangThai === 1
                                    ? "Hoạt động"
                                    : "Ngừng"}
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
                                    onClick={() => remove(item.maSanPham)}
                                >
                                    Xóa
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default AdminSanPhamPage;