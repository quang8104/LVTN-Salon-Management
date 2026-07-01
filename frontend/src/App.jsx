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
import ProductDetailPage from "./pages/ProductDetailPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderSuccessPage from "./pages/OrderSuccessPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ProfilePage from "./pages/ProfilePage";
import ChangePasswordPage from "./pages/ChangePasswordPage";
import BankTransferPage from "./pages/BankTransferPage";
import AdminDonHangPage from "./pages/AdminDonHangPage";
import AdminDonHangDetailPage from "./pages/AdminDonHangDetailPage";
import AdminDanhMucPage from "./pages/AdminDanhMucPage";
import MyOrderPage from "./pages/MyOrderPage";
import MyOrderDetailPage from "./pages/MyOrderDetailPage";
import AdminDanhMucDichVuPage from "./pages/AdminDanhMucDichVuPage";
import AdminCauHinhSalonPage from "./pages/AdminCauHinhSalonPage";
import AdminNghiPhepNhanVienPage from "./pages/AdminNghiPhepNhanVienPage";

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
                    <Route path="/dat-lich" element={<BookingPage />} />
                    <Route path="/san-pham/:id" element={<ProductDetailPage />} />
                    <Route path="/gio-hang" element={<CartPage />} />
                    <Route path="/thanh-toan" element={<CheckoutPage />} />
                    <Route path="/dat-hang-thanh-cong/:id" element={<OrderSuccessPage />} />
                    <Route path="/thong-tin" element={<ProfilePage />} />
                    <Route path="/doi-mat-khau" element={<ChangePasswordPage />} />
                    <Route path="/thanh-toan-ngan-hang/:id" element={<BankTransferPage />} />
                    <Route path="/don-hang-cua-toi" element={<MyOrderPage />} />
                    <Route path="/don-hang-cua-toi/:id" element={<MyOrderDetailPage />} />
                    <Route path="/lich-su" element={<HistoryPage />} />
                    <Route path="/lich-su/:id" element={<HistoryDetailPage />} />
                </Route>

                {/* Không dùng layout */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />

                <Route element={<AdminLayout />}>
                    <Route path="/admin" element={<AdminDashboardPage />} />
                    <Route path="/admin/lich-hen" element={<AdminLichPage />} />
                    <Route path="/admin/dich-vu" element={<AdminDichVuPage />} />
                    <Route path="/admin/san-pham" element={<AdminSanPhamPage />} />
                    <Route path="/admin/nhan-vien" element={<AdminNhanVienPage />} />
                    
                    <Route path="/admin/don-hang" element={<AdminDonHangPage />} />
                    <Route path="/admin/don-hang/:id" element={<AdminDonHangDetailPage />} />   
                    <Route path="/admin/danh-muc" element={<AdminDanhMucPage />} />
                    <Route path="/admin/danh-muc-dich-vu" element={<AdminDanhMucDichVuPage />} />
                    <Route path="/admin/cau-hinh-salon" element={<AdminCauHinhSalonPage />} />
                    <Route path="/admin/nghi-phep-nhan-vien" element={<AdminNghiPhepNhanVienPage />} />
                </Route>

            </Routes>
        </BrowserRouter>
    );
}

export default App;