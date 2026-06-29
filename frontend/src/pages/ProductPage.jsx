import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import { getAll } from "../api/sanPhamApi";
import { getActiveDanhMuc } from "../api/danhMucApi";

function ProductPage() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);

    const [selectedCategory, setSelectedCategory] = useState("ALL");
    const [keyword, setKeyword] = useState("");

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const spRes = await getAll();
            const dmRes = await getActiveDanhMuc();

            setProducts(spRes.data);
            setCategories(dmRes.data);
        } catch (error) {
            console.log(error);
        }
    };

    const filteredProducts = products.filter((product) => {
        const matchCategory =
            selectedCategory === "ALL" ||
            product.danhMuc?.maDanhMuc === Number(selectedCategory);

        const matchKeyword =
            product.tenSanPham
                ?.toLowerCase()
                .includes(keyword.toLowerCase());

        return matchCategory && matchKeyword;
    });

    return (
        <div className="container py-5">
            <div className="text-center mb-5">
                <h2 className="section-title">TẤT CẢ SẢN PHẨM</h2>
                <p className="text-muted">
                    Các sản phẩm chăm sóc tóc và tạo kiểu tại salon
                </p>
            </div>

            <div className="card border-0 shadow-sm mb-4">
                <div className="card-body">
                    <div className="row g-3 align-items-end">
                        <div className="col-md-5">
                            <label className="form-label">Tìm kiếm sản phẩm</label>
                            <input
                                className="form-control"
                                placeholder="Nhập tên sản phẩm..."
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                            />
                        </div>

                        <div className="col-md-5">
                            <label className="form-label">Danh mục</label>
                            <select
                                className="form-select"
                                value={selectedCategory}
                                onChange={(e) =>
                                    setSelectedCategory(e.target.value)
                                }
                            >
                                <option value="ALL">Tất cả danh mục</option>

                                {categories.map((item) => (
                                    <option
                                        key={item.maDanhMuc}
                                        value={item.maDanhMuc}
                                    >
                                        {item.tenDanhMuc}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="col-md-2">
                            <button
                                className="btn btn-outline-dark w-100"
                                onClick={() => {
                                    setKeyword("");
                                    setSelectedCategory("ALL");
                                }}
                            >
                                Làm mới
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mb-3 text-muted">
                Tìm thấy <b>{filteredProducts.length}</b> sản phẩm
            </div>

            <div className="row g-4">
                {filteredProducts.map((product) => (
                    <div
                        className="col-lg-3 col-md-6"
                        key={product.maSanPham}
                    >
                        <ProductCard product={product} />
                    </div>
                ))}

                {filteredProducts.length === 0 && (
                    <div className="col-12 text-center py-5">
                        <h5>Không tìm thấy sản phẩm phù hợp</h5>
                        <p className="text-muted">
                            Hãy thử chọn danh mục khác hoặc đổi từ khóa tìm kiếm.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ProductPage;