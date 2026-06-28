import Banner from "../components/Banner";
import ServiceCard from "../components/ServiceCard";
import ProductCard from "../components/ProductCard";
import { useEffect, useState } from "react";
import { getAllServices } from "../api/dichVuApi";
import { getTop } from "../api/sanPhamApi";
import { Link } from "react-router-dom";

function HomePage() {
    const [services, setServices] = useState([]);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        loadServices();
        loadProducts();
    }, []);

    const loadServices = async () => {
        try {
            const res = await getAllServices();
            setServices(res.data.slice(0, 5));
        } catch (error) {
            console.log(error);
        }
    };

    const loadProducts = async () => {
        try {
            const res = await getTop();

            console.log("TOP PRODUCT DATA:", res.data);
            
            setProducts(res.data.slice(0, 5));
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            <Banner />

            <section className="container py-5">
                <h2 className="section-title">DỊCH VỤ NỔI BẬT</h2>

                <div className="row g-4">
                    {services.map((service) => (
                        <div className="col-lg-4 col-md-6" key={service.maDichVu}>
                            <ServiceCard service={service} />
                        </div>
                    ))}
                </div>

                <div className="text-center mt-4">
                    <Link to="/dichvu" className="btn btn-outline-dark">
                        Xem tất cả
                    </Link>
                </div>
            </section>

            <section className="container py-5">
                <h2 className="section-title">SẢN PHẨM BÁN CHẠY</h2>

                <div className="row g-4">
                    {products.map((product) => (
                        <div className="col-lg-3 col-md-6" key={product.maSanPham}>
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>

                <div className="text-center mt-4">
                    <Link to="/san-pham" className="btn btn-outline-dark">
                        Xem tất cả
                    </Link>
                </div>
            </section>

            <section className="bg-dark text-white py-5">
                <div className="container">
                    <h2 className="text-center mb-5">TẠI SAO CHỌN CHÚNG TÔI</h2>

                    <div className="row text-center">
                        <div className="col-md-3">
                            <h1>💈</h1>
                            <h4>Thợ chuyên nghiệp</h4>
                            <p>Kinh nghiệm nhiều năm.</p>
                        </div>

                        <div className="col-md-3">
                            <h1>⭐</h1>
                            <h4>Mỹ phẩm chính hãng</h4>
                            <p>100% hàng chất lượng.</p>
                        </div>

                        <div className="col-md-3">
                            <h1>📅</h1>
                            <h4>Đặt lịch online</h4>
                            <p>Nhanh chóng, tiện lợi.</p>
                        </div>

                        <div className="col-md-3">
                            <h1>❤️</h1>
                            <h4>Phục vụ tận tâm</h4>
                            <p>Luôn đặt khách hàng lên hàng đầu.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="container py-5">
                <h2 className="section-title">KHÁCH HÀNG NÓI GÌ?</h2>

                <div className="row">
                    <div className="col-md-4">
                        <div className="card shadow">
                            <div className="card-body">
                                ⭐⭐⭐⭐⭐
                                <p className="mt-3">"Cắt tóc rất đẹp, nhân viên thân thiện."</p>
                                <b>Nguyễn Văn A</b>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="card shadow">
                            <div className="card-body">
                                ⭐⭐⭐⭐⭐
                                <p className="mt-3">"Dịch vụ rất chuyên nghiệp."</p>
                                <b>Trần Thị B</b>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="card shadow">
                            <div className="card-body">
                                ⭐⭐⭐⭐⭐
                                <p className="mt-3">"Mình sẽ quay lại lần sau."</p>
                                <b>Lê Văn C</b>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default HomePage;