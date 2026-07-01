import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getServiceById } from "../api/dichVuApi";

function ServiceDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [service, setService] = useState(null);

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

    const handleDatLich = () => {
        navigate("/dat-lich", {
            state: {
                serviceId: service.maDichVu
            }
        });
    };

    if (!service) {
        return <h2 className="text-center mt-5">Loading...</h2>;
    }

    return (
        <div className="container py-5">
            <div className="row g-4">
                <div className="col-md-6">
                    <img
                        src={service.anhGioiThieu || "https://picsum.photos/600/400"}
                        className="img-fluid rounded shadow"
                        alt={service.tenDichVu}
                        style={{
                            width: "100%",
                            maxHeight: "430px",
                            objectFit: "cover"
                        }}
                    />
                </div>

                <div className="col-md-6">
                    <h2>{service.tenDichVu}</h2>

                    <h3 className="text-danger my-3">
                        {Number(service.gia).toLocaleString()} VNĐ
                    </h3>

                    <p>{service.moTa}</p>

                    <h5>
                        Thời gian thực hiện: {service.thoiGianThucHien} phút
                    </h5>

                    <hr />

                    <button
                        className="btn btn-success me-2"
                        onClick={handleDatLich}
                    >
                        Đặt lịch dịch vụ này
                    </button>

                    <button
                        className="btn btn-outline-dark"
                        onClick={() => navigate("/dich-vu")}
                    >
                        Quay lại dịch vụ
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ServiceDetailPage;