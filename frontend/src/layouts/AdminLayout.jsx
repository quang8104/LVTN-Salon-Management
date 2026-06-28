import { NavLink, Outlet, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function AdminLayout() {
    const navigate = useNavigate();

    const hoTen = localStorage.getItem("hoTen") || "Administrator";

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
            showConfirmButton: false,
            timer: 1200
        });

        navigate("/login");
    };

    const menuClass = ({ isActive }) =>
        isActive
            ? "nav-link active-admin-link"
            : "nav-link admin-link";

    return (
        <div className="admin-wrapper">
            <aside className="admin-sidebar">
                <div className="admin-logo">
                    <div className="admin-logo-icon">💈</div>
                    <div>
                        <h4>Admin Salon</h4>
                        <span>Management System</span>
                    </div>
                </div>

                <ul className="nav flex-column admin-menu">
                    <li>
                        <NavLink end className={menuClass} to="/admin">
                            📊 Dashboard
                        </NavLink>
                    </li>

                    <li>
                        <NavLink className={menuClass} to="/admin/lich-hen">
                            📅 Quản lý lịch hẹn
                        </NavLink>
                    </li>

                    <li>
                        <NavLink className={menuClass} to="/admin/dich-vu">
                            ✂️ Quản lý dịch vụ
                        </NavLink>
                    </li>

                    <li>
                        <NavLink className={menuClass} to="/admin/san-pham">
                            🧴 Quản lý sản phẩm
                        </NavLink>
                    </li>

                    <li>
                        <NavLink className={menuClass} to="/admin/nhan-vien">
                            👥 Quản lý nhân viên
                        </NavLink>
                    </li>

                    <li>
                        <NavLink className={menuClass} to="/admin/hoa-don">
                            🧾 Quản lý hóa đơn
                        </NavLink>
                    </li>
                </ul>

                <div className="admin-sidebar-footer">
                    <button className="btn btn-outline-light w-100" onClick={logout}>
                        Đăng xuất
                    </button>
                </div>
            </aside>

            <section className="admin-main">
                <header className="admin-topbar">
                    <div>
                        <h5 className="mb-0">Hệ thống quản trị</h5>
                        <small>Quản lý salon tóc và bán hàng</small>
                    </div>

                    <div className="admin-user">
                        <button
                            className="btn btn-light me-2"
                            onClick={() => navigate("/")}
                        >
                            Về trang chủ
                        </button>

                        <div className="admin-avatar">
                            {hoTen.charAt(0).toUpperCase()}
                        </div>

                        <div>
                            <div className="fw-bold">{hoTen}</div>
                            <small>ADMIN</small>
                        </div>
                    </div>
                </header>

                <main className="admin-content">
                    <Outlet />
                </main>
            </section>
        </div>
    );
}

export default AdminLayout;