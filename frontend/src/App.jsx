import { BrowserRouter, Routes, Route } from "react-router-dom";

import CustomerLayout from "./layouts/CustomerLayout";

import HomePage from "./pages/HomePage";
import ProductPage from "./pages/ProductPage";
import ServicePage from "./pages/ServicePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import ServiceDetailPage from "./pages/ServiceDetailPage";
import BookingPage from "./pages/BookingPage";
import HistoryPage from "./pages/HistoryPage";
import HistoryDetailPage from "./pages/HistoryDetailPage";
import AdminLichPage from "./pages/AdminLichPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminLayout from "./layouts/AdminLayout";
import AdminDichVuPage from "./pages/AdminDichVuPage";
import AdminSanPhamPage from "./pages/AdminSanPhamPage";
import AdminNhanVienPage from "./pages/AdminNhanVienPage";
import AdminHoaDonPage from "./pages/AdminHoaDonPage";

function App() {
    return (
        <BrowserRouter>
            <Routes>

                {/* Layout dành cho khách */}
                <Route element={<CustomerLayout />}>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/san-pham" element={<ProductPage />} />
                    <Route path="/dichvu" element={<ServicePage />} />
                    <Route path="/dichvu/:id"element={<ServiceDetailPage />}/>
                    <Route path="/lich/dat-lich" element={<BookingPage />} />
                    <Route path="/lich-su" element={<HistoryPage />} />
                    <Route path="/lich-su/:id" element={<HistoryDetailPage />} />
                </Route>

                {/* Không dùng layout */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />

                <Route element={<AdminLayout />}>
                    <Route path="/admin" element={<AdminDashboardPage />} />
                    <Route path="/admin/lich-hen" element={<AdminLichPage />} />
                    <Route path="/admin/dich-vu" element={<AdminDichVuPage />} />
                    <Route path="/admin/san-pham" element={<AdminSanPhamPage />} />
                    <Route path="/admin/nhan-vien" element={<AdminNhanVienPage />} />
                    <Route path="/admin/hoa-don" element={<AdminHoaDonPage />} />
                </Route>

            </Routes>
        </BrowserRouter>
    );
}

export default App;