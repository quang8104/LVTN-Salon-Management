import { useEffect, useState } from "react";
import {
    getAllNhanVien,
    createNhanVien,
    updateNhanVien,
    deleteNhanVien
} from "../api/adminNhanVienApi";

function AdminNhanVienPage() {
    const [nhanVien, setNhanVien] = useState([]);
    const [editingId, setEditingId] = useState(null);

    const [form, setForm] = useState({
        email: "",
        matKhau: "",
        hoTen: "",
        sdt: "",
        chuyenMon: "",
        trangThai: 1,
        vaiTro: "NHAN_VIEN"
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const res = await getAllNhanVien();
        setNhanVien(res.data);
    };

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
            chuyenMon: "",
            trangThai: 1,
            vaiTro: "NHAN_VIEN"
        });
        setEditingId(null);
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

    const edit = (item) => {
        setEditingId(item.maNhanVien);
        setForm({
            email: item.email || "",
            matKhau: "",
            hoTen: item.hoTen || "",
            sdt: item.sdt || "",
            chuyenMon: item.chuyenMon || "",
            trangThai: item.trangThai ?? 1,
            vaiTro: item.vaiTro || "NHAN_VIEN"
        });
    };

    const remove = async (id) => {
        if (!window.confirm("Bạn có chắc muốn xóa nhân viên này?")) return;

        await deleteNhanVien(id);
        alert("Xóa nhân viên thành công");
        loadData();
    };

    return (
        <div className="container py-4">
            <h2 className="mb-4">Quản lý nhân viên</h2>

            <div className="card mb-4">
                <div className="card-header">
                    {editingId ? "Cập nhật nhân viên" : "Thêm nhân viên"}
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

                            <div className="col-md-6 mb-3">
                                <label>Chuyên môn</label>
                                <input
                                    className="form-control"
                                    name="chuyenMon"
                                    value={form.chuyenMon}
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
                        <th>Họ tên</th>
                        <th>Email</th>
                        <th>SĐT</th>
                        <th>Chuyên môn</th>
                        <th>Trạng thái</th>
                        <th>Vai trò</th>
                        <th>Thao tác</th>
                    </tr>
                </thead>

                <tbody>
                    {nhanVien.map((item) => (
                        <tr key={item.maNhanVien}>
                            <td>{item.maNhanVien}</td>
                            <td>{item.hoTen}</td>
                            <td>{item.email}</td>
                            <td>{item.sdt}</td>
                            <td>{item.chuyenMon}</td>
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
                </tbody>
            </table>
        </div>
    );
}

export default AdminNhanVienPage;