import { useEffect, useState } from "react";
import { getAllServices } from "../api/dichVuApi";
import ServiceCard from "../components/ServiceCard";

function ServicePage() {

    const [services, setServices] = useState([]);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const res = await getAllServices();
        setServices(res.data);
    };

    return (

        <div className="container py-5">

            <h2 className="text-center mb-5">

                TẤT CẢ DỊCH VỤ

            </h2>

            <div className="row g-4">

                {

                    services.map(service => (

                        <div
                            className="col-lg-4 col-md-6"
                            key={service.maDichVu}
                        >

                            <ServiceCard service={service}/>

                        </div>

                    ))

                }

            </div>

        </div>

    );

}

export default ServicePage;