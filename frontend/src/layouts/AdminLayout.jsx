import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import { connectWebSocket, disconnectWebSocket } from "../websocket/websocket";
import { getDonHangChoXacNhan } from "../api/adminDonHangApi";

function AdminLayout() {
    const navigate = useNavigate();
    const location = useLocation();

    const hoTen = localStorage.getItem("hoTen") || "Administrator";

    const [orderPendingCount, setOrderPendingCount] = useState(0);

    const isCategoryRoute =
        location.pathname === "/admin/danh-muc" ||
        location.pathname === "/admin/danh-muc-dich-vu";

    const [openCategoryMenu, setOpenCategoryMenu] = useState(isCategoryRoute);

    useEffect(() => {
        if (isCategoryRoute) {
            setOpenCategoryMenu(true);
        }
    }, [isCategoryRoute]);

    useEffect(() => {
        loadOrderPendingCount();

        connectWebSocket((notification) => {
            Swal.fire({
                toast: true,
                position: "top-end",
                icon: "info",
                title: notification.title,
                text: notification.message,
                timer: 3500,
                showConfirmButton: false
            });

            if (
                notification.type === "ORDER" ||
                notification.type === "ORDER_UPDATED" ||
                notification.type === "ORDER_CANCELLED"
            ) {
                loadOrderPendingCount();

                window.dispatchEvent(
                    new CustomEvent("adminNotification", {
                        detail: notification
                    })
                );
            }
        });

        const handleOrderStatusChanged = () => {
            loadOrderPendingCount();
        };

        window.addEventListener("orderStatusChanged", handleOrderStatusChanged);

        return () => {
            disconnectWebSocket();
            window.removeEventListener("orderStatusChanged", handleOrderStatusChanged);
        };
    }, []);

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

    const loadOrderPendingCount = async () => {
        try {
            const res = await getDonHangChoXacNhan();
            setOrderPendingCount(res.data.length);
        } catch (error) {
            console.log(error);
        }
    };

    const menuClass = ({ isActive }) =>
        isActive ? "nav-link active-admin-link" : "nav-link admin-link";

    const subMenuClass = ({ isActive }) =>
        isActive
            ? "nav-link active-admin-link admin-sub-link"
            : "nav-link admin-link admin-sub-link";

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
                        <button
                            type="button"
                            className={
                                isCategoryRoute
                                    ? "nav-link active-admin-link w-100 text-start border-0"
                                    : "nav-link admin-link w-100 text-start border-0"
                            }
                            onClick={() => setOpenCategoryMenu(!openCategoryMenu)}
                        >
                            📂 Quản lý danh mục {openCategoryMenu ? "▾" : "▸"}
                        </button>

                        {openCategoryMenu && (
                            <div className="admin-sub-menu">
                                <NavLink className={subMenuClass} to="/admin/danh-muc">
                                    🧴 Danh mục sản phẩm
                                </NavLink>

                                <NavLink className={subMenuClass} to="/admin/danh-muc-dich-vu">
                                    ✂️ Danh mục dịch vụ
                                </NavLink>
                            </div>
                        )}
                    </li>

                    <li>
                        <NavLink className={menuClass} to="/admin/nhan-vien">
                            👥 Quản lý nhân viên
                        </NavLink>
                    </li>

                    <li>
                        <NavLink className={menuClass} to="/admin/nghi-phep-nhan-vien">
                            🗓️ Nghỉ phép nhân viên
                        </NavLink>
                    </li>

                    <li>
                        <NavLink className={menuClass} to="/admin/don-hang">
                            <span className="position-relative">
                                🛒 Quản lý đơn hàng

                                {orderPendingCount > 0 && (
                                    <span
                                        className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                                        style={{ fontSize: "11px" }}
                                    >
                                        {orderPendingCount}
                                    </span>
                                )}
                            </span>
                        </NavLink>
                    </li>

                    <li>
                        <NavLink className={menuClass} to="/admin/khuyen-mai">
                            🎁 Quản lý khuyến mãi
                        </NavLink>
                    </li>
                </ul>

                <div className="admin-sidebar-footer">
                    <li>
                        <NavLink className={menuClass} to="/admin/cau-hinh-salon">
                            ⚙️ Cấu hình salon
                        </NavLink>
                    </li>
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
                            onClick={() => window.open("/", "_blank")}
                        >
                            Xem trang chủ
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