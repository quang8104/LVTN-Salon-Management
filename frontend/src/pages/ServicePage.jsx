import { useEffect, useState } from "react";
import { getAllServices } from "../api/dichVuApi";
import ServiceCard from "../components/ServiceCard";

function ServicePage() {
    const [services, setServices] = useState([]);
    const [filter, setFilter] = useState(2);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const res = await getAllServices();
        setServices(res.data);
    };

    const filteredServices =
        filter === 2
            ? services
            : services.filter((service) => service.doiTuong === filter);

    return (
        <div className="container py-5">
            <div className="text-center mb-4">
                <h2 className="mb-3">TẤT CẢ DỊCH VỤ</h2>

                <div className="btn-group">
                    <button
                        className={
                            filter === 2
                                ? "btn btn-dark"
                                : "btn btn-outline-dark"
                        }
                        onClick={() => setFilter(2)}
                    >
                        Tất cả
                    </button>

                    <button
                        className={
                            filter === 0
                                ? "btn btn-dark"
                                : "btn btn-outline-dark"
                        }
                        onClick={() => setFilter(0)}
                    >
                        Nam
                    </button>

                    <button
                        className={
                            filter === 1
                                ? "btn btn-dark"
                                : "btn btn-outline-dark"
                        }
                        onClick={() => setFilter(1)}
                    >
                        Nữ
                    </button>
                </div>
            </div>

            <div className="row g-4">
                {filteredServices.map((service) => (
                    <div
                        className="col-lg-4 col-md-6"
                        key={service.maDichVu}
                    >
                        <ServiceCard service={service} />
                    </div>
                ))}

                {filteredServices.length === 0 && (
                    <div className="col-12 text-center">
                        <p className="text-muted">
                            Không có dịch vụ phù hợp.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ServicePage;