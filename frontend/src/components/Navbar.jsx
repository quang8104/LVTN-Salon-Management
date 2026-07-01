import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";

function Navbar() {
    const navigate = useNavigate();

    const token = localStorage.getItem("token");
    const vaiTro = localStorage.getItem("vaiTro");
    const hoTen = localStorage.getItem("hoTen");

    const [cartCount, setCartCount] = useState(0);

    useEffect(() => {

        loadCartCount();

        window.addEventListener("cartUpdated", loadCartCount);

        return () => {
            window.removeEventListener("cartUpdated", loadCartCount);
        };

    }, []);

    const loadCartCount = () => {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];

        const total = cart.reduce((sum, item) => sum + item.soLuong, 0);

        setCartCount(total);
    };

    const logout = async () => {

        const result = await Swal.fire({
            title: "Đăng xuất",
            text: "Bạn có chắc chắn muốn đăng xuất?",
            icon: "question",

            showCancelButton: true,

            confirmButtonText: "Đăng xuất",
            cancelButtonText: "Hủy",

            confirmButtonColor: "#dc3545",
            cancelButtonColor: "#6c757d"
        });

        if (!result.isConfirmed) return;

        localStorage.clear();

        await Swal.fire({
            icon: "success",
            title: "Đăng xuất thành công",
            timer: 1200,
            showConfirmButton: false
        });

        navigate("/");
    }

    return (

        <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top shadow">

            <div className="container">

                <Link className="navbar-brand fw-bold fs-3" to="/">
                    💈 Hair Salon
                </Link>

                <button
                    className="navbar-toggler"
                    data-bs-toggle="collapse"
                    data-bs-target="#menu"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="menu">

                    <ul className="navbar-nav mx-auto">

                        <li className="nav-item">
                            <Link className="nav-link" to="/">Trang chủ</Link>
                        </li>

                        <li className="nav-item">
                            <Link className="nav-link" to="/dichvu">Dịch vụ</Link>
                        </li>

                        <li className="nav-item">
                            <Link className="nav-link" to="/san-pham">Sản phẩm</Link>
                        </li>

                        <li className="nav-item">
                            <Link className="nav-link" to="/dat-lich">Đặt lịch</Link>
                        </li>
						

                    </ul>

                    {
    !token ? (
        <>
            <Link
                to="/login"
                className="btn btn-outline-light me-2"
            >
                Đăng nhập
            </Link>

            <Link
                to="/register"
                className="btn btn-warning"
            >
                Đăng ký
            </Link>
        </>
    ) : (
        <>
            {
                vaiTro === "KHACH_HANG" && (
                    <>
                        <Link
                            to="/gio-hang"
                            className="btn btn-outline-light position-relative me-3"
                        >
                            🛒

                            {cartCount > 0 && (
                                <span
                                    className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                                >
                                    {cartCount}
                                </span>
                            )}
                        </Link>
                    </>
                )
            }

            {
                vaiTro === "ADMIN" && (
                    <Link
                        to="/admin"
                        className="btn btn-warning me-2"
                    >
                        Dashboard
                    </Link>
                )
            }

            <div className="dropdown">

                <button
                    className="btn btn-outline-light dropdown-toggle"
                    data-bs-toggle="dropdown"
                >
                    👤 {hoTen}
                </button>

                <ul className="dropdown-menu dropdown-menu-end">

                    {
                        vaiTro === "KHACH_HANG" &&
                        <li>
                            <Link className="dropdown-item" to="/thong-tin">
                                Thông tin cá nhân
                            </Link>
                        </li>
                    }

                    <li> 
                        <Link className="dropdown-item" to="/don-hang-cua-toi"> 
                         Đơn hàng của tôi 
                        </Link> 
                    </li>

                    <li>
                        <Link className="dropdown-item" to="/lich-su">
                            Lịch đặt của tôi
                        </Link>
                    </li>
                    
                    <li>
                        <Link className="dropdown-item" to="/doi-mat-khau">
                            Đổi mật khẩu
                        </Link>
                    </li>

                    <li>
                        <button
                            className="dropdown-item text-danger"
                            onClick={logout}
                        >
                            Đăng xuất
                        </button>
                    </li>

                </ul>

            </div>
        </>
    )
}

                </div>

            </div>

        </nav>

    );

}

export default Navbar;