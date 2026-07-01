import { useEffect, useState } from "react";
import {
    getAllLich,
    getChiTietLich,
    getLichSuLich,
    xacNhanLich,
    huyLichAdmin,
    suaLichAdmin,
    adminTaoLich
} from "../api/adminLichApi";
import { getAllNhanVien } from "../api/adminNhanVienApi";
import { getAllDichVu } from "../api/adminDichVuApi";
import { filterBooking } from "../api/bookingApi";

function AdminLichPage() {
    const [lichHen, setLichHen] = useState([]);
    const [keyword, setKeyword] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");

    const [selectedLich, setSelectedLich] = useState(null);
    const [lichSu, setLichSu] = useState([]);

    const [showDetail, setShowDetail] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [showCreate, setShowCreate] = useState(false);

    const [nhanVienList, setNhanVienList] = useState([]);
    const [dichVuList, setDichVuList] = useState([]);

    const [createSlots, setCreateSlots] = useState([]);
    const [serviceKeyword, setServiceKeyword] = useState("");

    const today = new Date();
    const maxDate = new Date();
    maxDate.setDate(today.getDate() + 7);

    const formatDate = (date) => date.toISOString().split("T")[0];

    const minBookingDate = formatDate(today);
    const maxBookingDate = formatDate(maxDate);

    const [editForm, setEditForm] = useState({
        id: null,
        ngayHen: "",
        gioHen: "",
        maNhanVien: "",
        danhSachDichVu: [],
        lyDo: ""
    });

    const [createForm, setCreateForm] = useState({
        tenKhach: "",
        sdtKhach: "",
        maNhanVien: "",
        ngayHen: "",
        gioHen: "",
        danhSachDichVu: [],
        ghiChu: ""
    });

    useEffect(() => {
        loadData();
        loadFormData();
    }, []);

    const resetCreateForm = () => {
        setCreateForm({
            tenKhach: "",
            sdtKhach: "",
            maNhanVien: "",
            ngayHen: "",
            gioHen: "",
            danhSachDichVu: [],
            ghiChu: ""
        });

        setCreateSlots([]);
        setServiceKeyword("");
    };

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

        dataWithChiTiet.sort((a, b) => b.id - a.id);
        setLichHen(dataWithChiTiet);
    };

    const loadFormData = async () => {
        const nvRes = await getAllNhanVien();
        const dvRes = await getAllDichVu();

        const nvList = Array.isArray(nvRes.data) ? nvRes.data : nvRes.data.data || [];
        const dvList = Array.isArray(dvRes.data) ? dvRes.data : dvRes.data.data || [];

        setNhanVienList(
            nvList.filter((nv) => nv.trangThai === 1 && nv.vaiTro === "NHAN_VIEN")
        );

        setDichVuList(dvList.filter((dv) => dv.trangThai === 1));
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
            item.nguonDat?.toLowerCase().includes(text) ||
            item.ghiChu?.toLowerCase().includes(text) ||
            dichVuText?.includes(text);

        return matchStatus && matchKeyword;
    });

    const loadCreateSlots = async (nextForm = createForm) => {
        if (
            !nextForm.ngayHen ||
            !nextForm.maNhanVien ||
            nextForm.danhSachDichVu.length === 0
        ) {
            setCreateSlots([]);
            return;
        }

        try {
            const res = await filterBooking({
                selectedServices: nextForm.danhSachDichVu,
                employeeId: Number(nextForm.maNhanVien),
                date: nextForm.ngayHen
            });

            const slots = res.data.availableSlots || [];
            setCreateSlots(slots);

            if (
                nextForm.gioHen &&
                !slots.some((slot) => slot.start === nextForm.gioHen)
            ) {
                setCreateForm((prev) => ({
                    ...prev,
                    gioHen: ""
                }));
            }
        } catch (error) {
            console.log(error);
            setCreateSlots([]);
        }
    };

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

        setServiceKeyword("");
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

    const toggleDichVuCreate = (maDichVu) => {
        const exists = createForm.danhSachDichVu.includes(maDichVu);

        const nextForm = {
            ...createForm,
            gioHen: "",
            danhSachDichVu: exists
                ? createForm.danhSachDichVu.filter((id) => id !== maDichVu)
                : [...createForm.danhSachDichVu, maDichVu]
        };

        setCreateForm(nextForm);
        loadCreateSlots(nextForm);
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

    const handleAdminTaoLich = async (e) => {
        e.preventDefault();

        if (!createForm.tenKhach.trim()) {
            alert("Vui lòng nhập tên khách hàng");
            return;
        }

        if (!createForm.sdtKhach.trim()) {
            alert("Vui lòng nhập số điện thoại khách hàng");
            return;
        }

        if (!createForm.maNhanVien) {
            alert("Vui lòng chọn nhân viên");
            return;
        }

        if (!createForm.ngayHen || !createForm.gioHen) {
            alert("Vui lòng chọn ngày và giờ hẹn");
            return;
        }

        if (createForm.ngayHen < minBookingDate) {
            alert("Không được đặt lịch trong quá khứ");
            return;
        }

        if (createForm.ngayHen > maxBookingDate) {
            alert("Chỉ được đặt lịch trong vòng 7 ngày sắp tới");
            return;
        }

        if (createForm.danhSachDichVu.length === 0) {
            alert("Vui lòng chọn ít nhất một dịch vụ");
            return;
        }

        try {
            await adminTaoLich({
                tenKhach: createForm.tenKhach.trim(),
                sdtKhach: createForm.sdtKhach.trim(),
                maNhanVien: Number(createForm.maNhanVien),
                ngayHen: createForm.ngayHen,
                gioHen: createForm.gioHen,
                danhSachDichVu: createForm.danhSachDichVu,
                nguoiTao: localStorage.getItem("hoTen") || "Admin",
                ghiChu: createForm.ghiChu
            });

            alert("Tạo lịch hẹn trực tiếp thành công");

            resetCreateForm();
            setShowCreate(false);
            loadData();
        } catch (error) {
            alert(error.response?.data || "Tạo lịch hẹn thất bại");
        }
    };

    const formatSlot = (time) => {
        if (!time) return "";
        return time.slice(0, 5);
    };

    const tongTienCreate = createForm.danhSachDichVu.reduce((sum, id) => {
        const dv = dichVuList.find((x) => x.maDichVu === id);
        return sum + Number(dv?.gia || 0);
    }, 0);

    const tongThoiGianCreate = createForm.danhSachDichVu.reduce((sum, id) => {
        const dv = dichVuList.find((x) => x.maDichVu === id);
        return sum + Number(dv?.thoiGianThucHien || 0);
    }, 0);

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="mb-0">Quản lý lịch hẹn</h2>

                <button
                    className="btn btn-primary"
                    onClick={() => {
                        resetCreateForm();
                        setShowCreate(true);
                    }}
                >
                    + Thêm lịch hẹn
                </button>
            </div>

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
                                <th>Nguồn</th>
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
                                    <td>
                                        <span className="badge bg-secondary">
                                            {item.nguonDat || "ONLINE"}
                                        </span>
                                    </td>
                                    <td>{item.ngayHen}</td>
                                    <td>{item.gioHen} - {item.gioKetThucDuKien}</td>
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
                                    <td colSpan="10" className="text-center py-4">
                                        Không tìm thấy lịch hẹn phù hợp
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {showCreate && (
                <div
                    className="modal d-block"
                    tabIndex="-1"
                    style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
                >
                    <div className="modal-dialog modal-xl modal-dialog-centered">
                        <div className="modal-content">
                            <form onSubmit={handleAdminTaoLich}>
                                <div className="modal-header">
                                    <h5 className="modal-title">Thêm lịch hẹn trực tiếp</h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={() => {
                                            resetCreateForm();
                                            setShowCreate(false);
                                        }}
                                    ></button>
                                </div>

                                <div className="modal-body">
                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label>Tên khách hàng</label>
                                            <input
                                                className="form-control"
                                                value={createForm.tenKhach}
                                                onChange={(e) =>
                                                    setCreateForm({
                                                        ...createForm,
                                                        tenKhach: e.target.value
                                                    })
                                                }
                                                required
                                            />
                                        </div>

                                        <div className="col-md-6 mb-3">
                                            <label>Số điện thoại</label>
                                            <input
                                                className="form-control"
                                                value={createForm.sdtKhach}
                                                onChange={(e) =>
                                                    setCreateForm({
                                                        ...createForm,
                                                        sdtKhach: e.target.value
                                                    })
                                                }
                                                required
                                            />
                                        </div>

                                        <div className="col-md-4 mb-3">
                                            <label>Ngày hẹn</label>
                                            <input
                                                type="date"
                                                className="form-control"
                                                value={createForm.ngayHen}
                                                min={minBookingDate}
                                                max={maxBookingDate}
                                                onChange={(e) => {
                                                    const nextForm = {
                                                        ...createForm,
                                                        ngayHen: e.target.value,
                                                        gioHen: ""
                                                    };
                                                    setCreateForm(nextForm);
                                                    loadCreateSlots(nextForm);
                                                }}
                                                required
                                            />
                                            <small className="text-muted">
                                                Chỉ được đặt lịch từ hôm nay đến 7 ngày tới.
                                            </small>
                                        </div>

                                        <div className="col-md-4 mb-3">
                                            <label>Nhân viên</label>
                                            <select
                                                className="form-select"
                                                value={createForm.maNhanVien}
                                                onChange={(e) => {
                                                    const nextForm = {
                                                        ...createForm,
                                                        maNhanVien: e.target.value,
                                                        gioHen: ""
                                                    };
                                                    setCreateForm(nextForm);
                                                    loadCreateSlots(nextForm);
                                                }}
                                                required
                                            >
                                                <option value="">-- Chọn nhân viên --</option>
                                                {nhanVienList.map((nv) => (
                                                    <option key={nv.maNhanVien} value={nv.maNhanVien}>
                                                        {nv.hoTen}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="col-md-4 mb-3">
                                            <label>Giờ hẹn</label>
                                            <select
                                                className="form-select"
                                                value={createForm.gioHen}
                                                onChange={(e) =>
                                                    setCreateForm({
                                                        ...createForm,
                                                        gioHen: e.target.value
                                                    })
                                                }
                                                disabled={
                                                    !createForm.ngayHen ||
                                                    !createForm.maNhanVien ||
                                                    createForm.danhSachDichVu.length === 0
                                                }
                                                required
                                            >
                                                <option value="">-- Chọn giờ trống --</option>

                                                {createSlots.map((slot, index) => (
                                                    <option key={index} value={slot.start}>
                                                        {formatSlot(slot.start)} - {formatSlot(slot.end)}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="col-md-12 mb-3">
                                            <label>Dịch vụ</label>

                                            <input
                                                className="form-control mb-2"
                                                placeholder="Tìm dịch vụ..."
                                                value={serviceKeyword}
                                                onChange={(e) => setServiceKeyword(e.target.value)}
                                            />

                                            <div
                                                className="border rounded p-2"
                                                style={{ maxHeight: "230px", overflowY: "auto" }}
                                            >
                                                {dichVuList
                                                    .filter((dv) =>
                                                        dv.tenDichVu
                                                            ?.toLowerCase()
                                                            .includes(serviceKeyword.toLowerCase())
                                                    )
                                                    .map((dv) => {
                                                        const checked = createForm.danhSachDichVu.includes(dv.maDichVu);

                                                        return (
                                                            <div
                                                                key={dv.maDichVu}
                                                                className="d-flex justify-content-between align-items-center border-bottom py-2"
                                                            >
                                                                <label className="form-check mb-0">
                                                                    <input
                                                                        type="checkbox"
                                                                        className="form-check-input"
                                                                        checked={checked}
                                                                        onChange={() => toggleDichVuCreate(dv.maDichVu)}
                                                                    />
                                                                    <span className="form-check-label ms-2">
                                                                        {dv.tenDichVu}
                                                                    </span>
                                                                </label>

                                                                <small className="text-muted">
                                                                    {dv.thoiGianThucHien} phút - {Number(dv.gia || 0).toLocaleString()} VNĐ
                                                                </small>
                                                            </div>
                                                        );
                                                    })}
                                            </div>

                                            <div className="mt-2">
                                                <b>Tổng thời gian:</b> {tongThoiGianCreate} phút |{" "}
                                                <b>Tổng tiền:</b>{" "}
                                                <span className="text-danger fw-bold">
                                                    {tongTienCreate.toLocaleString()} VNĐ
                                                </span>
                                            </div>
                                        </div>

                                        <div className="col-md-12 mb-3">
                                            <label>Ghi chú</label>
                                            <textarea
                                                className="form-control"
                                                rows="3"
                                                value={createForm.ghiChu}
                                                onChange={(e) =>
                                                    setCreateForm({
                                                        ...createForm,
                                                        ghiChu: e.target.value
                                                    })
                                                }
                                                placeholder="Ví dụ: Khách gọi điện đặt lịch"
                                            ></textarea>
                                        </div>
                                    </div>
                                </div>

                                <div className="modal-footer">
                                    <button type="submit" className="btn btn-primary">
                                        Lưu lịch hẹn
                                    </button>

                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() => {
                                            resetCreateForm();
                                            setShowCreate(false);
                                        }}
                                    >
                                        Đóng
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

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
                                        <p><b>Nguồn đặt:</b> {selectedLich.nguonDat || "ONLINE"}</p>
                                    </div>

                                    <div className="col-md-6">
                                        <p><b>Ngày hẹn:</b> {selectedLich.ngayHen}</p>
                                        <p><b>Giờ:</b> {selectedLich.gioHen} - {selectedLich.gioKetThucDuKien}</p>
                                        <p><b>Trạng thái:</b> {trangThaiText(selectedLich.trangThai)}</p>
                                        <p><b>Người tạo:</b> {selectedLich.nguoiTao || "-"}</p>
                                    </div>
                                </div>

                                <p><b>Ghi chú:</b> {selectedLich.ghiChu || "-"}</p>

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

                                            <input
                                                className="form-control mb-2"
                                                placeholder="Tìm dịch vụ..."
                                                value={serviceKeyword}
                                                onChange={(e) => setServiceKeyword(e.target.value)}
                                            />

                                            <div
                                                className="border rounded p-2"
                                                style={{ maxHeight: "230px", overflowY: "auto" }}
                                            >
                                                {dichVuList
                                                    .filter((dv) =>
                                                        dv.tenDichVu
                                                            ?.toLowerCase()
                                                            .includes(serviceKeyword.toLowerCase())
                                                    )
                                                    .map((dv) => {
                                                        const checked = editForm.danhSachDichVu.includes(dv.maDichVu);

                                                        return (
                                                            <div
                                                                key={dv.maDichVu}
                                                                className="d-flex justify-content-between align-items-center border-bottom py-2"
                                                            >
                                                                <label className="form-check mb-0">
                                                                    <input
                                                                        type="checkbox"
                                                                        className="form-check-input"
                                                                        checked={checked}
                                                                        onChange={() => toggleDichVu(dv.maDichVu)}
                                                                    />

                                                                    <span className="form-check-label ms-2">
                                                                        {dv.tenDichVu}
                                                                    </span>
                                                                </label>

                                                                <small className="text-muted">
                                                                    {dv.thoiGianThucHien} phút -{" "}
                                                                    {Number(dv.gia || 0).toLocaleString()} VNĐ
                                                                </small>
                                                            </div>
                                                        );
                                                    })}
                                            </div>

                                            {editForm.danhSachDichVu.length > 0 && (
                                                <div className="mt-2">
                                                    <b>Đã chọn:</b>{" "}
                                                    {editForm.danhSachDichVu.map((id) => {
                                                        const dv = dichVuList.find((x) => x.maDichVu === id);

                                                        return (
                                                            <span key={id} className="badge bg-dark me-1">
                                                                {dv?.tenDichVu}
                                                            </span>
                                                        );
                                                    })}
                                                </div>
                                            )}
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