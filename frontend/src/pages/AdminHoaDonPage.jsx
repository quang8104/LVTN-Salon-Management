import { useEffect, useState } from "react";
import {
    getAllHoaDon,
    thanhToanHoaDon
} from "../api/adminHoaDonApi";

function AdminHoaDonPage() {
    const [hoaDon, setHoaDon] = useState([]);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const res = await getAllHoaDon();
        setHoaDon(res.data);
    };

    const handleThanhToan = async (id) => {
        if (!window.confirm("Xác nhận thanh toán hóa đơn này?")) return;

        await thanhToanHoaDon(id);
        alert("Thanh toán thành công");
        loadData();
    };

    return (
        <div className="container py-4">
            <h2 className="mb-4">Quản lý hóa đơn</h2>

            <table className="table table-bordered table-hover">
                <thead className="table-dark">
                    <tr>
                        <th>Mã hóa đơn</th>
                        <th>Tổng tiền</th>
                        <th>Trạng thái</th>
                        <th>Ngày tạo</th>
                        <th>Thao tác</th>
                    </tr>
                </thead>

                <tbody>
                    {hoaDon.map((item) => (
                        <tr key={item.maHoaDon}>
                            <td>{item.maHoaDon}</td>
                            <td>{item.tongTien?.toLocaleString()} VNĐ</td>
                            <td>
                                {item.trangThai === 1
                                    ? "Đã thanh toán"
                                    : "Chưa thanh toán"}
                            </td>
                            <td>{item.ngayTao}</td>
                            <td>
                                {item.trangThai === 0 && (
                                    <button
                                        className="btn btn-success btn-sm"
                                        onClick={() =>
                                            handleThanhToan(item.maHoaDon)
                                        }
                                    >
                                        Thanh toán
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

export default AdminHoaDonPage;