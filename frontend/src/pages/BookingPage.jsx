import { useEffect, useState } from "react";
import { getAllServices } from "../api/dichVuApi";
import { taoLich } from "../api/lichHenApi";
import { filterBooking } from "../api/bookingApi";

function BookingPage() {
    const userId = localStorage.getItem("userId");

    const [services, setServices] = useState([]);
    const [selectedServices, setSelectedServices] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [slots, setSlots] = useState([]);

    const [form, setForm] = useState({
        maNhanVien: "",
        ngayHen: "",
        gioHen: ""
    });

    useEffect(() => {
        loadServices();
    }, []);

    useEffect(() => {
        syncBooking();
    }, [selectedServices, form.maNhanVien, form.ngayHen]);

    const loadServices = async () => {
        try {
            const res = await getAllServices();
            setServices(res.data.filter((item) => item.trangThai === 1));
        } catch (error) {
            console.log(error);
        }
    };

    const syncBooking = async () => {
        if (selectedServices.length === 0) {
            setEmployees([]);
            setSlots([]);
            setForm((prev) => ({
                ...prev,
                maNhanVien: "",
                gioHen: ""
            }));
            return;
        }

        try {
            const res = await filterBooking({
                selectedServices: selectedServices.map((item) => item.maDichVu),
                employeeId: form.maNhanVien ? Number(form.maNhanVien) : null,
                date: form.ngayHen || null
            });

            setEmployees(res.data.employees || []);
            setSlots(res.data.availableSlots || res.data.availableTimeSlots || []);

            if (
                form.maNhanVien &&
                !(res.data.employees || []).some(
                    (nv) => nv.maNhanVien === Number(form.maNhanVien)
                )
            ) {
                setForm((prev) => ({
                    ...prev,
                    maNhanVien: "",
                    gioHen: ""
                }));
            }
        } catch (error) {
            console.log(error);
        }
    };

    const addService = async (service) => {
        const existed = selectedServices.some(
            (item) => item.maDichVu === service.maDichVu
        );

        if (existed) {
            alert("Dịch vụ này đã được chọn");
            return;
        }

        const newSelected = [...selectedServices, service];

        try {
            const res = await filterBooking({
                selectedServices: newSelected.map((item) => item.maDichVu),
                employeeId: null,
                date: null
            });

            if (!res.data.employees || res.data.employees.length === 0) {
                alert("Không có nhân viên nào thực hiện được toàn bộ các dịch vụ đã chọn");
                return;
            }

            setSelectedServices(newSelected);
            setForm({
                maNhanVien: "",
                ngayHen: "",
                gioHen: ""
            });
        } catch (error) {
            console.log(error);
            alert("Không thể kiểm tra dịch vụ");
        }
    };

    const removeService = (id) => {
        setSelectedServices(
            selectedServices.filter((item) => item.maDichVu !== id)
        );

        setForm({
            maNhanVien: "",
            ngayHen: "",
            gioHen: ""
        });
    };

    const change = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const totalMoney = selectedServices.reduce(
        (sum, item) => sum + Number(item.gia || 0),
        0
    );

    const totalTime = selectedServices.reduce(
        (sum, item) => sum + Number(item.thoiGianThucHien || 0),
        0
    );

    const submit = async (e) => {
        e.preventDefault();

        if (!userId) {
            alert("Vui lòng đăng nhập để đặt lịch");
            return;
        }

        if (selectedServices.length === 0) {
            alert("Vui lòng chọn ít nhất một dịch vụ");
            return;
        }

        if (!form.maNhanVien || !form.ngayHen || !form.gioHen) {
            alert("Vui lòng chọn nhân viên, ngày và giờ hẹn");
            return;
        }

        try {
            await taoLich({
                maKhachHang: Number(userId),
                maNhanVien: Number(form.maNhanVien),
                ngayHen: form.ngayHen,
                gioHen: form.gioHen,
                danhSachDichVu: selectedServices.map((item) => item.maDichVu)
            });

            alert("Đặt lịch thành công. Lịch hẹn đang chờ admin xác nhận.");

            setSelectedServices([]);
            setEmployees([]);
            setSlots([]);
            setForm({
                maNhanVien: "",
                ngayHen: "",
                gioHen: ""
            });
        } catch (error) {
            console.log(error);
            alert(error.response?.data || "Đặt lịch thất bại");
        }
    };

    return (
        <div className="container py-5">
            <div className="text-center mb-5">
                <h2>ĐẶT LỊCH CẮT TÓC</h2>
                <p className="text-muted">
                    Chọn nhiều dịch vụ, sau đó chọn nhân viên và khung giờ phù hợp.
                </p>
            </div>

            <div className="row g-4">
                <div className="col-lg-8">
                    <h4 className="mb-3">Chọn dịch vụ</h4>

                    <div className="row g-4">
                        {services.map((service) => {
                            const selected = selectedServices.some(
                                (item) => item.maDichVu === service.maDichVu
                            );

                            return (
                                <div className="col-md-4" key={service.maDichVu}>
                                    <div className="card border-0 shadow-sm h-100">
                                        {service.anhGioiThieu && (
                                            <img
                                                src={service.anhGioiThieu}
                                                alt={service.tenDichVu}
                                                style={{
                                                    height: "170px",
                                                    objectFit: "cover"
                                                }}
                                            />
                                        )}

                                        <div className="card-body">
                                            <h6 className="fw-bold">
                                                {service.tenDichVu}
                                            </h6>

                                            <p className="text-muted mb-1">
                                                {service.thoiGianThucHien} phút
                                            </p>

                                            <p className="text-danger fw-bold">
                                                {Number(service.gia).toLocaleString()} VNĐ
                                            </p>

                                            <button
                                                className={
                                                    selected
                                                        ? "btn btn-secondary w-100"
                                                        : "btn btn-dark w-100"
                                                }
                                                disabled={selected}
                                                onClick={() => addService(service)}
                                            >
                                                {selected ? "Đã chọn" : "+ Thêm"}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="col-lg-4">
                    <div className="card border-0 shadow-sm sticky-top">
                        <div className="card-header bg-white fw-bold">
                            Thông tin đặt lịch
                        </div>

                        <div className="card-body">
                            <h6>Dịch vụ đã chọn</h6>

                            {selectedServices.length === 0 && (
                                <p className="text-muted">Chưa chọn dịch vụ</p>
                            )}

                            {selectedServices.map((item) => (
                                <div
                                    key={item.maDichVu}
                                    className="d-flex justify-content-between align-items-center border-bottom py-2"
                                >
                                    <div>
                                        <div className="fw-semibold">
                                            {item.tenDichVu}
                                        </div>
                                        <small>
                                            {item.thoiGianThucHien} phút -{" "}
                                            {Number(item.gia).toLocaleString()} VNĐ
                                        </small>
                                    </div>

                                    <button
                                        className="btn btn-sm btn-outline-danger"
                                        onClick={() => removeService(item.maDichVu)}
                                    >
                                        X
                                    </button>
                                </div>
                            ))}

                            <div className="mt-3">
                                <p className="mb-1">
                                    <b>Tổng thời gian:</b> {totalTime} phút
                                </p>
                                <p>
                                    <b>Tổng tiền:</b>{" "}
                                    <span className="text-danger fw-bold">
                                        {totalMoney.toLocaleString()} VNĐ
                                    </span>
                                </p>
                            </div>

                            <form onSubmit={submit}>
                                <div className="mb-3">
                                    <label className="form-label">Nhân viên phù hợp</label>
                                    <select
                                        className="form-select"
                                        name="maNhanVien"
                                        value={form.maNhanVien}
                                        onChange={change}
                                        disabled={selectedServices.length === 0}
                                        required
                                    >
                                        <option value="">
                                            -- Chọn nhân viên --
                                        </option>

                                        {employees.map((nv) => (
                                            <option
                                                key={nv.maNhanVien}
                                                value={nv.maNhanVien}
                                            >
                                                {nv.hoTen}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Ngày hẹn</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        name="ngayHen"
                                        value={form.ngayHen}
                                        onChange={change}
                                        min={new Date().toISOString().split("T")[0]}
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Giờ trống</label>
                                    <select
                                        className="form-select"
                                        name="gioHen"
                                        value={form.gioHen}
                                        onChange={change}
                                        disabled={!form.maNhanVien || !form.ngayHen}
                                        required
                                    >
                                        <option value="">
                                            -- Chọn giờ --
                                        </option>

                                        {slots.map((slot, index) => (
                                            <option key={index} value={slot.start}>
                                                {slot.start} - {slot.end}
                                            </option>
                                        ))}
                                    </select>

                                    {form.maNhanVien && form.ngayHen && slots.length === 0 && (
                                        <small className="text-danger">
                                            Không còn khung giờ phù hợp trong ngày này.
                                        </small>
                                    )}
                                </div>

                                <button className="btn btn-dark w-100">
                                    Xác nhận đặt lịch
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BookingPage;