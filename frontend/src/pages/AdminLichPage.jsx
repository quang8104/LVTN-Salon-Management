import { useEffect, useState } from "react";
import {
    getAllLich,
    getChiTietLich,
    getLichSuLich,
    xacNhanLich,
    huyLichAdmin,
    suaLichAdmin
} from "../api/adminLichApi";
import { getAllNhanVien } from "../api/adminNhanVienApi";
import { getAllDichVu } from "../api/adminDichVuApi";

function AdminLichPage() {
    const [lichHen, setLichHen] = useState([]);
    const [keyword, setKeyword] = useState("");

    const [selectedLich, setSelectedLich] = useState(null);
    const [lichSu, setLichSu] = useState([]);
    const [showDetail, setShowDetail] = useState(false);

    const [showEdit, setShowEdit] = useState(false);
    const [nhanVienList, setNhanVienList] = useState([]);
    const [dichVuList, setDichVuList] = useState([]);
    const [statusFilter, setStatusFilter] = useState("ALL");

    const [editForm, setEditForm] = useState({
        id: null,
        ngayHen: "",
        gioHen: "",
        maNhanVien: "",
        danhSachDichVu: [],
        lyDo: ""
    });

    useEffect(() => {
        loadData();
        loadFormData();
    }, []);

    const loadData = async () => {
        const res = await getAllLich();
        const list = Array.isArray(res.data) ? res.data : res.data.data || [];

        const dataWithChiTiet = await Promise.all(
            list.map(async (item) => {
                const ctRes = await getChiTietLich(item.id);
                return {
                    ...item,
                    chiTiet: ctRes.data
                };
            })
        );

        setLichHen(dataWithChiTiet);
    };

    const loadFormData = async () => {
        const nvRes = await getAllNhanVien();
        const dvRes = await getAllDichVu();

        setNhanVienList(Array.isArray(nvRes.data) ? nvRes.data : nvRes.data.data || []);
        setDichVuList(Array.isArray(dvRes.data) ? dvRes.data : dvRes.data.data || []);
    };

    const trangThaiText = (value) => {
        switch (value) {
            case 0: return "Chờ xác nhận";
            case 1: return "Đã xác nhận";
            case 2: return "Đang phục vụ";
            case 3: return "Hoàn thành";
            case 4: return "Đã hủy";
            default: return "Không xác định";
        }
    };

    const filteredLichHen = lichHen.filter((item) => {
        const text = keyword.toLowerCase().trim();

        const matchStatus =
            statusFilter === "ALL" || item.trangThai === Number(statusFilter);

        const dichVuText = item.chiTiet
            ?.map((ct) => ct.dichVu?.tenDichVu || "")
            .join(" ")
            .toLowerCase();

        const matchKeyword =
            `LH${item.id}`.toLowerCase().includes(text) ||
            item.khachHang?.hoTen?.toLowerCase().includes(text) ||
            item.khachHang?.sdt?.toLowerCase().includes(text) ||
            item.nhanVien?.hoTen?.toLowerCase().includes(text) ||
            item.ngayHen?.toLowerCase().includes(text) ||
            item.gioHen?.toLowerCase().includes(text) ||
            trangThaiText(item.trangThai).toLowerCase().includes(text) ||
            dichVuText?.includes(text);

        return matchStatus && matchKeyword;
    });

    const handleXacNhan = async (id) => {
        await xacNhanLich(id);
        alert("Xác nhận lịch thành công");
        loadData();
    };

    const handleHuy = async (id) => {
        const lyDo = prompt("Nhập lý do hủy lịch:");

        if (!lyDo || lyDo.trim() === "") {
            alert("Bạn phải nhập lý do hủy lịch");
            return;
        }

        await huyLichAdmin(id, {
            lyDo: lyDo.trim(),
            nguoiThucHien: localStorage.getItem("hoTen") || "Admin",
            vaiTro: "ADMIN"
        });

        alert("Hủy lịch thành công");
        loadData();
    };

    const handleChiTiet = async (item) => {
        const res = await getLichSuLich(item.id);

        setSelectedLich(item);
        setLichSu(Array.isArray(res.data) ? res.data : []);
        setShowDetail(true);
    };

    const openEditForm = (item) => {
        setEditForm({
            id: item.id,
            ngayHen: item.ngayHen || "",
            gioHen: item.gioHen || "",
            maNhanVien: item.nhanVien?.maNhanVien || "",
            danhSachDichVu: item.chiTiet?.map((ct) => ct.dichVu?.maDichVu) || [],
            lyDo: ""
        });

        setShowEdit(true);
    };

    const toggleDichVu = (maDichVu) => {
        const exists = editForm.danhSachDichVu.includes(maDichVu);

        setEditForm({
            ...editForm,
            danhSachDichVu: exists
                ? editForm.danhSachDichVu.filter((id) => id !== maDichVu)
                : [...editForm.danhSachDichVu, maDichVu]
        });
    };

    const handleSuaLich = async (e) => {
        e.preventDefault();

        if (!editForm.lyDo.trim()) {
            alert("Bạn phải nhập lý do sửa lịch");
            return;
        }

        if (editForm.danhSachDichVu.length === 0) {
            alert("Vui lòng chọn ít nhất một dịch vụ");
            return;
        }

        await suaLichAdmin(editForm.id, {
            ngayHen: editForm.ngayHen,
            gioHen: editForm.gioHen,
            maNhanVien: Number(editForm.maNhanVien),
            danhSachDichVu: editForm.danhSachDichVu,
            lyDo: editForm.lyDo.trim(),
            nguoiThucHien: localStorage.getItem("hoTen") || "Admin",
            vaiTro: "ADMIN"
        });

        alert("Sửa lịch thành công");
        setShowEdit(false);
        loadData();
    };

    return (
        <div>
            <h2 className="mb-4">Quản lý lịch hẹn</h2>

            <div className="card border-0 shadow-sm mb-3">
                <div className="card-body">
                    <div className="row g-2">
                        <div className="col-md-8">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Tìm theo mã, khách hàng, SĐT, nhân viên, dịch vụ, ngày, giờ hoặc trạng thái..."
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                            />
                        </div>

                        <div className="col-md-4">
                            <select
                                className="form-select"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="ALL">Tất cả lịch</option>
                                <option value="0">Chờ xác nhận</option>
                                <option value="1">Đã xác nhận</option>
                                <option value="2">Đang phục vụ</option>
                                <option value="3">Hoàn thành</option>
                                <option value="4">Đã hủy</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card border-0 shadow-sm">
                <div className="card-header bg-white d-flex justify-content-between align-items-center">
                    <b>Danh sách lịch hẹn</b>
                    <span className="badge bg-primary">
                        {filteredLichHen.length} lịch hẹn
                    </span>
                </div>

                <div className="card-body p-0">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-dark">
                            <tr>
                                <th>Mã</th>
                                <th>Khách hàng</th>
                                <th>Nhân viên</th>
                                <th>Dịch vụ</th>
                                <th>Ngày</th>
                                <th>Giờ</th>
                                <th>Tổng tiền</th>
                                <th>Trạng thái</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredLichHen.map((item) => (
                                <tr key={item.id}>
                                    <td>LH{item.id}</td>

                                    <td>
                                        <div className="fw-semibold">
                                            {item.khachHang?.hoTen}
                                        </div>
                                        <small>{item.khachHang?.sdt}</small>
                                    </td>

                                    <td>{item.nhanVien?.hoTen}</td>

                                    <td>
                                        {item.chiTiet?.map((ct, index) => (
                                            <div key={index}>
                                                - {ct.dichVu?.tenDichVu}
                                            </div>
                                        ))}
                                    </td>

                                    <td>{item.ngayHen}</td>

                                    <td>
                                        {item.gioHen} - {item.gioKetThucDuKien}
                                    </td>

                                    <td>
                                        {Number(item.tongTien || 0).toLocaleString()} VNĐ
                                    </td>

                                    <td>
                                        <span
                                            className={
                                                item.trangThai === 4
                                                    ? "badge bg-danger"
                                                    : item.trangThai === 3
                                                    ? "badge bg-success"
                                                    : item.trangThai === 2
                                                    ? "badge bg-info"
                                                    : "badge bg-warning text-dark"
                                            }
                                        >
                                            {trangThaiText(item.trangThai)}
                                        </span>
                                    </td>

                                    <td>
                                        <button
                                            className="btn btn-secondary btn-sm me-2 mb-1"
                                            onClick={() => handleChiTiet(item)}
                                        >
                                            Chi tiết
                                        </button>

                                        {item.trangThai !== 3 && item.trangThai !== 4 && (
                                            <button
                                                className="btn btn-warning btn-sm me-2 mb-1"
                                                onClick={() => openEditForm(item)}
                                            >
                                                Sửa
                                            </button>
                                        )}

                                        {item.trangThai === 0 && (
                                            <button
                                                className="btn btn-primary btn-sm me-2 mb-1"
                                                onClick={() => handleXacNhan(item.id)}
                                            >
                                                Xác nhận
                                            </button>
                                        )}

                                        {item.trangThai !== 3 && item.trangThai !== 4 && (
                                            <button
                                                className="btn btn-danger btn-sm mb-1"
                                                onClick={() => handleHuy(item.id)}
                                            >
                                                Hủy
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}

                            {filteredLichHen.length === 0 && (
                                <tr>
                                    <td colSpan="9" className="text-center py-4">
                                        Không tìm thấy lịch hẹn phù hợp
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {showDetail && selectedLich && (
                <div
                    className="modal d-block"
                    tabIndex="-1"
                    style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
                >
                    <div className="modal-dialog modal-lg modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    Chi tiết lịch hẹn LH{selectedLich.id}
                                </h5>

                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowDetail(false)}
                                ></button>
                            </div>

                            <div className="modal-body">
                                <h6>Thông tin lịch hẹn</h6>

                                <div className="row mb-3">
                                    <div className="col-md-6">
                                        <p><b>Khách hàng:</b> {selectedLich.khachHang?.hoTen}</p>
                                        <p><b>SĐT:</b> {selectedLich.khachHang?.sdt}</p>
                                        <p><b>Nhân viên:</b> {selectedLich.nhanVien?.hoTen}</p>
                                    </div>

                                    <div className="col-md-6">
                                        <p><b>Ngày hẹn:</b> {selectedLich.ngayHen}</p>
                                        <p>
                                            <b>Giờ:</b> {selectedLich.gioHen} - {selectedLich.gioKetThucDuKien}
                                        </p>
                                        <p><b>Trạng thái:</b> {trangThaiText(selectedLich.trangThai)}</p>
                                    </div>
                                </div>

                                <h6>Dịch vụ</h6>

                                <table className="table table-bordered">
                                    <thead>
                                        <tr>
                                            <th>Tên dịch vụ</th>
                                            <th>Đơn giá</th>
                                            <th>Thời gian</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {selectedLich.chiTiet?.map((ct, index) => (
                                            <tr key={index}>
                                                <td>{ct.dichVu?.tenDichVu}</td>
                                                <td>{Number(ct.donGia || 0).toLocaleString()} VNĐ</td>
                                                <td>{ct.thoiGian} phút</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                <p className="fw-bold">
                                    Tổng tiền: {Number(selectedLich.tongTien || 0).toLocaleString()} VNĐ
                                </p>

                                <hr />

                                <h6>Lịch sử thao tác</h6>

                                {lichSu.length === 0 ? (
                                    <p className="text-muted">Chưa có lịch sử thao tác</p>
                                ) : (
                                    <table className="table table-bordered">
                                        <thead>
                                            <tr>
                                                <th>Người thực hiện</th>
                                                <th>Vai trò</th>
                                                <th>Hành động</th>
                                                <th>Lý do</th>
                                                <th>Thời gian</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {lichSu.map((ls) => (
                                                <tr key={ls.maLichSu}>
                                                    <td>{ls.nguoiThucHien}</td>
                                                    <td>{ls.vaiTro}</td>
                                                    <td>{ls.hanhDong}</td>
                                                    <td>{ls.lyDo}</td>
                                                    <td>{ls.thoiGian}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>

                            <div className="modal-footer">
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => setShowDetail(false)}
                                >
                                    Đóng
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showEdit && (
                <div
                    className="modal d-block"
                    tabIndex="-1"
                    style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
                >
                    <div className="modal-dialog modal-lg modal-dialog-centered">
                        <div className="modal-content">
                            <form onSubmit={handleSuaLich}>
                                <div className="modal-header">
                                    <h5 className="modal-title">
                                        Sửa lịch hẹn LH{editForm.id}
                                    </h5>

                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={() => setShowEdit(false)}
                                    ></button>
                                </div>

                                <div className="modal-body">
                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label>Ngày hẹn</label>
                                            <input
                                                type="date"
                                                className="form-control"
                                                value={editForm.ngayHen}
                                                onChange={(e) =>
                                                    setEditForm({
                                                        ...editForm,
                                                        ngayHen: e.target.value
                                                    })
                                                }
                                                required
                                            />
                                        </div>

                                        <div className="col-md-6 mb-3">
                                            <label>Giờ hẹn</label>
                                            <input
                                                type="time"
                                                className="form-control"
                                                value={editForm.gioHen}
                                                onChange={(e) =>
                                                    setEditForm({
                                                        ...editForm,
                                                        gioHen: e.target.value
                                                    })
                                                }
                                                required
                                            />
                                        </div>

                                        <div className="col-md-12 mb-3">
                                            <label>Nhân viên</label>
                                            <select
                                                className="form-select"
                                                value={editForm.maNhanVien}
                                                onChange={(e) =>
                                                    setEditForm({
                                                        ...editForm,
                                                        maNhanVien: e.target.value
                                                    })
                                                }
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

                                        <div className="col-md-12 mb-3">
                                            <label>Dịch vụ</label>

                                            <div className="row mt-2">
                                                {dichVuList.map((dv) => (
                                                    <div
                                                        className="col-md-6 mb-2"
                                                        key={dv.maDichVu}
                                                    >
                                                        <label className="form-check">
                                                            <input
                                                                type="checkbox"
                                                                className="form-check-input"
                                                                checked={editForm.danhSachDichVu.includes(dv.maDichVu)}
                                                                onChange={() => toggleDichVu(dv.maDichVu)}
                                                            />

                                                            <span className="form-check-label">
                                                                {dv.tenDichVu} - {Number(dv.gia || 0).toLocaleString()} VNĐ
                                                            </span>
                                                        </label>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="col-md-12 mb-3">
                                            <label>Lý do sửa lịch</label>
                                            <textarea
                                                className="form-control"
                                                rows="3"
                                                value={editForm.lyDo}
                                                onChange={(e) =>
                                                    setEditForm({
                                                        ...editForm,
                                                        lyDo: e.target.value
                                                    })
                                                }
                                                required
                                            ></textarea>
                                        </div>
                                    </div>
                                </div>

                                <div className="modal-footer">
                                    <button type="submit" className="btn btn-primary">
                                        Lưu thay đổi
                                    </button>

                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() => setShowEdit(false)}
                                    >
                                        Đóng
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminLichPage;