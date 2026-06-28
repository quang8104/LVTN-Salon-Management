import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import { getAll } from "../api/sanPhamApi";

function ProductPage() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            const res = await getAll();
            setProducts(res.data);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <section className="container py-5">
            <div className="text-center mb-5">
                <h2 className="section-title">TẤT CẢ SẢN PHẨM</h2>
                <p className="text-muted">
                    Các sản phẩm chăm sóc tóc và tạo kiểu tại salon
                </p>
            </div>

            <div className="row g-4">
                {products.map((product) => (
                    <div className="col-lg-3 col-md-6" key={product.maSanPham}>
                        <ProductCard product={product} />
                    </div>
                ))}

                {products.length === 0 && (
                    <div className="col-12 text-center">
                        <p className="text-muted">Chưa có sản phẩm nào.</p>
                    </div>
                )}
            </div>
        </section>
    );
}

export default ProductPage;