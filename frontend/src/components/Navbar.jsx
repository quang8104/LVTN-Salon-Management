import { Link } from "react-router-dom";

function Navbar() {

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
						<li className="nav-item">
                            <Link className="nav-link" to="/lich-su">Lịch sử đặt lịch</Link>
                        </li>

                    </ul>

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

                </div>

            </div>

        </nav>

    );

}

export default Navbar;