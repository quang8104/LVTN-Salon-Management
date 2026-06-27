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

    const [form, setForm] = useState({
        tenDichVu: "",
        moTa: "",
        gia: "",
        thoiGianThucHien: "",
        anhGioiThieu: "",
        trangThai: 1
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

    const resetForm = () => {
        setForm({
            tenDichVu: "",
            moTa: "",
            gia: "",
            thoiGianThucHien: "",
            anhGioiThieu: "",
            trangThai: 1
        });
        setEditingId(null);
    };

    const submit = async (e) => {
        e.preventDefault();

        const data = {
            ...form,
            gia: Number(form.gia),
            thoiGianThucHien: Number(form.thoiGianThucHien),
            trangThai: Number(form.trangThai)
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
        setForm({
            tenDichVu: item.tenDichVu || "",
            moTa: item.moTa || "",
            gia: item.gia || "",
            thoiGianThucHien: item.thoiGianThucHien || "",
            anhGioiThieu: item.anhGioiThieu || "",
            trangThai: item.trangThai ?? 1
        });
    };

    const remove = async (id) => {
        if (!window.confirm("Bạn có chắc muốn xóa dịch vụ này?")) return;

        await deleteDichVu(id);
        alert("Xóa dịch vụ thành công");
        loadData();
    };

    return (
        <div className="container py-4">
            <h2 className="mb-4">Quản lý dịch vụ</h2>

            <div className="card mb-4">
                <div className="card-header">
                    {editingId ? "Cập nhật dịch vụ" : "Thêm dịch vụ"}
                </div>

                <div className="card-body">
                    <form onSubmit={submit}>
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label>Tên dịch vụ</label>
                                <input
                                    className="form-control"
                                    name="tenDichVu"
                                    value={form.tenDichVu}
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
                                <label>Thời gian phút</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    name="thoiGianThucHien"
                                    value={form.thoiGianThucHien}
                                    onChange={change}
                                    required
                                />
                            </div>

                            <div className="col-md-6 mb-3">
                                <label>Ảnh giới thiệu</label>
                                <input
                                    className="form-control"
                                    name="anhGioiThieu"
                                    value={form.anhGioiThieu}
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
                        <th>Thời gian</th>
                        <th>Trạng thái</th>
                        <th>Thao tác</th>
                    </tr>
                </thead>

                <tbody>
                    {dichVu.map((item) => (
                        <tr key={item.maDichVu}>
                            <td>{item.maDichVu}</td>
                            <td>{item.tenDichVu}</td>
                            <td>{item.gia?.toLocaleString()} VNĐ</td>
                            <td>{item.thoiGianThucHien} phút</td>
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
                                    onClick={() => remove(item.maDichVu)}
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

export default AdminDichVuPage;