import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    getLichHenByKhachHang,
    huyLichKhachHang
} from "../api/lichHenApi";

function HistoryPage() {
    const navigate = useNavigate();
    const [lichHen, setLichHen] = useState([]);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const maKhachHang =
                localStorage.getItem("maKhachHang") ||
                localStorage.getItem("maNguoiDung") ||
                localStorage.getItem("id") ||
                localStorage.getItem("userId");

            if (!maKhachHang) {
                alert("Vui lòng đăng nhập");
                navigate("/login");
                return;
            }

            const res = await getLichHenByKhachHang(maKhachHang);
            const list = Array.isArray(res.data) ? res.data : [];

            list.sort((a, b) => b.id - a.id);

            setLichHen(list);
        } catch (error) {
            console.log(error);
            alert("Không tải được lịch sử lịch hẹn");
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

    const badgeClass = (value) => {
        switch (value) {
            case 0: return "badge bg-warning text-dark";
            case 1: return "badge bg-primary";
            case 2: return "badge bg-info";
            case 3: return "badge bg-success";
            case 4: return "badge bg-danger";
            default: return "badge bg-secondary";
        }
    };

    const handleHuy = async (id) => {
        if (!window.confirm("Bạn có chắc muốn hủy lịch hẹn này?")) return;

        try {
            await huyLichKhachHang(id);
            alert("Hủy lịch hẹn thành công");
            loadData();
        } catch (error) {
            alert(error.response?.data || "Chỉ được hủy lịch khi đang chờ xác nhận");
        }
    };

    return (
        <div className="container py-4">
            <h2 className="mb-4">Lịch sử lịch đặt</h2>

            <div className="card border-0 shadow-sm">
                <div className="card-body p-0">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-dark">
                            <tr>
                                <th>Mã lịch</th>
                                <th>Nhân viên</th>
                                <th>Ngày</th>
                                <th>Giờ</th>
                                <th>Tổng tiền</th>
                                <th>Trạng thái</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>

                        <tbody>
                            {lichHen.map((item) => (
                                <tr key={item.id}>
                                    <td>LH{item.id}</td>
                                    <td>{item.nhanVien?.hoTen}</td>
                                    <td>{item.ngayHen}</td>
                                    <td>{item.gioHen} - {item.gioKetThucDuKien}</td>
                                    <td>{Number(item.tongTien || 0).toLocaleString()} VNĐ</td>
                                    <td>
                                        <span className={badgeClass(item.trangThai)}>
                                            {trangThaiText(item.trangThai)}
                                        </span>
                                    </td>
                                    <td>
                                        <button
                                            className="btn btn-secondary btn-sm me-2"
                                            onClick={() => navigate(`/lich-su/${item.id}`)}
                                        >
                                            Chi tiết
                                        </button>

                                        {item.trangThai === 0 && (
                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => handleHuy(item.id)}
                                            >
                                                Hủy lịch
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}

                            {lichHen.length === 0 && (
                                <tr>
                                    <td colSpan="7" className="text-center py-4">
                                        Bạn chưa có lịch hẹn nào
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

export default HistoryPage;