import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
    getDonHangById,
    getChiTietDonHang,
    xacNhanThanhToan,
    xacNhanDonHang,
    dangGiaoDonHang,
    hoanThanhDonHang,
    huyDonHang
} from "../api/adminDonHangApi";

function AdminDonHangDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [donHang, setDonHang] = useState(null);
    const [chiTiet, setChiTiet] = useState([]);

    useEffect(() => {
        loadData();
    }, [id]);

    const loadData = async () => {
        try {
            const dhRes = await getDonHangById(id);
            setDonHang(dhRes.data);

            const ctRes = await getChiTietDonHang(id);
            setChiTiet(ctRes.data);
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

    const xuLy = async (message, action) => {
        if (!window.confirm(message)) return;

        try {
            await action();

            await loadData();

            window.dispatchEvent(new Event("orderStatusChanged"));

            alert("Cập nhật thành công");
        } catch (error) {
            console.log(error);
            alert(error.response?.data || "Cập nhật thất bại");
        }
    };

    if (!donHang) {
        return <div>Đang tải đơn hàng...</div>;
    }

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="mb-1">Chi tiết đơn hàng DH{donHang.maDonHang}</h2>
                    <p className="text-muted mb-0">
                        Xem thông tin giao hàng, sản phẩm và xử lý trạng thái đơn.
                    </p>
                </div>

                <Link to="/admin/don-hang" className="btn btn-outline-dark">
                    Quay lại
                </Link>
            </div>

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
                                {donHang.ngayTao
                                    ? new Date(donHang.ngayTao).toLocaleString("vi-VN")
                                    : ""}
                            </p>
                            {
                                donHang.thoiGianThanhToan && (
                                    <p className="text-success">
                                        <b>Thời gian thanh toán:</b>{" "}
                                        {new Date(
                                            donHang.thoiGianThanhToan
                                        ).toLocaleString("vi-VN")}
                                    </p>
                                )
                            }
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
                                            <td>
                                                <div className="fw-semibold">
                                                    {item.sanPham?.tenSanPham}
                                                </div>
                                            </td>
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
                            Xử lý đơn hàng
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
                                <div className="fw-bold">
                                    {donHang.phuongThucThanhToan === "BANK_TRANSFER"
                                        ? "Chuyển khoản ngân hàng"
                                        : "Thanh toán khi nhận hàng"}
                                </div>
                            </div>

                            {donHang.phuongThucThanhToan === "BANK_TRANSFER" && (
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
                            )}

                            <div className="mb-4">
                                <div className="text-muted">Trạng thái đơn hàng</div>
                                <h5>{trangThaiText(donHang.trangThai)}</h5>
                            </div>

                            {donHang.phuongThucThanhToan === "BANK_TRANSFER" &&
                                donHang.trangThaiThanhToan !== 1 &&
                                donHang.trangThai !== 4 && (
                                    <button
                                        className="btn btn-success w-100 mb-2"
                                        onClick={() =>
                                            xuLy(
                                                "Xác nhận khách đã chuyển khoản?",
                                                () => xacNhanThanhToan(donHang.maDonHang)
                                            )
                                        }
                                    >
                                        Xác nhận thanh toán
                                    </button>
                                )}

                            {donHang.trangThai === 0 && (
                                <button
                                    className="btn btn-dark w-100 mb-2"
                                    onClick={() =>
                                        xuLy(
                                            "Xác nhận đơn hàng này?",
                                            () => xacNhanDonHang(donHang.maDonHang)
                                        )
                                    }
                                >
                                    Xác nhận đơn
                                </button>
                            )}

                            {donHang.trangThai === 1 && (
                                <button
                                    className="btn btn-primary w-100 mb-2"
                                    onClick={() =>
                                        xuLy(
                                            "Chuyển đơn sang trạng thái đang giao?",
                                            () => dangGiaoDonHang(donHang.maDonHang)
                                        )
                                    }
                                >
                                    Đang giao
                                </button>
                            )}

                            {donHang.trangThai === 2 && (
                                <button
                                    className="btn btn-success w-100 mb-2"
                                    onClick={() =>
                                        xuLy(
                                            "Xác nhận đơn hàng đã hoàn thành?",
                                            () => hoanThanhDonHang(donHang.maDonHang)
                                        )
                                    }
                                >
                                    Hoàn thành
                                </button>
                            )}

                            {donHang.trangThai !== 3 && donHang.trangThai !== 4 && (
                                <button
                                    className="btn btn-danger w-100"
                                    onClick={() =>
                                        xuLy(
                                            "Bạn có chắc muốn hủy đơn hàng này?",
                                            () => huyDonHang(donHang.maDonHang)
                                        )
                                    }
                                >
                                    Hủy đơn
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminDonHangDetailPage;