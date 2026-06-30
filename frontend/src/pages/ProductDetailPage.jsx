import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getById } from "../api/sanPhamApi";

function ProductDetailPage() {
    const { id } = useParams();

    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        loadProduct();
    }, [id]);

    const loadProduct = async () => {
        try {
            const res = await getById(id);
            setProduct(res.data);
        } catch (error) {
            console.log(error);
        }
    };

    const tangSoLuong = () => {
        if (quantity < product.soLuongTon) {
            setQuantity(quantity + 1);
        }
    };

    const giamSoLuong = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    const themVaoGioHang = () => {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];

        const index = cart.findIndex(
            item => item.maSanPham === product.maSanPham
        );

        if (index !== -1) {
            cart[index].soLuong += quantity;
        } else {
            cart.push({
                maSanPham: product.maSanPham,
                tenSanPham: product.tenSanPham,
                gia: product.gia,
                hinhAnh: product.hinhAnh,
                soLuong: quantity
            });
        }

        localStorage.setItem("cart", JSON.stringify(cart));
        window.dispatchEvent(new Event("cartUpdated"));
        alert("Đã thêm sản phẩm vào giỏ hàng");
    };

    if (!product) {
        return (
            <div className="container py-5 text-center">
                <p>Đang tải sản phẩm...</p>
            </div>
        );
    }

    return (
        <div className="container py-5">
            <Link to="/san-pham" className="btn btn-outline-dark mb-4">
                ← Quay lại sản phẩm
            </Link>

            <div className="row g-5">
                <div className="col-md-6">
                    <div className="card border-0 shadow-sm">
                        {product.hinhAnh ? (
                            <img
                                src={product.hinhAnh}
                                alt={product.tenSanPham}
                                style={{
                                    width: "100%",
                                    height: "450px",
                                    objectFit: "cover",
                                    borderRadius: "8px"
                                }}
                            />
                        ) : (
                            <div
                                className="bg-light d-flex align-items-center justify-content-center"
                                style={{ height: "450px" }}
                            >
                                <span className="text-muted">
                                    Không có ảnh
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="col-md-6">
                    <h2 className="fw-bold mb-3">
                        {product.tenSanPham}
                    </h2>

                    <h3 className="text-danger fw-bold mb-3">
                        {Number(product.gia).toLocaleString()} VNĐ
                    </h3>

                    <p className="mb-2">
                        <strong>Còn:</strong>{" "}
                        {product.soLuongTon > 0
                            ? product.soLuongTon
                            : "Hết hàng"}
                    </p>

                    <p className="mb-4">
                        <strong>Trạng thái:</strong>{" "}
                        {product.trangThai === 1
                            ? "Đang bán"
                            : "Ngừng bán"}
                    </p>

                    <hr />

                    <h5>Mô tả sản phẩm</h5>
                    <p className="text-muted">
                        {product.moTa || "Chưa có mô tả cho sản phẩm này."}
                    </p>

                    <hr />

                    <div className="d-flex align-items-center mb-4">
                        <span className="me-3 fw-bold">Số lượng:</span>

                        <button
                            className="btn btn-outline-dark"
                            onClick={giamSoLuong}
                            disabled={quantity <= 1}
                        >
                            -
                        </button>

                        <input
                            className="form-control text-center mx-2"
                            style={{ width: "70px" }}
                            value={quantity}
                            readOnly
                        />

                        <button
                            className="btn btn-outline-dark"
                            onClick={tangSoLuong}
                            disabled={quantity >= product.soLuongTon}
                        >
                            +
                        </button>
                    </div>

                    <div className="d-flex gap-3">
                        <button
                            className="btn btn-dark px-4"
                            onClick={themVaoGioHang}
                            disabled={
                                product.soLuongTon <= 0 ||
                                product.trangThai !== 1
                            }
                        >
                            Thêm vào giỏ hàng
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductDetailPage;