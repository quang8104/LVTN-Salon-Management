import { useEffect, useState } from "react";
import { getAllServices } from "../api/dichVuApi";
import ServiceCard from "../components/ServiceCard";

function ServicePage() {
    const [services, setServices] = useState([]);
    const [keyword, setKeyword] = useState("");

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const res = await getAllServices();

            const activeServices = res.data.filter(
                (item) => item.trangThai === 1
            );

            setServices(activeServices);
        } catch (error) {
            console.log(error);
        }
    };

    const filteredServices = services.filter((service) => {
        const text = keyword.trim().toLowerCase();

        if (!text) return true;

        return (
            service.tenDichVu?.toLowerCase().includes(text) ||
            service.moTa?.toLowerCase().includes(text) ||
            String(service.gia).includes(text)
        );
    });

    return (
        <div className="container py-5">
            <div className="text-center mb-4">
                <h2 className="mb-3">TẤT CẢ DỊCH VỤ</h2>
                <p className="text-muted">
                    Các dịch vụ chăm sóc và tạo kiểu tóc dành cho nam
                </p>
            </div>

            <div className="card border-0 shadow-sm mb-4">
                <div className="card-body">
                    <input
                        className="form-control"
                        placeholder="Tìm kiếm dịch vụ..."
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                    />
                </div>
            </div>

            <div className="mb-3 text-muted">
                Tìm thấy <b>{filteredServices.length}</b> dịch vụ
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
                    <div className="col-12 text-center py-5">
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