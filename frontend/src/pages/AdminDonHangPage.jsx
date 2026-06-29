import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllDonHang } from "../api/adminDonHangApi";

function AdminDonHangPage() {
    const [donHang, setDonHang] = useState([]);
    const [filter, setFilter] = useState("ALL");

    useEffect(() => {
        loadData();

        const handleNotification = (event) => {
            const notification = event.detail;

            console.log("AdminDonHangPage received:", notification);

            if (
                notification?.type === "ORDER" ||
                notification?.type === "ORDER_UPDATED" ||
                notification?.type === "ORDER_CANCELLED"
            ) {
                loadData();
            }
        };

        window.addEventListener("adminNotification", handleNotification);

        return () => {
            window.removeEventListener("adminNotification", handleNotification);
        };
    }, []);

    const loadData = async () => {
        try {
            const res = await getAllDonHang();
            setDonHang(res.data);
        } catch (error) {
            console.log(error);
        }
    };

    const trangThaiText = (value) => {
        switch (value) {
            case 0:
                return "Chờ xác nhận";
            case 1:
                return "Đã xác nhận";
            case 2:
                return "Đang giao";
            case 3:
                return "Hoàn thành";
            case 4:
                return "Đã hủy";
            default:
                return "Không xác định";
        }
    };

    const trangThaiClass = (value) => {
        switch (value) {
            case 0:
                return "badge bg-warning text-dark";
            case 1:
                return "badge bg-info text-dark";
            case 2:
                return "badge bg-primary";
            case 3:
                return "badge bg-success";
            case 4:
                return "badge bg-danger";
            default:
                return "badge bg-secondary";
        }
    };

    const thanhToanText = (item) => {
        if (item.phuongThucThanhToan === "COD") {
            return "COD";
        }

        return item.trangThaiThanhToan === 1
            ? "Đã thanh toán"
            : "Chờ thanh toán";
    };

    const thanhToanClass = (item) => {
        if (item.phuongThucThanhToan === "COD") {
            return "badge bg-secondary";
        }

        return item.trangThaiThanhToan === 1
            ? "badge bg-success"
            : "badge bg-primary";
    };

    const filteredDonHang =
        filter === "ALL"
            ? donHang
            : donHang.filter((item) => item.trangThai === Number(filter));

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="mb-1">Quản lý đơn hàng</h2>
                    <p className="text-muted mb-0">
                        Theo dõi, xác nhận thanh toán và xử lý đơn hàng.
                    </p>
                </div>

                <select
                    className="form-select"
                    style={{ width: "220px" }}
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                >
                    <option value="ALL">Tất cả trạng thái</option>
                    <option value="0">Chờ xác nhận</option>
                    <option value="1">Đã xác nhận</option>
                    <option value="2">Đang giao</option>
                    <option value="3">Hoàn thành</option>
                    <option value="4">Đã hủy</option>
                </select>
            </div>

            <div className="card border-0 shadow-sm">
                <div className="card-header bg-white fw-bold">
                    Danh sách đơn hàng
                </div>

                <div className="card-body p-0">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-dark">
                            <tr>
                                <th>Mã đơn</th>
                                <th>Khách hàng</th>
                                <th>SĐT</th>
                                <th>Tổng tiền</th>
                                <th>Thanh toán</th>
                                <th>Trạng thái</th>
                                <th>Ngày tạo</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredDonHang.map((item) => (
                                <tr key={item.maDonHang}>
                                    <td className="fw-bold">
                                        DH{item.maDonHang}
                                    </td>

                                    <td>
                                        {item.hoTenNguoiNhan ||
                                            item.khachHang?.hoTen}
                                    </td>

                                    <td>{item.soDienThoai}</td>

                                    <td className="fw-semibold">
                                        {Number(item.tongTien).toLocaleString()} VNĐ
                                    </td>

                                    <td>
                                        <span className={thanhToanClass(item)}>
                                            {thanhToanText(item)}
                                        </span>
                                    </td>

                                    <td>
                                        <span className={trangThaiClass(item.trangThai)}>
                                            {trangThaiText(item.trangThai)}
                                        </span>
                                    </td>

                                    <td>
                                        {item.ngayTao
                                            ? new Date(item.ngayTao).toLocaleString("vi-VN")
                                            : ""}
                                    </td>

                                    <td>
                                        <Link
                                            to={`/admin/don-hang/${item.maDonHang}`}
                                            className="btn btn-dark btn-sm"
                                        >
                                            Chi tiết
                                        </Link>
                                    </td>
                                </tr>
                            ))}

                            {filteredDonHang.length === 0 && (
                                <tr>
                                    <td colSpan="8" className="text-center py-4">
                                        Không có đơn hàng nào
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

export default AdminDonHangPage;