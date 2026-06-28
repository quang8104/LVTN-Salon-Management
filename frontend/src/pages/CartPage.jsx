import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { taoHoaDonBanHang } from "../api/hoaDonBanHangApi";

function CartPage() {
    const [cart, setCart] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        loadCart();
    }, []);

    const loadCart = () => {
        const data = JSON.parse(localStorage.getItem("cart")) || [];
        setCart(data);
    };

    const saveCart = (newCart) => {
        localStorage.setItem("cart", JSON.stringify(newCart));
        setCart(newCart);

        window.dispatchEvent(new Event("cartUpdated"));
    };

    const tienHanhDatHang = async () => {
        if (cart.length === 0) {
            alert("Giỏ hàng đang trống");
            return;
        }

        const maKhachHang = localStorage.getItem("userId");

        if (!maKhachHang) {
            alert("Vui lòng đăng nhập để đặt hàng");
            navigate("/login");
            return;
        }

        const request = {
            maKhachHang: Number(maKhachHang),
            items: cart.map((item) => ({
                maSanPham: item.maSanPham,
                soLuong: item.soLuong
            }))
        };

        try {
            await taoHoaDonBanHang(request);

            localStorage.removeItem("cart");
            setCart([]);
            window.dispatchEvent(new Event("cartUpdated"));

            alert("Đặt hàng thành công");

            navigate("/san-pham");
        } catch (error) {
            console.log(error);
            alert(error.response?.data?.message || "Đặt hàng thất bại");
        }
    };

    const tangSoLuong = (maSanPham) => {
        const newCart = cart.map((item) => {
            if (item.maSanPham === maSanPham) {
                return {
                    ...item,
                    soLuong: item.soLuong + 1
                };
            }

            return item;
        });

        saveCart(newCart);
    };

    const giamSoLuong = (maSanPham) => {
        const newCart = cart.map((item) => {
            if (item.maSanPham === maSanPham && item.soLuong > 1) {
                return {
                    ...item,
                    soLuong: item.soLuong - 1
                };
            }

            return item;
        });

        saveCart(newCart);
    };

    const xoaSanPham = (maSanPham) => {
        if (!window.confirm("Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng?")) return;

        const newCart = cart.filter((item) => item.maSanPham !== maSanPham);
        saveCart(newCart);
    };

    const xoaTatCa = () => {
        if (!window.confirm("Bạn có chắc muốn xóa toàn bộ giỏ hàng?")) return;

        localStorage.removeItem("cart");
        setCart([]);

        window.dispatchEvent(new Event("cartUpdated"));
    };

    const tongTien = cart.reduce(
        (total, item) => total + Number(item.gia) * Number(item.soLuong),
        0
    );

    return (
        <div className="container py-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="mb-1">Giỏ hàng</h2>
                    <p className="text-muted mb-0">
                        Kiểm tra sản phẩm trước khi đặt hàng
                    </p>
                </div>

                <Link to="/san-pham" className="btn btn-outline-dark">
                    Tiếp tục mua hàng
                </Link>
            </div>

            {cart.length === 0 ? (
                <div className="card border-0 shadow-sm">
                    <div className="card-body text-center py-5">
                        <h4>Giỏ hàng đang trống</h4>
                        <p className="text-muted">
                            Hãy chọn sản phẩm bạn muốn mua.
                        </p>

                        <Link to="/san-pham" className="btn btn-dark">
                            Xem sản phẩm
                        </Link>
                    </div>
                </div>
            ) : (
                <div className="row g-4">
                    <div className="col-lg-8">
                        <div className="card border-0 shadow-sm">
                            <div className="card-header bg-white fw-bold">
                                Danh sách sản phẩm
                            </div>

                            <div className="card-body p-0">
                                <table className="table align-middle mb-0">
                                    <thead className="table-light">
                                        <tr>
                                            <th>Sản phẩm</th>
                                            <th>Giá</th>
                                            <th>Số lượng</th>
                                            <th>Thành tiền</th>
                                            <th></th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {cart.map((item) => (
                                            <tr key={item.maSanPham}>
                                                <td>
                                                    <div className="d-flex align-items-center gap-3">
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
                                                                <span className="text-muted small">
                                                                    No img
                                                                </span>
                                                            </div>
                                                        )}

                                                        <div>
                                                            <div className="fw-semibold">
                                                                {item.tenSanPham}
                                                            </div>
                                                            <small className="text-muted">
                                                                Mã SP: {item.maSanPham}
                                                            </small>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td>
                                                    {Number(item.gia).toLocaleString()} VNĐ
                                                </td>

                                                <td>
                                                    <div className="d-flex align-items-center">
                                                        <button
                                                            className="btn btn-outline-dark btn-sm"
                                                            onClick={() => giamSoLuong(item.maSanPham)}
                                                        >
                                                            -
                                                        </button>

                                                        <span className="mx-3 fw-bold">
                                                            {item.soLuong}
                                                        </span>

                                                        <button
                                                            className="btn btn-outline-dark btn-sm"
                                                            onClick={() => tangSoLuong(item.maSanPham)}
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                </td>

                                                <td className="fw-bold text-danger">
                                                    {(Number(item.gia) * Number(item.soLuong)).toLocaleString()} VNĐ
                                                </td>

                                                <td>
                                                    <button
                                                        className="btn btn-danger btn-sm"
                                                        onClick={() => xoaSanPham(item.maSanPham)}
                                                    >
                                                        Xóa
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <button
                            className="btn btn-outline-danger mt-3"
                            onClick={xoaTatCa}
                        >
                            Xóa toàn bộ giỏ hàng
                        </button>
                    </div>

                    <div className="col-lg-4">
                        <div className="card border-0 shadow-sm">
                            <div className="card-header bg-white fw-bold">
                                Tóm tắt đơn hàng
                            </div>

                            <div className="card-body">
                                <div className="d-flex justify-content-between mb-3">
                                    <span>Số sản phẩm</span>
                                    <strong>{cart.length}</strong>
                                </div>

                                <div className="d-flex justify-content-between mb-3">
                                    <span>Tổng số lượng</span>
                                    <strong>
                                        {cart.reduce((sum, item) => sum + item.soLuong, 0)}
                                    </strong>
                                </div>

                                <hr />

                                <div className="d-flex justify-content-between mb-4">
                                    <span className="fw-bold">Tổng tiền</span>
                                    <strong className="text-danger fs-5">
                                        {tongTien.toLocaleString()} VNĐ
                                    </strong>
                                </div>

                                <Link to="/thanh-toan" className="btn btn-dark w-100">
                                    Tiến hành đặt hàng
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CartPage;