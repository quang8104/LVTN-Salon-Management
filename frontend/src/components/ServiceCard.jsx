import { Link } from "react-router-dom";

function ServiceCard({ service }) {
    const hasDiscount = Number(service.phanTramGiam || 0) > 0;
    const giaGoc = Number(service.gia || 0);
    const giaSauGiam = Number(service.giaSauGiam || service.gia || 0);

    return (
        <div className="card h-100 shadow-sm border-0">
            <img
                src={service.anhGioiThieu || "https://picsum.photos/400/250"}
                className="card-img-top"
                alt={service.tenDichVu}
                style={{
                    height: "220px",
                    objectFit: "cover"
                }}
            />

            <div className="card-body d-flex flex-column">
                <h5>{service.tenDichVu}</h5>

                <p className="text-muted mb-1">
                    {service.thoiGianThucHien} phút
                </p>

                {hasDiscount ? (
                    <div className="mb-2">
                        <div className="text-muted text-decoration-line-through">
                            {giaGoc.toLocaleString()} VNĐ
                        </div>

                        <div className="text-danger fw-bold">
                            {giaSauGiam.toLocaleString()} VNĐ
                        </div>

                        <span className="badge bg-danger">
                            -{service.phanTramGiam}%
                        </span>
                    </div>
                ) : (
                    <p className="text-danger fw-bold mb-2">
                        {giaGoc.toLocaleString()} VNĐ
                    </p>
                )}

                <Link
                    className="btn btn-dark w-100 mt-auto"
                    to={`/dichvu/${service.maDichVu}`}
                >
                    Xem chi tiết
                </Link>
            </div>
        </div>
    );
}

export default ServiceCard;