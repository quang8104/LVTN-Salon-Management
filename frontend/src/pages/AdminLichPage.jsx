import { useEffect, useState } from "react";
import {
    getAllLich,
    xacNhanLich,
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
        setLichHen(res.data.data);
    };

    const handleXacNhan = async (id) => {
        await xacNhanLich(id);
        alert("Xác nhận lịch thành công");
        loadData();
    };

    const handleHoanTat = async (id) => {
        await hoanTatLich(id);
        alert("Hoàn tất lịch thành công");
        loadData();
    };

    const handleHuy = async (id) => {
        if (!window.confirm("Bạn có chắc muốn hủy lịch này?")) return;

        await huyLich(id);
        alert("Hủy lịch thành công");
        loadData();
    };

    return (
        <div className="container py-5">
            <h2 className="mb-4">Quản lý lịch hẹn</h2>

            <table className="table table-bordered table-hover">
                <thead className="table-dark">
                    <tr>
                        <th>Mã</th>
                        <th>Khách hàng</th>
                        <th>SĐT</th>
                        <th>Nhân viên</th>
                        <th>Ngày</th>
                        <th>Giờ</th>
                        <th>Trạng thái</th>
                        <th>Thao tác</th>
                    </tr>
                </thead>

                <tbody>
                    {lichHen.map((item) => (
                        <tr key={item.id}>
                            <td>{item.id}</td>
                            <td>{item.tenKhachHang}</td>
                            <td>{item.sdt}</td>
                            <td>{item.tenNhanVien}</td>
                            <td>{item.ngayHen}</td>
                            <td>{item.gioHen}</td>
                            <td>{item.trangThaiText}</td>
                            <td>
                                {item.trangThai === 0 && (
                                    <button
                                        className="btn btn-primary btn-sm me-2"
                                        onClick={() => handleXacNhan(item.id)}
                                    >
                                        Xác nhận
                                    </button>
                                )}

                                {item.trangThai === 1 && (
                                    <button
                                        className="btn btn-success btn-sm me-2"
                                        onClick={() => handleHoanTat(item.id)}
                                    >
                                        Hoàn tất
                                    </button>
                                )}

                                {item.trangThai !== 2 && item.trangThai !== 3 && (
                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => handleHuy(item.id)}
                                    >
                                        Hủy
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default AdminLichPage;