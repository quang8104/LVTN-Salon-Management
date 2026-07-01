import { useEffect, useState } from "react";
import {
    getAllNghiPhepNhanVien,
    createNghiPhepNhanVien,
    deleteNghiPhepNhanVien
} from "../api/adminNghiPhepNhanVienApi";
import { getAllNhanVien } from "../api/adminNhanVienApi";

function AdminNghiPhepNhanVienPage() {
    const [list, setList] = useState([]);
    const [nhanVienList, setNhanVienList] = useState([]);

    const [form, setForm] = useState({
        maNhanVien: "",
        ngayBatDau: "",
        ngayKetThuc: "",
        lyDo: ""
    });

    useEffect(() => {
        loadData();
        loadNhanVien();
    }, []);

    const today = new Date().toISOString().split("T")[0];

    const loadData = async () => {
        const res = await getAllNghiPhepNhanVien();
        setList(Array.isArray(res.data) ? res.data : []);
    };

    const loadNhanVien = async () => {
        const res = await getAllNhanVien();
        const data = Array.isArray(res.data) ? res.data : res.data.data || [];

        setNhanVienList(
            data.filter((nv) => nv.trangThai === 1 && nv.vaiTro === "NHAN_VIEN")
        );
    };

    const change = (e) => {
        const { name, value } = e.target;

        if (name === "ngayBatDau") {
            setForm((prev) => ({
                ...prev,
                ngayBatDau: value,
                ngayKetThuc:
                    prev.ngayKetThuc && prev.ngayKetThuc < value
                        ? ""
                        : prev.ngayKetThuc
            }));
            return;
        }

        setForm((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const submit = async (e) => {
        e.preventDefault();

        if (!form.maNhanVien || !form.ngayBatDau || !form.ngayKetThuc) {
            alert("Vui lòng chọn nhân viên, ngày bắt đầu và ngày kết thúc");
            return;
        }

        if (form.ngayKetThuc < form.ngayBatDau) {
            alert("Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu");
            return;
        }

        try {
            await createNghiPhepNhanVien({
                maNhanVien: Number(form.maNhanVien),
                ngayBatDau: form.ngayBatDau,
                ngayKetThuc: form.ngayKetThuc,
                lyDo: form.lyDo
            });

            alert("Thêm lịch nghỉ thành công");

            setForm({
                maNhanVien: "",
                ngayBatDau: "",
                ngayKetThuc: "",
                lyDo: ""
            });

            loadData();
        } catch (error) {
            alert(error.response?.data || "Nhân viên có lịch hẹn vào ngày này, không thể nghỉ");
        }
    };

    const remove = async (id) => {
        if (!window.confirm("Bạn có chắc muốn xóa lịch nghỉ này?")) return;

        await deleteNghiPhepNhanVien(id);
        alert("Xóa lịch nghỉ thành công");
        loadData();
    };

    return (
        <div>
            <h2 className="mb-4">Quản lý nghỉ phép nhân viên</h2>

            <div className="card border-0 shadow-sm mb-4">
                <div className="card-header bg-white fw-bold">
                    Thêm lịch nghỉ
                </div>

                <div className="card-body">
                    <form onSubmit={submit}>
                        <div className="row">
                            <div className="col-md-3 mb-3">
                                <label className="form-label">Nhân viên</label>
                                <select
                                    className="form-select"
                                    name="maNhanVien"
                                    value={form.maNhanVien}
                                    onChange={change}
                                    required
                                >
                                    <option value="">-- Chọn nhân viên --</option>

                                    {nhanVienList.map((nv) => (
                                        <option
                                            key={nv.maNhanVien}
                                            value={nv.maNhanVien}
                                        >
                                            {nv.hoTen}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="col-md-3 mb-3">
                                <label className="form-label">Từ ngày</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    name="ngayBatDau"
                                    value={form.ngayBatDau}
                                    onChange={change}
                                    min={today}
                                    required
                                />
                            </div>

                            <div className="col-md-3 mb-3">
                                <label className="form-label">Đến ngày</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    name="ngayKetThuc"
                                    value={form.ngayKetThuc}
                                    onChange={change}
                                    min={form.ngayBatDau || today}
                                    required
                                />
                            </div>

                            <div className="col-md-3 mb-3">
                                <label className="form-label">Lý do</label>
                                <input
                                    className="form-control"
                                    name="lyDo"
                                    value={form.lyDo}
                                    onChange={change}
                                    placeholder="Ví dụ: Nghỉ lễ, nghỉ phép..."
                                />
                            </div>
                        </div>

                        <button className="btn btn-primary">
                            + Thêm lịch nghỉ
                        </button>
                    </form>
                </div>
            </div>

            <div className="card border-0 shadow-sm">
                <div className="card-header bg-white d-flex justify-content-between align-items-center">
                    <b>Danh sách lịch nghỉ</b>
                    <span className="badge bg-primary">
                        {list.length} lịch nghỉ
                    </span>
                </div>

                <div className="card-body p-0">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-dark">
                            <tr>
                                <th>Mã</th>
                                <th>Nhân viên</th>
                                <th>Từ ngày</th>
                                <th>Đến ngày</th>
                                <th>Lý do</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>

                        <tbody>
                            {list.map((item) => (
                                <tr key={item.maNghiPhep}>
                                    <td>NP{item.maNghiPhep}</td>
                                    <td>{item.nhanVien?.hoTen}</td>
                                    <td>{item.ngayBatDau}</td>
                                    <td>{item.ngayKetThuc}</td>
                                    <td>{item.lyDo || "-"}</td>
                                    <td>
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => remove(item.maNghiPhep)}
                                        >
                                            Xóa
                                        </button>
                                    </td>
                                </tr>
                            ))}

                            {list.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="text-center py-4">
                                        Chưa có lịch nghỉ nào
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

export default AdminNghiPhepNhanVienPage;