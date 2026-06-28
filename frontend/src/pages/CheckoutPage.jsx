import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { taoDonHang } from "../api/donHangApi";
import { getKhachHangById } from "../api/khachHangApi";

function CheckoutPage() {
    const navigate = useNavigate();

    const [cart, setCart] = useState([]);

    const [form, setForm] = useState({
        hoTenNguoiNhan: "",
        soDienThoai: "",
        tinhThanh: "",
        quanHuyen: "",
        phuongXa: "",
        diaChiCuThe: "",
        ghiChu: "",
        phuongThucThanhToan: "COD"
    });

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem("cart")) || [];
        setCart(data);
        loadCustomerInfo();
    }, []);

    const loadCustomerInfo = async () => {
        const userId = localStorage.getItem("userId");
        if (!userId) return;

        try {
            const res = await getKhachHangById(userId);

            setForm((prev) => ({
                ...prev,
                hoTenNguoiNhan: res.data.hoTen || "",
                soDienThoai: res.data.sdt || "",
                diaChiCuThe: res.data.diaChi || ""
            }));
        } catch (error) {
            console.log(error);
        }
    };

    const change = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const tongTien = cart.reduce(
        (sum, item) => sum + Number(item.gia) * Number(item.soLuong),
        0
    );

    const datHang = async (e) => {
        e.preventDefault();

        if (cart.length === 0) {
            alert("Giỏ hàng đang trống");
            navigate("/gio-hang");
            return;
        }

        const maKhachHang = localStorage.getItem("userId");

        if (!maKhachHang) {
            alert("Vui lòng đăng nhập để đặt hàng");
            navigate("/login");
            return;
        }

        const phoneRegex = /^(03|05|07|08|09)[0-9]{8}$/;

        if (!phoneRegex.test(form.soDienThoai)) {
            alert("Số điện thoại không đúng định dạng Việt Nam");
            return;
        }

        const diaChiDayDu = [
            form.diaChiCuThe,
            form.phuongXa,
            form.quanHuyen,
            form.tinhThanh
        ]
            .filter(Boolean)
            .join(", ");

        const request = {
            maKhachHang: Number(maKhachHang),
            hoTenNguoiNhan: form.hoTenNguoiNhan,
            soDienThoai: form.soDienThoai,
            diaChi: diaChiDayDu,
            ghiChu: form.ghiChu,
            phuongThucThanhToan: form.phuongThucThanhToan,
            items: cart.map((item) => ({
                maSanPham: item.maSanPham,
                soLuong: item.soLuong
            }))
        };

        try {
            const res = await taoDonHang(request);

            localStorage.removeItem("cart");
            window.dispatchEvent(new Event("cartUpdated"));

            alert("Đặt hàng thành công. Đơn hàng đang chờ admin xác nhận.");

            navigate(`/dat-hang-thanh-cong/${res.data.maDonHang}`);
        } catch (error) {
            console.log(error);
            alert("Đặt hàng thất bại. Vui lòng kiểm tra tồn kho hoặc thông tin giao hàng.");
        }
    };

    if (cart.length === 0) {
        return (
            <div className="container py-5 text-center">
                <h3>Giỏ hàng đang trống</h3>
                <p className="text-muted">
                    Bạn chưa có sản phẩm nào để thanh toán.
                </p>

                <Link to="/san-pham" className="btn btn-dark">
                    Tiếp tục mua hàng
                </Link>
            </div>
        );
    }

    return (
        <div className="container py-5">
            <h2 className="mb-4">Thanh toán đơn hàng</h2>

            <form onSubmit={datHang}>
                <div className="row g-4">
                    <div className="col-lg-7">
                        <div className="card border-0 shadow-sm">
                            <div className="card-header bg-white fw-bold">
                                Thông tin nhận hàng
                            </div>

                            <div className="card-body">
                                <div className="mb-3">
                                    <label className="form-label">
                                        Họ tên người nhận
                                    </label>
                                    <input
                                        className="form-control"
                                        name="hoTenNguoiNhan"
                                        value={form.hoTenNguoiNhan}
                                        onChange={change}
                                        required
                                    />
                                    <small className="text-muted">
                                        Có thể thay đổi nếu người nhận khác chủ tài khoản.
                                    </small>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">
                                        Số điện thoại
                                    </label>
                                    <input
                                        className="form-control"
                                        name="soDienThoai"
                                        value={form.soDienThoai}
                                        onChange={change}
                                        placeholder="Ví dụ: 0987654321"
                                        required
                                    />
                                </div>

                                <div className="alert alert-light border small">
                                    Nhập địa chỉ theo từng phần để dễ giao hàng và xác định nơi nhận.
                                </div>

                                <div className="row">
                                    <div className="col-md-4 mb-3">
                                        <label className="form-label">
                                            Tỉnh/Thành phố
                                        </label>
                                        <input
                                            className="form-control"
                                            name="tinhThanh"
                                            value={form.tinhThanh}
                                            onChange={change}
                                            placeholder="VD: TP.HCM"
                                            required
                                        />
                                    </div>

                                    <div className="col-md-4 mb-3">
                                        <label className="form-label">
                                            Quận/Huyện
                                        </label>
                                        <input
                                            className="form-control"
                                            name="quanHuyen"
                                            value={form.quanHuyen}
                                            onChange={change}
                                            placeholder="VD: Quận 1"
                                            required
                                        />
                                    </div>

                                    <div className="col-md-4 mb-3">
                                        <label className="form-label">
                                            Phường/Xã
                                        </label>
                                        <input
                                            className="form-control"
                                            name="phuongXa"
                                            value={form.phuongXa}
                                            onChange={change}
                                            placeholder="VD: Bến Nghé"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">
                                        Số nhà, tên đường
                                    </label>
                                    <textarea
                                        className="form-control"
                                        rows="2"
                                        name="diaChiCuThe"
                                        value={form.diaChiCuThe}
                                        onChange={change}
                                        placeholder="VD: 123 Nguyễn Huệ"
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">
                                        Ghi chú
                                    </label>
                                    <textarea
                                        className="form-control"
                                        rows="2"
                                        name="ghiChu"
                                        value={form.ghiChu}
                                        onChange={change}
                                        placeholder="Ví dụ: Giao giờ hành chính, gọi trước khi giao..."
                                    />
                                </div>

                                <div className="mb-0">
                                    <label className="form-label">
                                        Phương thức thanh toán
                                    </label>

                                    <select
                                        className="form-select"
                                        name="phuongThucThanhToan"
                                        value={form.phuongThucThanhToan}
                                        onChange={change}
                                    >
                                        <option value="COD">
                                            Thanh toán khi nhận hàng
                                        </option>
                                        <option value="BANK_TRANSFER">
                                            Chuyển khoản ngân hàng
                                        </option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-5">
                        <div className="card border-0 shadow-sm">
                            <div className="card-header bg-white fw-bold">
                                Đơn hàng của bạn
                            </div>

                            <div className="card-body">
                                {cart.map((item) => (
                                    <div
                                        className="d-flex gap-3 mb-3"
                                        key={item.maSanPham}
                                    >
                                        {item.hinhAnh ? (
                                            <img
                                                src={item.hinhAnh}
                                                alt={item.tenSanPham}
                                                style={{
                                                    width: "70px",
                                                    height: "70px",
                                                    objectFit: "cover",
                                                    borderRadius: "10px"
                                                }}
                                            />
                                        ) : (
                                            <div
                                                className="bg-light d-flex align-items-center justify-content-center"
                                                style={{
                                                    width: "70px",
                                                    height: "70px",
                                                    borderRadius: "10px"
                                                }}
                                            >
                                                <span className="small text-muted">
                                                    No img
                                                </span>
                                            </div>
                                        )}

                                        <div className="flex-grow-1">
                                            <div className="fw-semibold">
                                                {item.tenSanPham}
                                            </div>

                                            <small className="text-muted">
                                                Số lượng: {item.soLuong}
                                            </small>

                                            <div className="text-danger fw-bold">
                                                {(Number(item.gia) * Number(item.soLuong)).toLocaleString()} VNĐ
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                <hr />

                                <div className="d-flex justify-content-between mb-3">
                                    <span>Tạm tính</span>
                                    <strong>{tongTien.toLocaleString()} VNĐ</strong>
                                </div>

                                <div className="d-flex justify-content-between mb-3">
                                    <span>Phí giao hàng</span>
                                    <strong>0 VNĐ</strong>
                                </div>

                                <hr />

                                <div className="d-flex justify-content-between mb-4">
                                    <span className="fw-bold">
                                        Tổng thanh toán
                                    </span>
                                    <strong className="text-danger fs-5">
                                        {tongTien.toLocaleString()} VNĐ
                                    </strong>
                                </div>

                                <button className="btn btn-dark w-100">
                                    Đặt hàng
                                </button>

                                <Link
                                    to="/gio-hang"
                                    className="btn btn-outline-secondary w-100 mt-2"
                                >
                                    Quay lại giỏ hàng
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default CheckoutPage;