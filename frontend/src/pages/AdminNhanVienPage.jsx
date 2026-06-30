import { useEffect, useState } from "react";
import {
    getAllNhanVien,
    createNhanVien,
    updateNhanVien,
    deleteNhanVien
} from "../api/adminNhanVienApi";
import { getAllServices } from "../api/dichVuApi";
import {
    getDichVuTheoNhanVien,
    ganDichVuChoNhanVien
} from "../api/chiTietNvdvApi";

function AdminNhanVienPage() {
    const [nhanVien, setNhanVien] = useState([]);
    const [dichVu, setDichVu] = useState([]);
    const [selectedDichVu, setSelectedDichVu] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [keywordDichVu, setKeywordDichVu] = useState("");

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
            const dvRes = await getAllServices();

            console.log("NHAN VIEN:", nvRes.data);
            console.log("DICH VU:", dvRes.data);

            const nvList = Array.isArray(nvRes.data)
                ? nvRes.data
                : nvRes.data.data || [];

            const dvList = Array.isArray(dvRes.data)
                ? dvRes.data
                : dvRes.data.data || [];

            setNhanVien(nvList);

            setDichVu(
                dvList.filter((item) => item.trangThai === 1)
            );
        } catch (error) {
            console.log("Lỗi load nhân viên/dịch vụ:", error);
            alert(error.response?.data || "Không tải được dữ liệu nhân viên hoặc dịch vụ");
        }
    };

    const change = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const toggleDichVu = (maDichVu) => {
        if (selectedDichVu.includes(maDichVu)) {
            setSelectedDichVu(selectedDichVu.filter((id) => id !== maDichVu));
        } else {
            setSelectedDichVu([...selectedDichVu, maDichVu]);
        }
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

        setSelectedDichVu([]);
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

        let maNhanVien;

        if (editingId) {
            await updateNhanVien(editingId, data);
            maNhanVien = editingId;
            alert("Cập nhật nhân viên thành công");
        } else {
            const res = await createNhanVien(data);
            maNhanVien = res.data.maNhanVien;
            alert("Thêm nhân viên thành công");
        }

        await ganDichVuChoNhanVien({
            maNhanVien,
            danhSachMaDichVu: selectedDichVu
        });

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

        const res = await getDichVuTheoNhanVien(item.maNhanVien);

        setSelectedDichVu(
            res.data.map((ct) => ct.dichVu.maDichVu)
        );

        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const remove = async (id) => {
        if (!window.confirm("Bạn có chắc muốn xóa nhân viên này?")) return;

        await deleteNhanVien(id);
        alert("Xóa nhân viên thành công");
        loadData();
    };

    const filteredDichVu = dichVu.filter((item) =>
        item.tenDichVu?.toLowerCase().includes(keywordDichVu.toLowerCase())
    );

    const isAllSelected =
        dichVu.length > 0 &&
        dichVu.every((item) => selectedDichVu.includes(item.maDichVu));

    const toggleAllDichVu = () => {
        if (isAllSelected) {
            setSelectedDichVu([]);
        } else {
            setSelectedDichVu(dichVu.map((item) => item.maDichVu));
        }
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

                                <div className="col-md-12 mb-3">
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <label className="form-label fw-bold mb-0">
                                            Dịch vụ nhân viên có thể làm
                                        </label>

                                        <button
                                            type="button"
                                            className="btn btn-sm btn-outline-dark"
                                            onClick={toggleAllDichVu}
                                        >
                                            {isAllSelected ? "Bỏ chọn tất cả" : "Chọn tất cả"}
                                        </button>
                                    </div>

                                    <input
                                        className="form-control mb-3"
                                        placeholder="Tìm dịch vụ..."
                                        value={keywordDichVu}
                                        onChange={(e) => setKeywordDichVu(e.target.value)}
                                    />

                                    <div
                                        className="border rounded p-3"
                                        style={{
                                            maxHeight: "260px",
                                            overflowY: "auto",
                                            background: "#fff"
                                        }}
                                    >
                                        <div className="row">
                                            {filteredDichVu.map((item) => (
                                                <div className="col-md-6 mb-2" key={item.maDichVu}>
                                                    <label className="d-flex align-items-center border rounded p-2 h-100">
                                                        <input
                                                            type="checkbox"
                                                            className="me-2"
                                                            checked={selectedDichVu.includes(item.maDichVu)}
                                                            onChange={() => toggleDichVu(item.maDichVu)}
                                                        />

                                                        <span>{item.tenDichVu}</span>
                                                    </label>
                                                </div>
                                            ))}

                                            {filteredDichVu.length === 0 && (
                                                <div className="col-12 text-center text-muted py-3">
                                                    Không tìm thấy dịch vụ
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <small className="text-muted">
                                        Đã chọn {selectedDichVu.length}/{dichVu.length} dịch vụ
                                    </small>
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

            <table className="table table-bordered table-hover">
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
                    {nhanVien.map((item) => (
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

                    {nhanVien.length === 0 && (
                        <tr>
                            <td colSpan="8" className="text-center py-4">
                                Chưa có nhân viên nào
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default AdminNhanVienPage;