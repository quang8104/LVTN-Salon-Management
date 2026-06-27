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

            </Routes>
        </BrowserRouter>
    );
}

export default App;