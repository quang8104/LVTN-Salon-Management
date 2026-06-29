import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
    getDonHangById,
    getChiTietDonHang,
    huyDonHang
} from "../api/donHangApi";

function MyOrderDetailPage() {
    const { id } = useParams();

    const [donHang, setDonHang] = useState(null);
    const [chiTiet, setChiTiet] = useState([]);
    const [countdown, setCountdown] = useState("00:00");
    const [percent, setPercent] = useState(100);

    useEffect(() => {
        loadData();
    }, [id]);

    useEffect(() => {
        if (!donHang) return;

        const timer = setInterval(() => {
            const total = 10 * 60 * 1000;
            const endTime = new Date(donHang.ngayTao).getTime() + total;
            const remain = endTime - Date.now();

            if (remain <= 0) {
                setCountdown("00:00");
                setPercent(0);
                clearInterval(timer);
                return;
            }

            const minute = Math.floor(remain / 60000);
            const second = Math.floor((remain % 60000) / 1000);

            setCountdown(
                `${String(minute).padStart(2, "0")}:${String(second).padStart(2, "0")}`
            );

            setPercent(Math.max(0, Math.floor((remain / total) * 100)));
        }, 1000);

        return () => clearInterval(timer);
    }, [donHang]);

    const loadData = async () => {
        try {
            const dhRes = await getDonHangById(id);
            const ctRes = await getChiTietDonHang(id);

            setDonHang(dhRes.data);
            setChiTiet(ctRes.data);
        } catch (error) {
            console.log(error);
        }
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

    const progressClass = () => {
        if (percent <= 20) return "bg-danger";
        if (percent <= 50) return "bg-warning";
        return "bg-success";
    };

    const khachHuyDon = async () => {
        if (!window.confirm("Bạn có chắc muốn hủy đơn hàng này?")) return;

        try {
            await huyDonHang(donHang.maDonHang);
            alert("Hủy đơn hàng thành công");
            loadData();
        } catch (error) {
            console.log(error);
            alert(error.response?.data || "Không thể hủy đơn hàng");
        }
    };

    const isWaitingPayment =
        donHang?.phuongThucThanhToan === "BANK_TRANSFER" &&
        donHang?.trangThaiThanhToan !== 1 &&
        donHang?.trangThai !== 4;

    if (!donHang) {
        return (
            <div className="container py-5 text-center">
                Đang tải chi tiết đơn hàng...
            </div>
        );
    }

    return (
        <div className="container py-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="mb-1">Chi tiết đơn hàng DH{donHang.maDonHang}</h2>
                    <p className="text-muted mb-0">
                        Theo dõi thông tin thanh toán và trạng thái đơn hàng.
                    </p>
                </div>

                <Link to="/don-hang-cua-toi" className="btn btn-outline-dark">
                    Quay lại
                </Link>
            </div>

            {isWaitingPayment && (
                <div className="alert alert-warning border-0 shadow-sm mb-4">
                    <h5 className="mb-2">⏳ Đơn hàng đang chờ thanh toán</h5>

                    <p className="mb-2">
                        Vui lòng hoàn tất chuyển khoản trong thời gian còn lại.
                        Sau thời gian này đơn hàng sẽ tự động hủy.
                    </p>

                    <div
                        className="fw-bold mb-2"
                        style={{
                            fontSize: "42px",
                            color: percent <= 20 ? "#dc3545" : "#198754"
                        }}
                    >
                        {countdown}
                    </div>

                    <div className="progress" style={{ height: "10px" }}>
                        <div
                            className={`progress-bar ${progressClass()}`}
                            style={{ width: `${percent}%` }}
                        ></div>
                    </div>

                    <Link
                        to={`/thanh-toan-ngan-hang/${donHang.maDonHang}`}
                        className="btn btn-success mt-3"
                    >
                        Tiếp tục thanh toán
                    </Link>
                </div>
            )}

            <div className="row g-4">
                <div className="col-lg-7">
                    <div className="card border-0 shadow-sm mb-4">
                        <div className="card-header bg-white fw-bold">
                            Thông tin nhận hàng
                        </div>

                        <div className="card-body">
                            <p><b>Người nhận:</b> {donHang.hoTenNguoiNhan}</p>
                            <p><b>Số điện thoại:</b> {donHang.soDienThoai}</p>
                            <p><b>Địa chỉ:</b> {donHang.diaChi}</p>
                            <p><b>Ghi chú:</b> {donHang.ghiChu || "Không có"}</p>
                            <p>
                                <b>Ngày tạo:</b>{" "}
                                {new Date(donHang.ngayTao).toLocaleString("vi-VN")}
                            </p>
                        </div>
                    </div>

                    <div className="card border-0 shadow-sm">
                        <div className="card-header bg-white fw-bold">
                            Sản phẩm trong đơn
                        </div>

                        <div className="card-body p-0">
                            <table className="table table-hover align-middle mb-0">
                                <thead className="table-dark">
                                    <tr>
                                        <th>Sản phẩm</th>
                                        <th>Số lượng</th>
                                        <th>Đơn giá</th>
                                        <th>Thành tiền</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {chiTiet.map((item) => (
                                        <tr key={item.maChiTiet}>
                                            <td>{item.sanPham?.tenSanPham}</td>
                                            <td>{item.soLuong}</td>
                                            <td>{Number(item.donGia).toLocaleString()} VNĐ</td>
                                            <td className="fw-semibold">
                                                {Number(item.thanhTien).toLocaleString()} VNĐ
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="col-lg-5">
                    <div className="card border-0 shadow-sm">
                        <div className="card-header bg-white fw-bold">
                            Tổng quan đơn hàng
                        </div>

                        <div className="card-body">
                            <div className="mb-3">
                                <div className="text-muted">Tổng tiền</div>
                                <h4 className="text-danger">
                                    {Number(donHang.tongTien).toLocaleString()} VNĐ
                                </h4>
                            </div>

                            <div className="mb-3">
                                <div className="text-muted">Phương thức thanh toán</div>
                                <b>
                                    {donHang.phuongThucThanhToan === "BANK_TRANSFER"
                                        ? "Chuyển khoản ngân hàng"
                                        : "Thanh toán khi nhận hàng"}
                                </b>
                            </div>

                            <div className="mb-3">
                                <div className="text-muted">Trạng thái thanh toán</div>
                                <span
                                    className={
                                        donHang.trangThaiThanhToan === 1
                                            ? "badge bg-success"
                                            : "badge bg-primary"
                                    }
                                >
                                    {donHang.trangThaiThanhToan === 1
                                        ? "Đã thanh toán"
                                        : "Chờ thanh toán"}
                                </span>
                            </div>

                            <div>
                                <div className="text-muted">Trạng thái đơn hàng</div>
                                <span
                                    className={
                                        donHang.trangThai === 4
                                            ? "badge bg-danger"
                                            : donHang.trangThai === 3
                                            ? "badge bg-success"
                                            : "badge bg-warning text-dark"
                                    }
                                >
                                    {trangThaiText(donHang.trangThai)}
                                </span>
                            </div>

                            {donHang.trangThai === 0 && (
                                <button
                                    className="btn btn-outline-danger w-100 mt-4"
                                    onClick={khachHuyDon}
                                >
                                    Hủy đơn hàng
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MyOrderDetailPage;