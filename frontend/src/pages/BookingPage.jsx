import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getAllServices } from "../api/dichVuApi";
import { taoLich } from "../api/lichHenApi";
import { filterBooking } from "../api/bookingApi";

function BookingPage() {
    const userId = localStorage.getItem("userId");
    const location = useLocation();
    const serviceIdFromDetail = location.state?.serviceId;

    const [services, setServices] = useState([]);
    const [selectedServices, setSelectedServices] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [slots, setSlots] = useState([]);

    const [form, setForm] = useState({
        maNhanVien: "",
        ngayHen: "",
        gioHen: ""
    });

    const formatDate = (date) => {
        return date.toISOString().split("T")[0];
    };

    const today = new Date();
    const maxDate = new Date();
    maxDate.setDate(today.getDate() + 7);

    const minBookingDate = formatDate(today);
    const maxBookingDate = formatDate(maxDate);

    const filterValidSlots = (slotList, selectedDate) => {
        if (!selectedDate) return slotList;

        if (selectedDate !== minBookingDate) {
            return slotList;
        }

        const now = new Date();

        return slotList.filter((slot) => {
            const startTime = slot.start;
            const [hour, minute] = startTime.split(":").map(Number);

            const slotDateTime = new Date();
            slotDateTime.setHours(hour, minute, 0, 0);

            return slotDateTime > now;
        });
    };

    useEffect(() => {
        loadServices();
    }, []);

    useEffect(() => {
        syncBooking();
    }, [selectedServices, form.maNhanVien, form.ngayHen]);

    const loadServices = async () => {
        try {
            const res = await getAllServices();

            const activeServices = res.data.filter(
                (item) => item.trangThai === 1
            );

            setServices(activeServices);

            if (serviceIdFromDetail) {
                const service = activeServices.find(
                    (item) => item.maDichVu === Number(serviceIdFromDetail)
                );

                if (service) {
                    setSelectedServices([service]);
                }
            }
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

            const availableSlots = res.data.availableSlots || [];
            const validSlots = filterValidSlots(availableSlots, form.ngayHen);

            setEmployees(res.data.employees || []);
            setSlots(validSlots);

            if (
                form.gioHen &&
                form.ngayHen &&
                !validSlots.some((slot) => slot.start === form.gioHen)
            ) {
                setForm((prev) => ({
                    ...prev,
                    gioHen: ""
                }));
            }
        } catch (error) {
            console.log(error);
        }
    };

    const addService = (service) => {
        const existed = selectedServices.some(
            (item) => item.maDichVu === service.maDichVu
        );

        if (existed) {
            alert("Dịch vụ này đã được chọn");
            return;
        }

        setSelectedServices([...selectedServices, service]);
    };

    const removeService = (id) => {
        setSelectedServices(
            selectedServices.filter((item) => item.maDichVu !== id)
        );
    };

    const change = (e) => {
        const { name, value } = e.target;

        if (name === "maNhanVien") {
            setForm({
                ...form,
                maNhanVien: value,
                gioHen: ""
            });
            return;
        }

        if (name === "ngayHen") {
            setForm({
                ...form,
                ngayHen: value,
                gioHen: ""
            });
            return;
        }

        setForm({
            ...form,
            [name]: value
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

    const validateBookingTime = () => {
        if (form.ngayHen < minBookingDate) {
            alert("Không được đặt lịch trong quá khứ");
            return false;
        }

        if (form.ngayHen > maxBookingDate) {
            alert("Chỉ được đặt lịch trong vòng 7 ngày sắp tới");
            return false;
        }

        if (form.ngayHen === minBookingDate && form.gioHen) {
            const [hour, minute] = form.gioHen.split(":").map(Number);

            const slotDateTime = new Date();
            slotDateTime.setHours(hour, minute, 0, 0);

            if (slotDateTime <= new Date()) {
                alert("Không được chọn giờ đã qua");
                return false;
            }
        }

        return true;
    };

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

        if (!form.ngayHen || !form.gioHen) {
            alert("Vui lòng chọn ngày và giờ hẹn");
            return;
        }

        if (!validateBookingTime()) return;

        try {
            await taoLich({
                maKhachHang: Number(userId),
                maNhanVien: form.maNhanVien ? Number(form.maNhanVien) : null,
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

    const formatSlotTime = (time) => {
        if (!time) return "";
        return time.slice(0, 5).replace(":", "h");
    };

    return (
        <div className="container py-5">
            <div className="text-center mb-5">
                <h2>ĐẶT LỊCH CẮT TÓC</h2>
                <p className="text-muted">
                    Chọn dịch vụ, ngày giờ. Nếu không chọn nhân viên, hệ thống sẽ tự phân công.
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
                                                type="button"
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
                                        type="button"
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
                                    <label className="form-label">Nhân viên</label>
                                    <select
                                        className="form-select"
                                        name="maNhanVien"
                                        value={form.maNhanVien}
                                        onChange={change}
                                        disabled={selectedServices.length === 0}
                                    >
                                        <option value="">
                                            Hệ thống tự chọn nhân viên
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
                                        min={minBookingDate}
                                        max={maxBookingDate}
                                        required
                                    />
                                    <small className="text-muted">
                                        Chỉ được đặt lịch trong vòng 7 ngày sắp tới.
                                    </small>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-bold">Chọn giờ trống</label>
                                    <p className="text-muted mb-2">Vui lòng chọn khung giờ phù hợp</p>

                                    <div className="row g-2">
                                        {slots.map((slot, index) => {
                                            const selected = form.gioHen === slot.start;

                                            return (
                                                <div className="col-4" key={index}>
                                                    <button
                                                        type="button"
                                                        className={
                                                            selected
                                                                ? "btn btn-dark w-100 py-3"
                                                                : "btn btn-outline-dark w-100 py-3"
                                                        }
                                                        disabled={!form.ngayHen || selectedServices.length === 0}
                                                        onClick={() =>
                                                            setForm({
                                                                ...form,
                                                                gioHen: slot.start
                                                            })
                                                        }
                                                    >
                                                        {formatSlotTime(slot.start)}
                                                    </button>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {form.ngayHen && selectedServices.length > 0 && slots.length === 0 && (
                                        <small className="text-danger d-block mt-2">
                                            Không còn khung giờ phù hợp trong ngày này.
                                        </small>
                                    )}

                                    {form.ngayHen && selectedServices.length > 0 && !form.gioHen && slots.length > 0 && (
                                        <small className="text-danger d-block mt-2">
                                            Vui lòng chọn giờ đặt lịch.
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