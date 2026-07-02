import { Link } from "react-router-dom";

function ProductCard({ product }) {
    const hasDiscount = Number(product.phanTramGiam || 0) > 0;
    const giaGoc = Number(product.gia || 0);
    const giaSauGiam = Number(product.giaSauGiam || product.gia || 0);

    return (
        <div className="card h-100 shadow-sm border-0">
            {product.hinhAnh ? (
                <img
                    src={product.hinhAnh}
                    className="card-img-top"
                    alt={product.tenSanPham}
                    style={{
                        height: "220px",
                        objectFit: "cover"
                    }}
                />
            ) : (
                <div
                    className="bg-light d-flex align-items-center justify-content-center"
                    style={{ height: "220px" }}
                >
                    <span className="text-muted">Không có ảnh</span>
                </div>
            )}

            <div className="card-body d-flex flex-column">
                <h5>{product.tenSanPham}</h5>

                {hasDiscount ? (
                    <div className="mb-2">
                        <div>
                            <span className="text-muted text-decoration-line-through">
                                {giaGoc.toLocaleString()} VNĐ
                            </span>
                        </div>

                        <div className="text-danger fw-bold">
                            {giaSauGiam.toLocaleString()} VNĐ
                        </div>

                        <span className="badge bg-danger">
                            -{product.phanTramGiam}%
                        </span>
                    </div>
                ) : (
                    <p className="text-danger fw-bold mb-2">
                        {giaGoc.toLocaleString()} VNĐ
                    </p>
                )}

                <p className="text-muted small">
                    Còn: {product.soLuongTon}
                </p>

                <Link
                    to={`/san-pham/${product.maSanPham}`}
                    className="btn btn-dark mt-auto"
                >
                    Xem chi tiết
                </Link>
            </div>
        </div>
    );
}

export default ProductCard;