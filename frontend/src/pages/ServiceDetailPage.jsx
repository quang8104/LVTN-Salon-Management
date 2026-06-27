import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getServiceById } from "../api/dichVuApi";
import { useSelectedService } from "../context/SelectedServiceContext";

function ServiceDetailPage() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [service, setService] = useState(null);

    const {
        selectedServices,
        addService,
        removeService
    } = useSelectedService();

    useEffect(() => {

        loadService();

    }, [id]);

    const loadService = async () => {

        try {

            const res = await getServiceById(id);

            setService(res.data);

        } catch (err) {

            console.log(err);

        }

    };

    const daChon = service
    ? selectedServices.some(item => item.maDichVu === service.maDichVu)
    : false;

    const tongTien = useMemo(() => {

        return selectedServices.reduce(
            (sum, item) => sum + item.gia,
            0
        );

    }, [selectedServices]);

    const tongThoiGian = useMemo(() => {

        return selectedServices.reduce(
            (sum, item) => sum + item.thoiGianThucHien,
            0
        );

    }, [selectedServices]);

    if (!service) {

        return <h2 className="text-center mt-5">Loading...</h2>;

    }

   

    return (

        <div className="container py-5">

            <div className="row">

                <div className="col-md-6">

                    <img
                        src={
                            service.anhGioiThieu ||
                            "https://picsum.photos/600/400"
                        }
                        className="img-fluid rounded shadow"
                        alt={service.tenDichVu}
                    />

                </div>

                <div className="col-md-6">

                    <h2>{service.tenDichVu}</h2>

                    <h3 className="text-danger my-3">

                        {service.gia.toLocaleString()} VNĐ

                    </h3>

                    <p>{service.moTa}</p>

                    <h5>

                        Thời gian thực hiện:
                        {" "}
                        {service.thoiGianThucHien} phút

                    </h5>

                    <hr />

                    <div className="card">

                        <div className="card-body">

                            <h5>Dịch vụ đã chọn</h5>

                            {

                                selectedServices.length === 0 ?

                                    <p>Chưa có dịch vụ nào.</p>

                                    :

                                    <ul className="list-group">

                                        {

                                            selectedServices.map(item => (

                                                <li
                                                    key={item.maDichVu}
                                                    className="list-group-item d-flex justify-content-between align-items-center"
                                                >

                                                    <div>

                                                        <strong>{item.tenDichVu}</strong>

                                                        <br />

                                                        {item.gia.toLocaleString()} VNĐ

                                                    </div>

                                                    <button
                                                        className="btn btn-danger btn-sm"
                                                        onClick={() => removeService(item.maDichVu)}
                                                    >

                                                        X

                                                    </button>

                                                </li>

                                            ))

                                        }

                                    </ul>

                            }

                            <hr />

                            <h6>

                                Tổng thời gian:

                                {" "}

                                {tongThoiGian} phút

                            </h6>

                            <h5 className="text-danger">

                                Tổng tiền:

                                {" "}

                                {tongTien.toLocaleString()} VNĐ

                            </h5>

                        </div>

                    </div>

                    <div className="mt-4">

                        {

                            !daChon ?

                                <button
                                    className="btn btn-primary"
                                    onClick={() => addService(service)}
                                >

                                    + Thêm dịch vụ

                                </button>

                                :

                                <button
                                    className="btn btn-secondary"
                                    disabled
                                >

                                    Đã thêm

                                </button>

                        }

                        <button
                            className="btn btn-outline-success ms-2"
                            onClick={() => navigate("/dichvu")}
                        >

                            Chọn thêm dịch vụ

                        </button>

                        <button
                            className="btn btn-success ms-2"
                            disabled={selectedServices.length === 0}
                            onClick={() => navigate("/lich/dat-lich")}
                        >

                            Tiếp tục đặt lịch

                        </button>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default ServiceDetailPage;

