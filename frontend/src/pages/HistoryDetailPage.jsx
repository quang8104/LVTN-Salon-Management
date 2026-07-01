import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    getChiTietLichHen,
    getLichHenByKhachHang
} from "../api/lichHenApi";

function HistoryDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [lich, setLich] = useState(null);
    const [chiTiet, setChiTiet] = useState([]);

    useEffect(() => {
        loadData();
    }, [id]);

    const loadData = async () => {
        try {
            const maKhachHang =
                localStorage.getItem("maKhachHang") ||
                localStorage.getItem("maNguoiDung") ||
                localStorage.getItem("id") ||
                localStorage.getItem("userId");

            const lichRes = await getLichHenByKhachHang(maKhachHang);
            const list = Array.isArray(lichRes.data) ? lichRes.data : [];

            const current = list.find((x) => String(x.id) === String(id));

            if (!current) {
                alert("Không tìm thấy lịch hẹn");
                navigate("/lich-su");
                return;
            }

            const ctRes = await getChiTietLichHen(id);

            setLich(current);
            setChiTiet(Array.isArray(ctRes.data) ? ctRes.data : []);
        } catch (error) {
            console.log(error);
            alert("Không tải được chi tiết lịch hẹn");
        }
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

    if (!lich) return null;

    return (
        <div className="container py-4">
            <button
                className="btn btn-outline-secondary mb-3"
                onClick={() => navigate("/lich-su")}
            >
                ← Quay lại
            </button>

            <h2 className="mb-4">Chi tiết lịch hẹn LH{lich.id}</h2>

            <div className="card border-0 shadow-sm mb-4">
                <div className="card-body">
                    <p><b>Khách hàng:</b> {lich.khachHang?.hoTen}</p>
                    <p><b>Số điện thoại:</b> {lich.khachHang?.sdt}</p>
                    <p><b>Nhân viên:</b> {lich.nhanVien?.hoTen}</p>
                    <p><b>Ngày hẹn:</b> {lich.ngayHen}</p>
                    <p><b>Giờ:</b> {lich.gioHen} - {lich.gioKetThucDuKien}</p>
                    <p><b>Trạng thái:</b> {trangThaiText(lich.trangThai)}</p>
                    <p><b>Tổng tiền:</b> {Number(lich.tongTien || 0).toLocaleString()} VNĐ</p>
                </div>
            </div>

            <div className="card border-0 shadow-sm">
                <div className="card-header bg-white">
                    <b>Dịch vụ đã đặt</b>
                </div>

                <div className="card-body p-0">
                    <table className="table table-bordered mb-0">
                        <thead className="table-dark">
                            <tr>
                                <th>Tên dịch vụ</th>
                                <th>Đơn giá</th>
                                <th>Thời gian</th>
                            </tr>
                        </thead>

                        <tbody>
                            {chiTiet.map((ct, index) => (
                                <tr key={index}>
                                    <td>{ct.dichVu?.tenDichVu}</td>
                                    <td>{Number(ct.donGia || 0).toLocaleString()} VNĐ</td>
                                    <td>{ct.thoiGian} phút</td>
                                </tr>
                            ))}

                            {chiTiet.length === 0 && (
                                <tr>
                                    <td colSpan="3" className="text-center py-4">
                                        Không có chi tiết dịch vụ
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

export default HistoryDetailPage;