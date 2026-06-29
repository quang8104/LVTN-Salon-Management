import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getDonHangByKhachHang } from "../api/donHangApi";

function MyOrderPage() {
    const [orders, setOrders] = useState([]);
    const userId = localStorage.getItem("userId");

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const res = await getDonHangByKhachHang(userId);
        setOrders(res.data);
    };

    const trangThaiText = (value) => {
        switch (value) {
            case 0: return "Chờ xác nhận";
            case 1: return "Đã xác nhận";
            case 2: return "Đang giao";
            case 3: return "Hoàn thành";
            case 4: return "Đã hủy";
            default: return "Không xác định";
        }
    };

    const thanhToanText = (item) => {
        if (item.phuongThucThanhToan === "COD") return "COD";

        return item.trangThaiThanhToan === 1
            ? "Đã thanh toán"
            : "Chờ thanh toán";
    };

    return (
        <div className="container py-5">
            <h2 className="mb-4">Đơn hàng của tôi</h2>

            <div className="card border-0 shadow-sm">
                <div className="card-body p-0">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-dark">
                            <tr>
                                <th>Mã đơn</th>
                                <th>Ngày tạo</th>
                                <th>Tổng tiền</th>
                                <th>Thanh toán</th>
                                <th>Trạng thái</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>

                        <tbody>
                            {orders.map((item) => (
                                <tr key={item.maDonHang}>
                                    <td className="fw-bold">
                                        DH{item.maDonHang}
                                    </td>

                                    <td>
                                        {item.ngayTao
                                            ? new Date(item.ngayTao).toLocaleString("vi-VN")
                                            : ""}
                                    </td>

                                    <td className="fw-semibold">
                                        {Number(item.tongTien).toLocaleString()} VNĐ
                                    </td>

                                    <td>
                                        <span
                                            className={
                                                item.trangThaiThanhToan === 1
                                                    ? "badge bg-success"
                                                    : "badge bg-primary"
                                            }
                                        >
                                            {thanhToanText(item)}
                                        </span>
                                    </td>

                                    <td>
                                        <span
                                            className={
                                                item.trangThai === 4
                                                    ? "badge bg-danger"
                                                    : item.trangThai === 3
                                                    ? "badge bg-success"
                                                    : "badge bg-warning text-dark"
                                            }
                                        >
                                            {trangThaiText(item.trangThai)}
                                        </span>
                                    </td>

                                    <td>
                                        {item.phuongThucThanhToan === "BANK_TRANSFER" &&
                                            item.trangThaiThanhToan !== 1 &&
                                            item.trangThai !== 4 && (
                                                <Link
                                                    to={`/thanh-toan-ngan-hang/${item.maDonHang}`}
                                                    className="btn btn-success btn-sm me-2"
                                                >
                                                    Tiếp tục thanh toán
                                                </Link>
                                            )}

                                        <Link
                                            to={`/don-hang-cua-toi/${item.maDonHang}`}
                                            className="btn btn-dark btn-sm"
                                        >
                                            Chi tiết
                                        </Link>
                                    </td>
                                </tr>
                            ))}

                            {orders.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="text-center py-4">
                                        Bạn chưa có đơn hàng nào
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

export default MyOrderPage;