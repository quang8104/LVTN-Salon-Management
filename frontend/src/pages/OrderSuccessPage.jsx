import { Link, useParams } from "react-router-dom";

function OrderSuccessPage() {
    const { id } = useParams();

    return (
        <div className="container py-5">
            <div className="card border-0 shadow-sm mx-auto" style={{ maxWidth: "620px" }}>
                <div className="card-body text-center py-5">
                    <div className="display-1 mb-3">✅</div>

                    <h2 className="mb-3">Đặt hàng thành công</h2>

                    <p className="text-muted">
                        Đơn hàng #{id} đã được tạo thành công và đang chờ admin xác nhận.
                    </p>

                    <div className="d-flex justify-content-center gap-3 mt-4">
                        <Link to="/san-pham" className="btn btn-outline-dark">
                            Tiếp tục mua hàng
                        </Link>

                        <Link to="/don-hang-cua-toi" className="btn btn-dark">
                            Xem đơn hàng
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OrderSuccessPage;