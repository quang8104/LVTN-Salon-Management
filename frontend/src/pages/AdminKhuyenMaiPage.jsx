import { useEffect, useState } from "react";
import {
    getAllKhuyenMai,
    getChiTietKhuyenMai,
    createKhuyenMai,
    updateKhuyenMai,
    deleteKhuyenMai
} from "../api/adminKhuyenMaiApi";
import { getAllSanPham } from "../api/adminSanPhamApi";
import { getAllDichVu } from "../api/adminDichVuApi";

function AdminKhuyenMaiPage() {
    const [list, setList] = useState([]);
    const [sanPhamList, setSanPhamList] = useState([]);
    const [dichVuList, setDichVuList] = useState([]);

    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const [showDetail, setShowDetail] = useState(false);
    const [selectedKhuyenMai, setSelectedKhuyenMai] = useState(null);
    const [detailChiTiet, setDetailChiTiet] = useState([]);

    const [keyword, setKeyword] = useState("");
    const [productKeyword, setProductKeyword] = useState("");
    const [serviceKeyword, setServiceKeyword] = useState("");

    const today = new Date().toISOString().split("T")[0];

    const [form, setForm] = useState({
        tenKhuyenMai: "",
        moTa: "",
        phanTramGiam: "",
        ngayBatDau: "",
        ngayKetThuc: "",
        trangThai: 1,
        sanPhamIds: [],
        dichVuIds: []
    });

    useEffect(() => {
        loadData();
        loadSanPhamDichVu();
    }, []);

    const loadData = async () => {
        const res = await getAllKhuyenMai();
        const data = Array.isArray(res.data) ? res.data : [];

        data.sort((a, b) => b.maKhuyenMai - a.maKhuyenMai);
        setList(data);
    };

    const loadSanPhamDichVu = async () => {
        const spRes = await getAllSanPham();
        const dvRes = await getAllDichVu();

        const spData = Array.isArray(spRes.data) ? spRes.data : spRes.data.data || [];
        const dvData = Array.isArray(dvRes.data) ? dvRes.data : dvRes.data.data || [];

        setSanPhamList(spData.filter((sp) => sp.trangThai === 1));
        setDichVuList(dvData.filter((dv) => dv.trangThai === 1));
    };

    const resetForm = () => {
        setForm({
            tenKhuyenMai: "",
            moTa: "",
            phanTramGiam: "",
            ngayBatDau: "",
            ngayKetThuc: "",
            trangThai: 1,
            sanPhamIds: [],
            dichVuIds: []
        });

        setEditingId(null);
        setProductKeyword("");
        setServiceKeyword("");
        setShowForm(false);
    };

    const change = (e) => {
        const { name, value } = e.target;

        if (name === "ngayBatDau") {
            setForm((prev) => ({
                ...prev,
                ngayBatDau: value,
                ngayKetThuc:
                    prev.ngayKetThuc && prev.ngayKetThuc < value
                        ? ""
                        : prev.ngayKetThuc
            }));
            return;
        }

        setForm({
            ...form,
            [name]: value
        });
    };

    const toggleSanPham = (id) => {
        const exists = form.sanPhamIds.includes(id);

        setForm({
            ...form,
            sanPhamIds: exists
                ? form.sanPhamIds.filter((x) => x !== id)
                : [...form.sanPhamIds, id]
        });
    };

    const toggleDichVu = (id) => {
        const exists = form.dichVuIds.includes(id);

        setForm({
            ...form,
            dichVuIds: exists
                ? form.dichVuIds.filter((x) => x !== id)
                : [...form.dichVuIds, id]
        });
    };

    const submit = async (e) => {
        e.preventDefault();

        if (!form.tenKhuyenMai.trim()) {
            alert("Vui lòng nhập tên khuyến mãi");
            return;
        }

        if (Number(form.phanTramGiam) <= 0 || Number(form.phanTramGiam) > 100) {
            alert("Phần trăm giảm phải từ 1 đến 100");
            return;
        }

        if (!form.ngayBatDau || !form.ngayKetThuc) {
            alert("Vui lòng chọn ngày bắt đầu và ngày kết thúc");
            return;
        }

        if (form.ngayBatDau < today) {
            alert("Không được chọn ngày bắt đầu trong quá khứ");
            return;
        }

        if (form.ngayKetThuc < form.ngayBatDau) {
            alert("Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu");
            return;
        }

        if (form.sanPhamIds.length === 0 && form.dichVuIds.length === 0) {
            alert("Vui lòng chọn ít nhất một sản phẩm hoặc một dịch vụ");
            return;
        }

        const data = {
            ...form,
            phanTramGiam: Number(form.phanTramGiam),
            trangThai: Number(form.trangThai)
        };

        try {
            if (editingId) {
                await updateKhuyenMai(editingId, data);
                alert("Cập nhật khuyến mãi thành công");
            } else {
                await createKhuyenMai(data);
                alert("Thêm khuyến mãi thành công");
            }

            resetForm();
            loadData();
        } catch (error) {
            alert(error.response?.data || "Lưu khuyến mãi thất bại");
        }
    };

    const edit = async (item) => {
        const ctRes = await getChiTietKhuyenMai(item.maKhuyenMai);
        const chiTiet = Array.isArray(ctRes.data) ? ctRes.data : [];

        setEditingId(item.maKhuyenMai);
        setShowForm(true);
        setProductKeyword("");
        setServiceKeyword("");

        setForm({
            tenKhuyenMai: item.tenKhuyenMai || "",
            moTa: item.moTa || "",
            phanTramGiam: item.phanTramGiam || "",
            ngayBatDau: item.ngayBatDau || "",
            ngayKetThuc: item.ngayKetThuc || "",
            trangThai: item.trangThai ?? 1,
            sanPhamIds: chiTiet
                .filter((ct) => ct.loaiApDung === 1 && ct.sanPham)
                .map((ct) => ct.sanPham.maSanPham),
            dichVuIds: chiTiet
                .filter((ct) => ct.loaiApDung === 2 && ct.dichVu)
                .map((ct) => ct.dichVu.maDichVu)
        });

        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const detail = async (item) => {
        const res = await getChiTietKhuyenMai(item.maKhuyenMai);

        setSelectedKhuyenMai(item);
        setDetailChiTiet(Array.isArray(res.data) ? res.data : []);
        setShowDetail(true);
    };

    const remove = async (id) => {
        if (!window.confirm("Bạn có chắc muốn ngừng khuyến mãi này?")) return;

        await deleteKhuyenMai(id);
        alert("Đã ngừng khuyến mãi");
        loadData();
    };

    const filteredList = list.filter((item) => {
        const text = keyword.toLowerCase().trim();

        return (
            `KM${item.maKhuyenMai}`.toLowerCase().includes(text) ||
            item.tenKhuyenMai?.toLowerCase().includes(text) ||
            String(item.phanTramGiam || "").includes(text)
        );
    });

    const trangThaiText = (value) => {
        return value === 1 ? "Đang áp dụng" : "Ngừng";
    };

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="mb-0">Quản lý khuyến mãi</h2>

                {!showForm && (
                    <button
                        className="btn btn-primary"
                        onClick={() => setShowForm(true)}
                    >
                        + Thêm khuyến mãi
                    </button>
                )}
            </div>

            {showForm && (
                <div className="card border-0 shadow-sm mb-4">
                    <div className="card-header bg-white d-flex justify-content-between">
                        <b>{editingId ? "Cập nhật khuyến mãi" : "Thêm khuyến mãi"}</b>

                        <button
                            type="button"
                            className="btn btn-sm btn-outline-secondary"
                            onClick={resetForm}
                        >
                            Đóng
                        </button>
                    </div>

                    <div className="card-body">
                        <form onSubmit={submit}>
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label>Tên khuyến mãi</label>
                                    <input
                                        className="form-control"
                                        name="tenKhuyenMai"
                                        value={form.tenKhuyenMai}
                                        onChange={change}
                                        required
                                    />
                                </div>

                                <div className="col-md-3 mb-3">
                                    <label>Phần trăm giảm</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        name="phanTramGiam"
                                        value={form.phanTramGiam}
                                        onChange={change}
                                        min="1"
                                        max="100"
                                        required
                                    />
                                </div>

                                <div className="col-md-3 mb-3">
                                    <label>Trạng thái</label>
                                    <select
                                        className="form-select"
                                        name="trangThai"
                                        value={form.trangThai}
                                        onChange={change}
                                    >
                                        <option value={1}>Đang áp dụng</option>
                                        <option value={0}>Ngừng</option>
                                    </select>
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label>Ngày bắt đầu</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        name="ngayBatDau"
                                        value={form.ngayBatDau}
                                        min={today}
                                        onChange={change}
                                        required
                                    />
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label>Ngày kết thúc</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        name="ngayKetThuc"
                                        value={form.ngayKetThuc}
                                        min={form.ngayBatDau || today}
                                        onChange={change}
                                        required
                                    />
                                </div>

                                <div className="col-md-12 mb-3">
                                    <label>Mô tả</label>
                                    <textarea
                                        className="form-control"
                                        rows="2"
                                        name="moTa"
                                        value={form.moTa}
                                        onChange={change}
                                    ></textarea>
                                </div>

                                <div className="col-md-6 mb-3">
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <label>Sản phẩm áp dụng</label>

                                        <div>
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-outline-primary me-2"
                                                onClick={() =>
                                                    setForm({
                                                        ...form,
                                                        sanPhamIds: sanPhamList.map((sp) => sp.maSanPham)
                                                    })
                                                }
                                            >
                                                Chọn tất cả
                                            </button>

                                            <button
                                                type="button"
                                                className="btn btn-sm btn-outline-secondary"
                                                onClick={() =>
                                                    setForm({
                                                        ...form,
                                                        sanPhamIds: []
                                                    })
                                                }
                                            >
                                                Bỏ chọn
                                            </button>
                                        </div>
                                    </div>

                                    <input
                                        className="form-control mb-2"
                                        placeholder="Tìm sản phẩm..."
                                        value={productKeyword}
                                        onChange={(e) => setProductKeyword(e.target.value)}
                                    />

                                    <div
                                        className="border rounded p-2"
                                        style={{ maxHeight: "250px", overflowY: "auto" }}
                                    >
                                        {sanPhamList
                                            .filter((sp) =>
                                                sp.tenSanPham
                                                    ?.toLowerCase()
                                                    .includes(productKeyword.toLowerCase())
                                            )
                                            .map((sp) => (
                                                <div
                                                    key={sp.maSanPham}
                                                    className="d-flex justify-content-between align-items-center border-bottom py-2"
                                                >
                                                    <label className="form-check mb-0">
                                                        <input
                                                            type="checkbox"
                                                            className="form-check-input"
                                                            checked={form.sanPhamIds.includes(sp.maSanPham)}
                                                            onChange={() => toggleSanPham(sp.maSanPham)}
                                                        />

                                                        <span className="form-check-label ms-2">
                                                            {sp.tenSanPham}
                                                        </span>
                                                    </label>

                                                    <small className="text-muted">
                                                        {Number(sp.gia || 0).toLocaleString()} VNĐ
                                                    </small>
                                                </div>
                                            ))}
                                    </div>
                                </div>

                                <div className="col-md-6 mb-3">
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <label>Dịch vụ áp dụng</label>

                                        <div>
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-outline-primary me-2"
                                                onClick={() =>
                                                    setForm({
                                                        ...form,
                                                        dichVuIds: dichVuList.map((dv) => dv.maDichVu)
                                                    })
                                                }
                                            >
                                                Chọn tất cả
                                            </button>

                                            <button
                                                type="button"
                                                className="btn btn-sm btn-outline-secondary"
                                                onClick={() =>
                                                    setForm({
                                                        ...form,
                                                        dichVuIds: []
                                                    })
                                                }
                                            >
                                                Bỏ chọn
                                            </button>
                                        </div>
                                    </div>

                                    <input
                                        className="form-control mb-2"
                                        placeholder="Tìm dịch vụ..."
                                        value={serviceKeyword}
                                        onChange={(e) => setServiceKeyword(e.target.value)}
                                    />

                                    <div
                                        className="border rounded p-2"
                                        style={{ maxHeight: "250px", overflowY: "auto" }}
                                    >
                                        {dichVuList
                                            .filter((dv) =>
                                                dv.tenDichVu
                                                    ?.toLowerCase()
                                                    .includes(serviceKeyword.toLowerCase())
                                            )
                                            .map((dv) => (
                                                <div
                                                    key={dv.maDichVu}
                                                    className="d-flex justify-content-between align-items-center border-bottom py-2"
                                                >
                                                    <label className="form-check mb-0">
                                                        <input
                                                            type="checkbox"
                                                            className="form-check-input"
                                                            checked={form.dichVuIds.includes(dv.maDichVu)}
                                                            onChange={() => toggleDichVu(dv.maDichVu)}
                                                        />

                                                        <span className="form-check-label ms-2">
                                                            {dv.tenDichVu}
                                                        </span>
                                                    </label>

                                                    <small className="text-muted">
                                                        {dv.thoiGianThucHien} phút - {Number(dv.gia || 0).toLocaleString()} VNĐ
                                                    </small>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            </div>

                            <button className="btn btn-primary me-2">
                                {editingId ? "Cập nhật" : "Thêm"}
                            </button>

                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={resetForm}
                            >
                                Hủy
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <div className="card border-0 shadow-sm mb-3">
                <div className="card-body">
                    <input
                        className="form-control"
                        placeholder="Tìm theo mã, tên khuyến mãi, phần trăm giảm..."
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                    />
                </div>
            </div>

            <div className="card border-0 shadow-sm">
                <div className="card-header bg-white d-flex justify-content-between align-items-center">
                    <b>Danh sách khuyến mãi</b>
                    <span className="badge bg-primary">
                        {filteredList.length} khuyến mãi
                    </span>
                </div>

                <div className="card-body p-0">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-dark">
                            <tr>
                                <th>Mã</th>
                                <th>Tên khuyến mãi</th>
                                <th>Giảm</th>
                                <th>Thời gian</th>
                                <th>Trạng thái</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredList.map((item) => (
                                <tr key={item.maKhuyenMai}>
                                    <td>KM{item.maKhuyenMai}</td>
                                    <td>
                                        <div className="fw-semibold">
                                            {item.tenKhuyenMai}
                                        </div>
                                        <small>{item.moTa}</small>
                                    </td>
                                    <td>{item.phanTramGiam}%</td>
                                    <td>
                                        {item.ngayBatDau} → {item.ngayKetThuc}
                                    </td>
                                    <td>
                                        <span
                                            className={
                                                item.trangThai === 1
                                                    ? "badge bg-success"
                                                    : "badge bg-secondary"
                                            }
                                        >
                                            {trangThaiText(item.trangThai)}
                                        </span>
                                    </td>
                                    <td>
                                        <button
                                            className="btn btn-secondary btn-sm me-2"
                                            onClick={() => detail(item)}
                                        >
                                            Chi tiết
                                        </button>

                                        <button
                                            className="btn btn-warning btn-sm me-2"
                                            onClick={() => edit(item)}
                                        >
                                            Sửa
                                        </button>

                                        {item.trangThai === 1 && (
                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => remove(item.maKhuyenMai)}
                                            >
                                                Ngừng
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}

                            {filteredList.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="text-center py-4">
                                        Không tìm thấy khuyến mãi
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {showDetail && selectedKhuyenMai && (
                <div
                    className="modal d-block"
                    tabIndex="-1"
                    style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
                >
                    <div className="modal-dialog modal-lg modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    Chi tiết khuyến mãi KM{selectedKhuyenMai.maKhuyenMai}
                                </h5>

                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowDetail(false)}
                                ></button>
                            </div>

                            <div className="modal-body">
                                <p><b>Tên khuyến mãi:</b> {selectedKhuyenMai.tenKhuyenMai}</p>
                                <p><b>Mô tả:</b> {selectedKhuyenMai.moTa || "-"}</p>
                                <p><b>Phần trăm giảm:</b> {selectedKhuyenMai.phanTramGiam}%</p>
                                <p>
                                    <b>Thời gian:</b> {selectedKhuyenMai.ngayBatDau} → {selectedKhuyenMai.ngayKetThuc}
                                </p>
                                <p>
                                    <b>Trạng thái:</b>{" "}
                                    {selectedKhuyenMai.trangThai === 1 ? "Đang áp dụng" : "Ngừng"}
                                </p>

                                <hr />

                                <h6>Sản phẩm áp dụng</h6>
                                {detailChiTiet.filter((ct) => ct.loaiApDung === 1 && ct.sanPham).length === 0 ? (
                                    <p className="text-muted">Không áp dụng sản phẩm nào</p>
                                ) : (
                                    <ul>
                                        {detailChiTiet
                                            .filter((ct) => ct.loaiApDung === 1 && ct.sanPham)
                                            .map((ct) => (
                                                <li key={ct.maChiTiet}>
                                                    {ct.sanPham.tenSanPham} -{" "}
                                                    {Number(ct.sanPham.gia || 0).toLocaleString()} VNĐ
                                                </li>
                                            ))}
                                    </ul>
                                )}

                                <h6>Dịch vụ áp dụng</h6>
                                {detailChiTiet.filter((ct) => ct.loaiApDung === 2 && ct.dichVu).length === 0 ? (
                                    <p className="text-muted">Không áp dụng dịch vụ nào</p>
                                ) : (
                                    <ul>
                                        {detailChiTiet
                                            .filter((ct) => ct.loaiApDung === 2 && ct.dichVu)
                                            .map((ct) => (
                                                <li key={ct.maChiTiet}>
                                                    {ct.dichVu.tenDichVu} -{" "}
                                                    {Number(ct.dichVu.gia || 0).toLocaleString()} VNĐ
                                                </li>
                                            ))}
                                    </ul>
                                )}
                            </div>

                            <div className="modal-footer">
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => setShowDetail(false)}
                                >
                                    Đóng
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminKhuyenMaiPage;