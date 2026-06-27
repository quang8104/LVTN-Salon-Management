import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {getHistoryById,huyLich} from "../api/lichSuApi";

function HistoryDetailPage() {

    const { id } = useParams();

    const [lich, setLich] = useState(null);

    useEffect(() => {

        loadDetail();

    }, []);

    const handleHuy = async () => {

        if (!window.confirm("Bạn có chắc muốn hủy lịch?")) {

            return;

        }

        try {

            await huyLich(lich.id);

            alert("Hủy lịch thành công");

            loadDetail();

        }

        catch (err) {

            console.log(err);

            alert("Không thể hủy lịch");

        }

    }

    const loadDetail = async () => {

        try {

            const res = await getHistoryById(id);

            setLich(res.data.data);

        } catch (err) {

            console.log(err);

        }

    };

    if (!lich) {

        return <h2>Loading...</h2>;

    }

    return (

        <div className="container py-5">

            <div className="card">

                <div className="card-body">

                    <h2 className="mb-4">

                        Chi tiết lịch hẹn

                    </h2>

                    <p>

                        <strong>Ngày hẹn:</strong>

                        {" "}

                        {lich.ngayHen}

                    </p>

                    <p>

                        <strong>Giờ hẹn:</strong>

                        {" "}

                        {lich.gioHen}

                    </p>

                    <p>

                        <strong>Nhân viên:</strong>

                        {" "}

                        {lich.tenNhanVien}

                    </p>

                    <hr />

                    <h4>Dịch vụ</h4>

                    {

                        lich.danhSachDichVu.map(item => (

                            <div
                                key={item.maDichVu}
                                className="d-flex justify-content-between border-bottom py-2"
                            >

                                <div>

                                    {item.tenDichVu}

                                    <br />

                                    <small>

                                        {item.thoiGian} phút

                                    </small>

                                </div>

                                <div>

                                    {item.donGia.toLocaleString()} VNĐ

                                </div>

                            </div>

                        ))

                    }

                    <hr />

                    <h4 className="text-danger">

                        Tổng tiền:

                        {" "}

                        {lich.tongTien.toLocaleString()} VNĐ

                    </h4>
                    <hr />

                    <h5>

                        Trạng thái:

                        {" "}

                        {lich.trangThaiText}

                    </h5>

                    {

                        lich.trangThai === 0 && (

                            <button
                                className="btn btn-danger mt-3"
                                onClick={handleHuy}
                            >

                                Hủy lịch

                            </button>

                        )

                    }

                </div>

            </div>

        </div>

    );

}

export default HistoryDetailPage;