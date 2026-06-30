import { useEffect, useState } from "react";
import {
    getAllLich,
    getChiTietLich,
    xacNhanLich,
    batDauLich,
    hoanTatLich,
    huyLich
} from "../api/adminLichApi";

function AdminLichPage() {
    const [lichHen, setLichHen] = useState([]);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const res = await getAllLich();
        const list = Array.isArray(res.data) ? res.data : res.data.data;

        const dataWithChiTiet = await Promise.all(
            list.map(async (item) => {
                const ctRes = await getChiTietLich(item.id);
                return {
                    ...item,
                    chiTiet: ctRes.data
                };
            })
        );

        setLichHen(dataWithChiTiet);
    };

    const trangThaiText = (value) => {
        switch (value) {
            case 0: return "Chờ xác nhận";
            case 1: return "Đã xác nhận";
            case 2: return "Đang phục vụ";
            case 3: return "Hoàn thành";
            case 4: return "Đã hủy";
            default: return "Không xác định";
        }
    };

    const handleXacNhan = async (id) => {
        await xacNhanLich(id);
        alert("Xác nhận lịch thành công");
        loadData();
    };

    const handleBatDau = async (id) => {
        await batDauLich(id);
        alert("Bắt đầu phục vụ");
        loadData();
    };

    const handleHoanTat = async (id) => {
        await hoanTatLich(id);
        alert("Hoàn thành lịch hẹn");
        loadData();
    };

    const handleHuy = async (id) => {
        if (!window.confirm("Bạn có chắc muốn hủy lịch này?")) return;

        await huyLich(id);
        alert("Hủy lịch thành công");
        loadData();
    };

    return (
        <div>
            <h2 className="mb-4">Quản lý lịch hẹn</h2>

            <div className="card border-0 shadow-sm">
                <div className="card-body p-0">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-dark">
                            <tr>
                                <th>Mã</th>
                                <th>Khách hàng</th>
                                <th>Nhân viên</th>
                                <th>Dịch vụ</th>
                                <th>Ngày</th>
                                <th>Giờ</th>
                                <th>Tổng tiền</th>
                                <th>Trạng thái</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>

                        <tbody>
                            {lichHen.map((item) => (
                                <tr key={item.id}>
                                    <td>LH{item.id}</td>

                                    <td>
                                        <div className="fw-semibold">
                                            {item.khachHang?.hoTen}
                                        </div>
                                        <small>{item.khachHang?.sdt}</small>
                                    </td>

                                    <td>{item.nhanVien?.hoTen}</td>

                                    <td>
                                        {item.chiTiet?.map((ct) => (
                                            <div key={ct.dichVu?.maDichVu}>
                                                - {ct.dichVu?.tenDichVu}
                                            </div>
                                        ))}
                                    </td>

                                    <td>{item.ngayHen}</td>

                                    <td>
                                        {item.gioHen} - {item.gioKetThucDuKien}
                                    </td>

                                    <td>
                                        {Number(item.tongTien || 0).toLocaleString()} VNĐ
                                    </td>

                                    <td>
                                        <span
                                            className={
                                                item.trangThai === 4
                                                    ? "badge bg-danger"
                                                    : item.trangThai === 3
                                                    ? "badge bg-success"
                                                    : item.trangThai === 2
                                                    ? "badge bg-info"
                                                    : "badge bg-warning text-dark"
                                            }
                                        >
                                            {trangThaiText(item.trangThai)}
                                        </span>
                                    </td>

                                    <td>
                                        {item.trangThai === 0 && (
                                            <button
                                                className="btn btn-primary btn-sm me-2 mb-1"
                                                onClick={() => handleXacNhan(item.id)}
                                            >
                                                Xác nhận
                                            </button>
                                        )}                                

                                        {item.trangThai !== 3 && item.trangThai !== 4 && (
                                            <button
                                                className="btn btn-danger btn-sm mb-1"
                                                onClick={() => handleHuy(item.id)}
                                            >
                                                Hủy
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}

                            {lichHen.length === 0 && (
                                <tr>
                                    <td colSpan="9" className="text-center py-4">
                                        Chưa có lịch hẹn nào
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default AdminLichPage;