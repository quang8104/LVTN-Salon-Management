import { Link, Outlet } from "react-router-dom";

function AdminLayout() {
    return (
        <div className="d-flex">
            <div className="bg-dark text-white p-3" style={{ width: "250px", minHeight: "100vh" }}>
                <h4>Admin Salon</h4>

                <ul className="nav flex-column mt-4">
                    <li className="nav-item">
                        <Link className="nav-link text-white" to="/admin">
                            Dashboard
                        </Link>
                    </li>

                    <li className="nav-item">
                        <Link className="nav-link text-white" to="/admin/lich-hen">
                            Quản lý lịch hẹn
                        </Link>
                    </li>

                    <li className="nav-item">
                        <Link className="nav-link text-white" to="/admin/dich-vu">
                            Quản lý dịch vụ
                        </Link>
                    </li>

                    <li className="nav-item">
                        <Link className="nav-link text-white" to="/admin/san-pham">
                            Quản lý sản phẩm
                        </Link>
                    </li>

                    <li className="nav-item">
                        <Link className="nav-link text-white" to="/admin/nhan-vien">
                            Quản lý nhân viên
                        </Link>
                    </li>

                    <li className="nav-item">
                        <Link className="nav-link text-white" to="/admin/hoa-don">
                            Quản lý hóa đơn
                        </Link>
                    </li>
                </ul>
            </div>

            <div className="flex-grow-1">
                <Outlet />
            </div>
        </div>
    );
}

export default AdminLayout;