import { Link } from "react-router-dom";

function ProductCard({ product }) {
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

                <p className="text-danger fw-bold">
                    {Number(product.gia).toLocaleString()} VNĐ
                </p>

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