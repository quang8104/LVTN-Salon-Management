import { useEffect, useState } from "react";
import {
    getAllLich,
    getDoanhThuDichVu,
    getDoanhThuBanHang
} from "../api/adminDashboardApi";

function AdminDashboardPage() {
    const [lichHen, setLichHen] = useState([]);
    const [doanhThuDV, setDoanhThuDV] = useState(0);
    const [doanhThuBH, setDoanhThuBH] = useState(0);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const lichRes = await getAllLich();
        setLichHen(lichRes.data.data);

        const dtDvRes = await getDoanhThuDichVu();
        setDoanhThuDV(dtDvRes.data);

        const dtBhRes = await getDoanhThuBanHang();
        setDoanhThuBH(dtBhRes.data);
    };

    const tongLich = lichHen.length;
    const choXacNhan = lichHen.filter(item => item.trangThai === 0).length;
    const hoanTat = lichHen.filter(item => item.trangThai === 2).length;
    const tongDoanhThu = doanhThuDV + doanhThuBH;

    return (
        <div className="container py-5">
            <h2 className="mb-4">Dashboard Admin</h2>

            <div className="row g-4">
                <div className="col-md-3">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <h6>Tổng lịch hẹn</h6>
                            <h3>{tongLich}</h3>
                        </div>
                    </div>
                </div>

                <div className="col-md-3">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <h6>Chờ xác nhận</h6>
                            <h3>{choXacNhan}</h3>
                        </div>
                    </div>
                </div>

                <div className="col-md-3">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <h6>Hoàn tất</h6>
                            <h3>{hoanTat}</h3>
                        </div>
                    </div>
                </div>

                <div className="col-md-3">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <h6>Tổng doanh thu</h6>
                            <h3>{tongDoanhThu.toLocaleString()} VNĐ</h3>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboardPage;