import { useEffect, useState } from "react";
import { getAllDichVuKhuyenMai } from "../api/dichVuApi";
import ServiceCard from "../components/ServiceCard";
import { getActiveDanhMucDichVu } from "../api/danhMucDichVuApi";

function ServicePage() {
    const [services, setServices] = useState([]);
    const [categories, setCategories] = useState([]);

    const [keyword, setKeyword] = useState("");
    const [genderFilter, setGenderFilter] = useState("ALL");
    const [selectedCategory, setSelectedCategory] = useState("ALL");

    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 6;

    useEffect(() => {
        loadData();
    }, []);

    const parseData = (data) => {
        if (Array.isArray(data)) return data;

        if (typeof data === "string") {
            try {
                const parsed = JSON.parse(data);
                return parseData(parsed);
            } catch (error) {
                console.log("Không parse được JSON:", error);
                return [];
            }
        }

        if (Array.isArray(data?.data)) return data.data;
        if (Array.isArray(data?.content)) return data.content;

        return [];
    };

    const loadData = async () => {
        try {
            const dvRes = await getAllDichVuKhuyenMai();
            const dmRes = await getActiveDanhMucDichVu();

            const dvData = parseData(dvRes.data);
            const dmData = parseData(dmRes.data);

            console.log("Dịch vụ sau parse:", dvData);

            setServices(
                dvData.filter((item) => Number(item.trangThai ?? 1) === 1)
            );

            setCategories(dmData);
        } catch (error) {
            console.log("Lỗi load dịch vụ:", error);
        }
    };

    const gioiTinhText = (value) => {
        switch (Number(value)) {
            case 1:
                return "Nam";
            case 2:
                return "Nữ";
            default:
                return "Cả nam và nữ";
        }
    };

    const filteredServices = services.filter((service) => {
        const text = keyword.trim().toLowerCase();

        const matchKeyword =
            !text ||
            service.tenDichVu?.toLowerCase().includes(text) ||
            service.moTa?.toLowerCase().includes(text) ||
            String(service.gia).includes(text) ||
            String(service.giaSauGiam).includes(text) ||
            gioiTinhText(service.gioiTinhApDung).toLowerCase().includes(text);

        const matchGender =
            genderFilter === "ALL" ||
            Number(service.gioiTinhApDung ?? 0) === 0 ||
            Number(service.gioiTinhApDung) === Number(genderFilter);

        const matchCategory =
            selectedCategory === "ALL" ||
            Number(service.maDanhMucDichVu) === Number(selectedCategory);

        return matchKeyword && matchGender && matchCategory;
    });

    const totalPages = Math.ceil(filteredServices.length / pageSize);
    const startIndex = (currentPage - 1) * pageSize;

    const currentServices = filteredServices.slice(
        startIndex,
        startIndex + pageSize
    );

    return (
        <div className="container py-5">
            <div className="card border-0 shadow-sm mb-4">
                <div className="card-body">
                    <div className="row g-3 align-items-end">
                        <div className="col-md-4">
                            <label className="form-label">Tìm kiếm dịch vụ</label>
                            <input
                                className="form-control"
                                placeholder="Nhập tên dịch vụ..."
                                value={keyword}
                                onChange={(e) => {
                                    setKeyword(e.target.value);
                                    setCurrentPage(1);
                                }}
                            />
                        </div>

                        <div className="col-md-3">
                            <label className="form-label">Danh mục</label>
                            <select
                                className="form-select"
                                value={selectedCategory}
                                onChange={(e) => {
                                    setSelectedCategory(e.target.value);
                                    setCurrentPage(1);
                                }}
                            >
                                <option value="ALL">Tất cả danh mục</option>

                                {categories.map((item) => (
                                    <option
                                        key={item.maDanhMucDichVu}
                                        value={item.maDanhMucDichVu}
                                    >
                                        {item.tenDanhMuc}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="col-md-3">
                            <label className="form-label">Giới tính</label>
                            <select
                                className="form-select"
                                value={genderFilter}
                                onChange={(e) => {
                                    setGenderFilter(e.target.value);
                                    setCurrentPage(1);
                                }}
                            >
                                <option value="ALL">Tất cả</option>
                                <option value="1">Nam</option>
                                <option value="2">Nữ</option>
                            </select>
                        </div>

                        <div className="col-md-2">
                            <button
                                className="btn btn-outline-dark w-100"
                                onClick={() => {
                                    setKeyword("");
                                    setSelectedCategory("ALL");
                                    setGenderFilter("ALL");
                                    setCurrentPage(1);
                                }}
                            >
                                Làm mới
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mb-3 text-muted">
                Tìm thấy <b>{filteredServices.length}</b> dịch vụ
            </div>

            <div className="row g-4">
                {currentServices.map((service) => (
                    <div
                        className="col-lg-4 col-md-6"
                        key={service.maDichVu}
                    >
                        <ServiceCard service={service} />
                    </div>
                ))}

                {filteredServices.length === 0 && (
                    <div className="col-12 text-center py-5">
                        <h5>Không tìm thấy dịch vụ phù hợp</h5>
                        <p className="text-muted">
                            Hãy thử đổi từ khóa hoặc bộ lọc.
                        </p>
                    </div>
                )}
            </div>

            {totalPages > 1 && (
                <div className="d-flex justify-content-center mt-5">
                    <nav>
                        <ul className="pagination">
                            {Array.from({ length: totalPages }, (_, index) => (
                                <li
                                    key={index + 1}
                                    className={`page-item ${
                                        currentPage === index + 1
                                            ? "active"
                                            : ""
                                    }`}
                                >
                                    <button
                                        className="page-link"
                                        onClick={() => setCurrentPage(index + 1)}
                                    >
                                        {index + 1}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>
            )}
        </div>
    );
}

export default ServicePage;