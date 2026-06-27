import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getAllNhanVien } from "../api/nhanVienApi";
import { getSlotRanh } from "../api/lichApi";
import { datLich } from "../api/bookingApi";

import { useSelectedService } from "../context/SelectedServiceContext";

function BookingPage() {
    const navigate = useNavigate();

    const {
        selectedServices,
        clearServices
    } = useSelectedService();

    const [nhanViens, setNhanViens] = useState([]);
    const [slots, setSlots] = useState([]);
    const [form, setForm] = useState({
        maNhanVien: "",
        ngayHen: "",
        gioHen: ""
    });

    // 1. Load danh sách nhân viên khi component mount
    useEffect(() => {
        loadNhanVien();
    }, []);

    // 2. Tự động load slot trống khi chọn đủ nhân viên và ngày hẹn
    useEffect(() => {
        if (form.maNhanVien && form.ngayHen) {
            loadSlot();
        }
    }, [form.maNhanVien, form.ngayHen]);

    // Tính toán tổng tiền và tổng thời gian
    const tongTien = selectedServices.reduce(
        (sum, item) => sum + item.gia,
        0
    );

    const tongThoiGian = selectedServices.reduce(
        (sum, item) => sum + item.thoiGianThucHien,
        0
    );

    // Hàm gọi API lấy danh sách nhân viên
    const loadNhanVien = async () => {
        try {
            const res = await getAllNhanVien();
            setNhanViens(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    // Hàm gọi API lấy danh sách slot giờ trống
    const loadSlot = async () => {
        try {
            const res = await getSlotRanh(form.maNhanVien, form.ngayHen);
            setSlots(res.data.data);
        } catch (err) {
            console.log(err);
        }
    };

    // Xử lý thay đổi dữ liệu trong Form
    const change = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    // Xử lý gửi dữ liệu đặt lịch
    const submit = async (e) => {
        e.preventDefault();

        if (selectedServices.length === 0) {
            alert("Bạn chưa chọn dịch vụ.");
            return;
        }

        try {
            const request = {
                maKhachHang: 1, // Đang để cứng để test
                maNhanVien: Number(form.maNhanVien),
                ngayHen: form.ngayHen,
                gioHen: form.gioHen,
                ghiChu: "",
                danhSachDichVu: selectedServices.map(item => item.maDichVu)
            };

            console.log(request);
            const res = await datLich(request);
            console.log(res.data);

            alert("Đặt lịch thành công!");
            clearServices();
            navigate("/");
        } catch (err) {
            console.log(err);
            alert("Đặt lịch thất bại!");
        }
    };

    return (
        <div className="container py-5">
            <h2 className="mb-4">Đặt lịch</h2>
            
            <div className="row">
                {/* CỘT TRÁI: DANH SÁCH DỊCH VỤ ĐÃ CHỌN */}
                <div className="col-md-5">
                    <div className="card shadow-sm">
                        <div className="card-header bg-primary text-white">
                            <h5 className="mb-0">Dịch vụ đã chọn</h5>
                        </div>
                        <div className="card-body">
                            {selectedServices.length === 0 ? (
                                <p className="text-muted">Chưa có dịch vụ nào.</p>
                            ) : (
                                selectedServices.map(item => (
                                    <div key={item.maDichVu} className="border-bottom py-2">
                                        <div className="fw-bold">{item.tenDichVu}</div>
                                        <small>{item.thoiGianThucHien} phút</small>
                                        <br />
                                        <span className="text-danger">
                                            {item.gia.toLocaleString()} VNĐ
                                        </span>
                                    </div>
                                ))
                            )}
                            
                            <hr />
                            <h6>Tổng thời gian: {tongThoiGian} phút</h6>
                            <h5 className="text-danger">
                                Tổng tiền: {tongTien.toLocaleString()} VNĐ
                            </h5>
                        </div>
                    </div>
                </div>

                {/* CỘT PHẢI: FORM THÔNG TIN ĐẶT LỊCH */}
                <div className="col-md-7">
                    <div className="card shadow-sm">
                        <div className="card-header bg-success text-white">
                            <h5 className="mb-0">Thông tin đặt lịch</h5>
                        </div>
                        <div className="card-body">
                            <form onSubmit={submit}>
                                {/* Chọn Ngày Hẹn */}
                                <div className="mb-3">
                                    <label className="form-label">Ngày hẹn</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        name="ngayHen"
                                        value={form.ngayHen}
                                        onChange={change}
                                    />
                                </div>

                                {/* Chọn Nhân Viên */}
                                <div className="mb-3">
                                    <label className="form-label">Nhân viên</label>
                                    <select
                                        className="form-select"
                                        name="maNhanVien"
                                        value={form.maNhanVien}
                                        onChange={change}
                                    >
                                        <option value="">Chọn nhân viên</option>
                                        {nhanViens.map(nv => (
                                            <option key={nv.maNhanVien} value={nv.maNhanVien}>
                                                {nv.hoTen}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Chọn Giờ Hẹn */}
                                <div className="mb-4">
                                    <label className="form-label">Giờ hẹn</label>
                                    <select
                                        className="form-select"
                                        name="gioHen"
                                        value={form.gioHen}
                                        onChange={change}
                                        disabled={!form.ngayHen || !form.maNhanVien}
                                    >
                                        <option value="">Chọn giờ</option>
                                        {slots.map(slot => (
                                            <option key={slot} value={slot}>
                                                {slot}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <button type="submit" className="btn btn-success">
                                    Xác nhận đặt lịch
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BookingPage;
