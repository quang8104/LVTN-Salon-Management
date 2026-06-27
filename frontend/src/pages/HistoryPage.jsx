import { useEffect, useState } from "react";
import { getLichSu } from "../api/lichSuApi";
import { useNavigate } from "react-router-dom";

function HistoryPage() {

     const navigate = useNavigate();

    const [lichSu, setLichSu] = useState([]);

    useEffect(() => {

        loadHistory();

    }, []);

   

    const loadHistory = async () => {

        try {

            // Tạm thời hard-code khách hàng = 1
            const res = await getLichSu(1);

            console.log(res.data);

            setLichSu(res.data.data);

        }

        catch (err) {

            console.log(err);

        }

    };

    const hienThiTrangThai = (trangThai) => {

        switch (trangThai) {

            case 0:
                return "Chờ xác nhận";

            case 1:
                return "Đã xác nhận";

            case 2:
                return "Hoàn tất";

            case 3:
                return "Đã hủy";

            default:
                return "Không xác định";
        }

    };

    return (

        <div className="container py-5">

            <h2 className="mb-4">

                Lịch sử đặt lịch

            </h2>

            <table className="table table-bordered table-hover">

                <thead className="table-dark">

                    <tr>

                        <th>Mã lịch</th>

                        <th>Ngày</th>

                        <th>Giờ</th>

                        <th>Nhân viên</th>

                        <th>Trạng thái</th>

                        <th></th>

                    </tr>

                </thead>

                <tbody>

                    {

                        lichSu.map(item => (

                            <tr key={item.maLichHen}>

                                <td>{item.maLichHen}</td>

                                <td>{item.ngayHen}</td>

                                <td>{item.gioHen}</td>

                                <td>{item.tenNhanVien}</td>

                                <td>

                                    {hienThiTrangThai(item.trangThai)}

                                </td>

                                <td>

                                    <button
                                        className="btn btn-primary btn-sm"
                                        onClick={() => navigate(`/lich-su/${item.id}`)}
                                    >

                                        Xem chi tiết

                                    </button>

                                </td>

                            </tr>

                        ))

                    }

                </tbody>

            </table>

        </div>

    );

}

export default HistoryPage;